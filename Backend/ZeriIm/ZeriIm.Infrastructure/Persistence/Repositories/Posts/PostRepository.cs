using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using ZeriIm.Domain.Posts;
using ZeriIm.Ports.Posts;
using ZeriIm.Ports.Posts.Models;
using ZeriIm.Ports.Shared;
using ZeriIm.Ports.Posts.Enums;
using ZeriIm.Infrastructure.Persistence;

namespace ZeriIm.Infrastructure.Repositories.Posts;

public class PostRepository : IPostRepository
{
    private readonly ZerilmDbContext _db;

    public PostRepository(ZerilmDbContext db) => _db = db;

    public async Task<Post?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Posts
            .Include(p => p.Comments)
            .ThenInclude(c => c.Replies)
            .Include(p => p.Votes)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task AddAsync(Post post, CancellationToken ct = default)
    {
        await _db.Posts.AddAsync(post, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Post post, CancellationToken ct = default)
    {
        _db.Posts.Update(post);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Post post, CancellationToken ct = default)
    {
        _db.Posts.Remove(post);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<PagedResult<Post>> SearchAsync(PostSearchCriteria criteria, CancellationToken ct = default)
    {
        var query = _db.Posts
            .Include(p => p.Comments)
            .Include(p => p.Votes)
            .Include(p => p.Images)
            .AsQueryable();

        if (criteria.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == criteria.CategoryId.Value);

        if (!string.IsNullOrWhiteSpace(criteria.Municipality))
            query = query.Where(p => p.Municipality == criteria.Municipality);

        if (!string.IsNullOrWhiteSpace(criteria.SearchTerm))
        {
            var term = criteria.SearchTerm.Trim();
            query = query.Where(p => p.Title.Contains(term) || p.Content.Contains(term));
        }

        query = criteria.SortBy switch
        {
            PostSortBy.Oldest => query.OrderBy(p => p.CreatedAt),
            PostSortBy.MostUpvoted => query.OrderByDescending(p => p.Votes.Sum(v => (int)v.Type)),
            _ => query.OrderByDescending(p => p.CreatedAt),
        };

        var total = await query.CountAsync(ct);

        var items = await query
            .Skip((criteria.Page - 1) * criteria.PageSize)
            .Take(criteria.PageSize)
            .ToListAsync(ct);

        return new PagedResult<Post>(items, criteria.Page, criteria.PageSize, total);
    }
}
