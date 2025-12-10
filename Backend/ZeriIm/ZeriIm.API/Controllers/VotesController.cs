using Microsoft.AspNetCore.Mvc;
using ZeriIm.Domain.Posts.Enums;
using ZeriIm.Ports.Posts;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VotesController : ControllerBase
{
    private readonly IVoteService _votes;

    public VotesController(IVoteService votes) => _votes = votes;

    public sealed record VoteRequest(Guid PostId, Guid UserId, VoteType Type);

    [HttpPost]
    public async Task<IActionResult> Vote([FromBody] VoteRequest req, CancellationToken ct)
    {
        await _votes.VoteAsync(req.PostId, req.UserId, req.Type, ct);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Remove([FromQuery] Guid postId, [FromQuery] Guid userId, CancellationToken ct)
    {
        await _votes.RemoveVoteAsync(postId, userId, ct);
        return NoContent();
    }
}
