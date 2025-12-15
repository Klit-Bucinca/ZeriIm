using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Domain.Posts;

namespace ZeriIm.Ports.Posts;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Category>> ListAsync(CancellationToken cancellationToken = default);
}
