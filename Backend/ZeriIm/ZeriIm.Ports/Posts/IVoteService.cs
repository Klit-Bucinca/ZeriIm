using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Domain.Posts.Enums;

namespace ZeriIm.Ports.Posts;

public interface IVoteService
{
    Task VoteAsync(Guid postId, Guid userId, VoteType type,
        CancellationToken cancellationToken = default);

    Task RemoveVoteAsync(Guid postId, Guid userId,
        CancellationToken cancellationToken = default);
}