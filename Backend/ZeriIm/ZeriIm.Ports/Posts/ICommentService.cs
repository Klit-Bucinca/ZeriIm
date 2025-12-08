using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Zerilm.Ports.Posts.Models;

namespace Zerilm.Ports.Posts;

public interface ICommentService
{
    Task<Guid> CreateAsync(CreateCommentRequest request, CancellationToken cancellationToken = default);
    Task EditAsync(Guid commentId, Guid currentUserId, string newContent,
        CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid commentId, Guid currentUserId,
        CancellationToken cancellationToken = default);
}