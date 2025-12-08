using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zerilm.Ports.Posts.Models;

public sealed class CommentDto
{
    public Guid Id { get; init; }
    public Guid AuthorId { get; init; }
    public string AuthorName { get; init; } = null!;
    public string Content { get; init; } = null!;
    public bool IsEdited { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public IReadOnlyCollection<CommentDto> Replies { get; init; } = Array.Empty<CommentDto>();
}