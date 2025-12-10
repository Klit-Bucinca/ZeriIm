using Microsoft.AspNetCore.Mvc;
using ZeriIm.Ports.Posts;
using ZeriIm.Ports.Posts.Models;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _comments;

    public CommentsController(ICommentService comments) => _comments = comments;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCommentRequest request, CancellationToken ct)
    {
        var id = await _comments.CreateAsync(request, ct);
        return Ok(new { id });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Edit(Guid id, [FromQuery] Guid currentUserId, [FromBody] string content, CancellationToken ct)
    {
        await _comments.EditAsync(id, currentUserId, content, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] Guid currentUserId, CancellationToken ct)
    {
        await _comments.DeleteAsync(id, currentUserId, ct);
        return NoContent();
    }
}
