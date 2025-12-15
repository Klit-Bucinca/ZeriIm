using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ZeriIm.Domain.Posts;

namespace ZeriIm.Infrastructure.Persistence.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Municipality).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Content).IsRequired();

        builder
            .HasMany(p => p.Comments)
            .WithOne()
            .HasForeignKey(nameof(Comment.PostId))
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasMany(p => p.Votes)
            .WithOne()
            .HasForeignKey(nameof(Vote.PostId))
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(p => p.Images)
            .WithOne()
            .HasForeignKey(nameof(PostImage.PostId))
            .OnDelete(DeleteBehavior.Cascade);
    }
}
