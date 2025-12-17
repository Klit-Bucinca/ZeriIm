using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using ZeriIm.Domain;
using ZeriIm.Domain.Posts;
using ZeriIm.Domain.Users; // ✅ SHTUAR

namespace ZeriIm.Infrastructure.Persistence;

public class ZeriImDbContext : DbContext
{
    public ZeriImDbContext(DbContextOptions<ZeriImDbContext> options)
        : base(options) { }

    // ================= USERS =================
    public DbSet<User> Users => Set<User>(); // ✅ SHTUAR

    // ================= POSTS =================
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Vote> Votes => Set<Vote>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<PostImage> PostImages => Set<PostImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ZeriImDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
