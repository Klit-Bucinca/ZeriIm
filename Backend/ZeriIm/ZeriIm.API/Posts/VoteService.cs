using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Domain.Posts;
using ZeriIm.Domain.Posts.Enums;
using ZeriIm.Ports.Posts;

namespace ZeriIm.Application.Posts;

public sealed class VoteService : IVoteService
{
    private readonly IPostRepository _posts;
    private readonly IVoteRepository _votes;

    public VoteService(IPostRepository posts, IVoteRepository votes)
    {
        _posts = posts;
        _votes = votes;
    }

    public async Task VoteAsync(Guid postId, Guid userId, VoteType type, CancellationToken ct = default)
    {
        var post = await _posts.GetByIdAsync(postId, ct)
                   ?? throw new InvalidOperationException("Post not found.");

        var existing = await _votes.GetUserVoteAsync(postId, userId, ct);

        if (existing is null)
        {
            var vote = Vote.Create(postId, userId, type);
            post.AddVote(vote);
            await _votes.AddAsync(vote, ct);
        }
        else
        {
            existing.ChangeType(type);
            await _votes.UpdateAsync(existing, ct);
        }

        await _posts.UpdateAsync(post, ct);
    }

    public async Task RemoveVoteAsync(Guid postId, Guid userId, CancellationToken ct = default)
    {
        var post = await _posts.GetByIdAsync(postId, ct)
                   ?? throw new InvalidOperationException("Post not found.");

        var existing = await _votes.GetUserVoteAsync(postId, userId, ct);
        if (existing is null) return;

        post.RemoveVote(existing);
        await _votes.DeleteAsync(existing, ct);
        await _posts.UpdateAsync(post, ct);
    }
}
