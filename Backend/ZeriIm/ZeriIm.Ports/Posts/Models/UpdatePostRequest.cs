using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Ports.Posts.Models;

public sealed record UpdatePostRequest
{
    public Guid PostId { get; init; }
    public Guid CurrentUserId { get; init; }
    public Guid? CategoryId { get; init; }
    public string? Municipality { get; init; }
    public string Title { get; init; } = null!;
    public string Content { get; init; } = null!;
    public List<string>? ImageUrls { get; init; }
}