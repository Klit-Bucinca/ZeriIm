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
    private readonly ZeriImDbContext _db;

    public CategoryRepository(ZeriImDbContext db) => _db = db;

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<IReadOnlyList<Category>> ListAsync(CancellationToken ct = default)
    {
        return await _db.Categories.AsNoTracking().OrderBy(c => c.Name).ToListAsync(ct);
    }

    public async Task AddAsync(Category category, CancellationToken ct = default)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        _db.Categories.Update(category);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (entity is null) return;
        _db.Categories.Remove(entity);
        await _db.SaveChangesAsync(ct);
    }
}
