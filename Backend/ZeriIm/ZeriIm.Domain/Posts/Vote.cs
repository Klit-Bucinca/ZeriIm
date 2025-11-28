using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Zerilm.Domain.Posts.Enums;

namespace Zerilm.Domain.Posts;

public sealed class Vote
{
    private Vote() { } // EF Core

    public Guid Id { get; private set; }
    public Guid PostId { get; private set; }
    public Guid UserId { get; private set; }
    public VoteType Type { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Vote(Guid postId, Guid userId, VoteType type)
    {
        Id = Guid.NewGuid();
        PostId = postId;
        UserId = userId;
        Type = type;
        CreatedAt = DateTime.UtcNow;
    }

    public static Vote Create(Guid postId, Guid userId, VoteType type)
        => new(postId, userId, type);

    public void ChangeType(VoteType type)
    {
        if (Type == type) return;
        Type = type;
    }
}
