using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zerilm.Ports.Posts.Models;

public sealed class CreateCommentRequest
{
    public Guid PostId { get; init; }
    public Guid AuthorId { get; init; }
    public string Content { get; init; } = null!;
    public Guid? ParentCommentId { get; init; }
}