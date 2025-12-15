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

public class VoteRepository : IVoteRepository
{
    private readonly ZeriImDbContext _db;

    public VoteRepository(ZeriImDbContext db) => _db = db;

    public async Task<Vote?> GetUserVoteAsync(Guid postId, Guid userId, CancellationToken ct = default)
    {
        return await _db.Votes.FirstOrDefaultAsync(
            v => v.PostId == postId && v.UserId == userId, ct);
    }

    public async Task AddAsync(Vote vote, CancellationToken ct = default)
    {
        await _db.Votes.AddAsync(vote, ct);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Vote vote, CancellationToken ct = default)
    {
        _db.Votes.Update(vote);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Vote vote, CancellationToken ct = default)
    {
        _db.Votes.Remove(vote);
        await _db.SaveChangesAsync(ct);
    }
}
