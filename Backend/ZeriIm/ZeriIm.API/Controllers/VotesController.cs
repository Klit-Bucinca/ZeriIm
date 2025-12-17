using Microsoft.AspNetCore.Mvc;
using ZeriIm.Domain.Posts.Enums;
using ZeriIm.Ports.Posts;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VotesController : ControllerBase
{
    private readonly IVoteService _votes;
    private readonly IPostRepository _posts;

    public VotesController(IVoteService votes, IPostRepository posts)
    {
        _votes = votes;
        _posts = posts;
    }

    public sealed record VoteRequest(Guid PostId, Guid UserId, VoteType Type);

    [HttpPost]
    public async Task<IActionResult> Vote([FromBody] VoteRequest req, CancellationToken ct)
    {
        await _votes.VoteAsync(req.PostId, req.UserId, req.Type, ct);
        var post = await _posts.GetByIdAsync(req.PostId, ct);
        return Ok(new
        {
            score = post?.Score ?? 0,
            vote = req.Type
        });
    }

    [HttpDelete]
    public async Task<IActionResult> Remove([FromQuery] Guid postId, [FromQuery] Guid userId, CancellationToken ct)
    {
        await _votes.RemoveVoteAsync(postId, userId, ct);
        var post = await _posts.GetByIdAsync(postId, ct);
        return Ok(new
        {
            score = post?.Score ?? 0,
            vote = 0
        });
    }
}
