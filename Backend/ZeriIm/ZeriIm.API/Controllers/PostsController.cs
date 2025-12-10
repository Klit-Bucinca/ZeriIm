using Microsoft.AspNetCore.Mvc;
using ZeriIm.Ports.Posts;
using ZeriIm.Ports.Posts.Models;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _posts;

    public PostsController(IPostService posts) => _posts = posts;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PostSearchCriteria criteria, CancellationToken ct)
    {
        var result = await _posts.SearchAsync(criteria, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
       
        var post = await _posts.GetByIdAsync(id, null, ct);
        if (post is null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePostRequest request, CancellationToken ct)
    {
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
