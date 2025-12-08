using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zerilm.Ports.Posts.Models;

public sealed class PostSummaryDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public string Municipality { get; init; } = null!;
    public string CategoryName { get; init; } = null!;
    public int Score { get; init; }
    public int CommentCount { get; init; }
    public DateTime CreatedAt { get; init; }
    public string ThumbnailUrl { get; init; } = null!;
}