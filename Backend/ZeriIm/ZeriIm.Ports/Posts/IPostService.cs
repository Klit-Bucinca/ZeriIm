using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Zerilm.Ports.Posts.Models;
using Zerilm.Ports.Shared;

namespace Zerilm.Ports.Posts;

public interface IPostService
{
    Task<Guid> CreateAsync(CreatePostRequest request, CancellationToken cancellationToken = default);
    Task UpdateAsync(UpdatePostRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid postId, Guid currentUserId, CancellationToken cancellationToken = default);

    Task<PostDetailsDto?> GetByIdAsync(Guid postId, Guid? currentUserId,
        CancellationToken cancellationToken = default);

    Task<PagedResult<PostSummaryDto>> SearchAsync(PostSearchCriteria criteria,
        CancellationToken cancellationToken = default);
}