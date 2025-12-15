using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Domain.Posts;

public sealed class Comment
{
    private readonly List<Comment> _replies = new();

    private Comment() { } // EF Core

    public Guid Id { get; private set; }
    public Guid PostId { get; private set; }
    public Guid AuthorId { get; private set; }
    public Guid? ParentCommentId { get; private set; } // null => top-level
    public string Content { get; private set; } = null!;
    public bool IsEdited { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public IReadOnlyCollection<Comment> Replies => _replies;

    private Comment(Guid postId, Guid authorId, string content, Guid? parentCommentId)
    {
        Id = Guid.NewGuid();
        PostId = postId;
        AuthorId = authorId;
        ParentCommentId = parentCommentId;
        Content = content;
        IsEdited = false;
        CreatedAt = DateTime.UtcNow;
    }

    public static Comment Create(Guid postId, Guid authorId, string content, Guid? parentCommentId = null)
        => new(postId, authorId, content, parentCommentId);

    public void Edit(string newContent)
    {
        Content = newContent;
        IsEdited = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public Comment AddReply(Guid authorId, string content)
    {
        var reply = Create(PostId, authorId, content, Id);
        _replies.Add(reply);
        return reply;
    }
}
