using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Ports.Posts.Models;

public sealed class PostSummaryDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public string Content { get; init; } = string.Empty;
    public string Municipality { get; init; } = null!;
    public string CategoryName { get; init; } = null!;
    public int Score { get; init; }
    public int CommentCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public IReadOnlyCollection<string> ImageUrls { get; init; } = Array.Empty<string>();
    public string ThumbnailUrl { get; init; } = null!;
}
