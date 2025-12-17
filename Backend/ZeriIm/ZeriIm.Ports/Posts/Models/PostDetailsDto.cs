using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Ports.Posts.Models;

public sealed class PostDetailsDto
{
    public Guid Id { get; init; }
    public Guid AuthorId { get; init; }
    public string AuthorName { get; init; } = null!;
    public string Title { get; init; } = null!;
    public string Content { get; init; } = null!;
    public string Municipality { get; init; } = null!;
    public string CategoryName { get; init; } = null!;
    public int Score { get; init; }
    public int UserVote { get; init; }
    public IReadOnlyCollection<string> ImageUrls { get; init; } = Array.Empty<string>();
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public IReadOnlyCollection<CommentDto> Comments { get; init; } = Array.Empty<CommentDto>();
    public string ThumbnailUrl { get; init; } = string.Empty;
}
