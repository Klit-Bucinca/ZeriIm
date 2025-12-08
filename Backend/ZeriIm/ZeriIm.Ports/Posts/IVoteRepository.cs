using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Zerilm.Domain.Posts;

namespace Zerilm.Ports.Posts;

public interface IVoteRepository
{
    Task<Vote?> GetUserVoteAsync(Guid postId, Guid userId,
        CancellationToken cancellationToken = default);

    Task AddAsync(Vote vote, CancellationToken cancellationToken = default);
    Task UpdateAsync(Vote vote, CancellationToken cancellationToken = default);
    Task DeleteAsync(Vote vote, CancellationToken cancellationToken = default);
}