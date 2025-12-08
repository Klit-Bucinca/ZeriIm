using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using ZeriIm.Domain.Posts;
using ZeriIm.Ports.Posts;
using ZeriIm.Infrastructure.Persistence;

namespace ZeriIm.Infrastructure.Repositories.Posts;

public class CategoryRepository : ICategoryRepository
{
    private readonly ZerilmDbContext _db;

    public CategoryRepository(ZerilmDbContext db) => _db = db;

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
    }
}
