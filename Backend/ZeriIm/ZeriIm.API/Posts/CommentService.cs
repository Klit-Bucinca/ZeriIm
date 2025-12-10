using ZeriIm.Domain.Posts;
using ZeriIm.Ports.Posts;
using ZeriIm.Ports.Posts.Models;

namespace ZeriIm.Application.Posts;

public sealed class CommentService : ICommentService
{
    private readonly IPostRepository _posts;
    private readonly ICommentRepository _comments;

    public CommentService(IPostRepository posts, ICommentRepository comments)
    {
        _posts = posts;
        _comments = comments;
    }

    public async Task<Guid> CreateAsync(CreateCommentRequest request, CancellationToken ct = default)
    {
        var post = await _posts.GetByIdAsync(request.PostId, ct)
                   ?? throw new InvalidOperationException("Post not found.");

        Comment comment;

        if (request.ParentCommentId is null)
        {
            // Top-level comment on the post
            comment = Comment.Create(post.Id, request.AuthorId, request.Content);
            post.AddComment(comment);

            // Persist new comment + updated post aggregate
            await _comments.AddAsync(comment, ct);
            await _posts.UpdateAsync(post, ct);
        }
        else
        {
            // Reply to an existing comment
            var parent = await _comments.GetByIdAsync(request.ParentCommentId.Value, ct)
                         ?? throw new InvalidOperationException("Parent comment not found.");

            comment = parent.AddReply(request.AuthorId, request.Content);

            // Persist new reply + updated parent comment
            await _comments.AddAsync(comment, ct);
            await _comments.UpdateAsync(parent, ct);
        }

        return comment.Id;
    }

    public async Task EditAsync(Guid commentId, Guid currentUserId, string newContent, CancellationToken ct = default)
    {
        var comment = await _comments.GetByIdAsync(commentId, ct)
                      ?? throw new InvalidOperationException("Comment not found.");

        if (comment.AuthorId != currentUserId)
            throw new InvalidOperationException("Not allowed to edit this comment.");

        comment.Edit(newContent);
        await _comments.UpdateAsync(comment, ct);
    }

    public async Task DeleteAsync(Guid commentId, Guid currentUserId, CancellationToken ct = default)
    {
        var comment = await _comments.GetByIdAsync(commentId, ct)
                      ?? throw new InvalidOperationException("Comment not found.");

        if (comment.AuthorId != currentUserId)
            throw new InvalidOperationException("Not allowed to delete this comment.");

        await _comments.DeleteAsync(comment, ct);
    }
}
