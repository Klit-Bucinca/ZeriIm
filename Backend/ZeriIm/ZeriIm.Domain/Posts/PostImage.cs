using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zerilm.Domain.Posts;

public sealed class PostImage
{
    private PostImage() { } // EF Core

    public Guid Id { get; private set; }
    public Guid PostId { get; private set; }
    public string Url { get; private set; } = null!;
    public int Order { get; private set; }  // for sorting in UI

    internal PostImage(Guid postId, string url, int order)
    {
        Id = Guid.NewGuid();
        PostId = postId;
        Url = url;
        Order = order;
    }
}
