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

public class CommentRepository : ICommentRepository
{
    private readonly
        ZeriImDbContext _db;

    public CommentRepository(ZeriImDbContext db) => _db = db;

    public async Task<Comment?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Comments
            .Include(c => c.Replies)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task AddAsync(Comment comment, CancellationToken ct = default)
    {
        await _db.Comments.AddAsync(comment, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Comment comment, CancellationToken ct = default)
    {
        _db.Comments.Update(comment);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Comment comment, CancellationToken ct = default)
    {
        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync(ct);
    }
}
