using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Domain.Posts;
using ZeriIm.Ports.Posts.Models;
using ZeriIm.Ports.Shared;

namespace ZeriIm.Ports.Posts;

public interface IPostRepository
{
    Task<Post?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Post post, CancellationToken cancellationToken = default);
    Task UpdateAsync(Post post, CancellationToken cancellationToken = default);
    Task DeleteAsync(Post post, CancellationToken cancellationToken = default);
    Task<PagedResult<Post>> SearchAsync(PostSearchCriteria criteria,
        CancellationToken cancellationToken = default);
}