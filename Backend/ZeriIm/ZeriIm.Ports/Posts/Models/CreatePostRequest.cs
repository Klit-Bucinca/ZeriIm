using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Ports.Posts.Models;

public sealed class CreatePostRequest
{
    public Guid AuthorId { get; init; }
    public Guid CategoryId { get; init; }
    public Guid MunicipalityId { get; init; }
    public string MunicipalityName { get; init; } = null!;
    public string Title { get; init; } = string.Empty;
    public string Content { get; init; } = null!;
    public List<string> ImageUrls { get; init; } = new();
}
