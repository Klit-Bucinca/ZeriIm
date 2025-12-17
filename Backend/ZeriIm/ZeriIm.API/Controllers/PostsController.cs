using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZeriIm.Ports.Posts;
using ZeriIm.Ports.Posts.Models;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _posts;
    private readonly IWebHostEnvironment _env;

    private static readonly Guid SystemAuthorId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    private static readonly Dictionary<Guid, string> Municipalities = new()
    {
        { Guid.Parse("00000000-0000-0000-0000-000000001111"), "Prishtine" },
        { Guid.Parse("00000000-0000-0000-0000-000000001112"), "Prizren" },
        { Guid.Parse("00000000-0000-0000-0000-000000001113"), "Gjakove" },
    };

    public PostsController(IPostService posts, IWebHostEnvironment env)
    {
        _posts = posts;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PostSearchCriteria criteria, [FromQuery] Guid? currentUserId, CancellationToken ct)
    {
        var result = await _posts.SearchAsync(criteria, currentUserId, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, [FromQuery] Guid? currentUserId, CancellationToken ct)
    {
        var post = await _posts.GetByIdAsync(id, currentUserId, ct);
        if (post is null) return NotFound();
        return Ok(post);
    }

    public sealed record CreatePostForm(
        string Content,
        Guid CategoryId,
        Guid MunicipalityId,
        string? Title,
        IFormFileCollection? Images);

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreatePostForm form, CancellationToken ct)
    {
        if (!Municipalities.TryGetValue(form.MunicipalityId, out var municipalityName))
            return BadRequest("Municipality not found.");

        var uploadRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsPath = Path.Combine(uploadRoot, "uploads");
        Directory.CreateDirectory(uploadsPath);

        var imageUrls = new List<string>();
        if (form.Images is not null)
        {
            foreach (var file in form.Images)
            {
                if (file.Length <= 0) continue;
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var savePath = Path.Combine(uploadsPath, fileName);

                await using var stream = System.IO.File.Create(savePath);
                await file.CopyToAsync(stream, ct);

                imageUrls.Add($"/uploads/{fileName}");
            }
        }

        var request = new CreatePostRequest
        {
            AuthorId = SystemAuthorId,
            CategoryId = form.CategoryId,
            MunicipalityId = form.MunicipalityId,
            MunicipalityName = municipalityName,
            Title = form.Title ?? string.Empty,
            Content = form.Content,
            ImageUrls = imageUrls
        };

        var id = await _posts.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePostRequest body, CancellationToken ct)
    {
        var request = body with { PostId = id };
        await _posts.UpdateAsync(request, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] Guid currentUserId, CancellationToken ct)
    {
        await _posts.DeleteAsync(id, currentUserId, ct);
        return NoContent();
    }
}
