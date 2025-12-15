using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Domain.Posts.Enums;

namespace ZeriIm.Domain.Posts;

public sealed class Post
{
    private readonly List<Comment> _comments = new();
    private readonly List<Vote> _votes = new();
    private readonly List<PostImage> _images = new();

    private Post() { } // EF Core

    public Guid Id { get; private set; }
    public Guid AuthorId { get; private set; }
    public Guid CategoryId { get; private set; }
    public string Municipality { get; private set; } = null!;
    public string Title { get; private set; } = null!;
    public string Content { get; private set; } = null!;
    public PostStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public IReadOnlyCollection<Comment> Comments => _comments;
    public IReadOnlyCollection<Vote> Votes => _votes;
    public IReadOnlyCollection<PostImage> Images => _images;

    // Score calculated from votes (Up = +1, Down = -1)
    public int Score => _votes.Sum(v => (int)v.Type);

    private Post(
        Guid authorId,
        Guid categoryId,
        string municipality,
        string title,
        string content,
        IEnumerable<string> imageUrls)
    {
        Id = Guid.NewGuid();
        AuthorId = authorId;
        CategoryId = categoryId;
        Municipality = municipality;
        Title = title;
        Content = content;
        Status = PostStatus.Published;
        CreatedAt = DateTime.UtcNow;

        var urls = imageUrls.ToList();
        for (var i = 0; i < urls.Count; i++)
        {
            _images.Add(new PostImage(Id, urls[i], i));
        }
    }

    public static Post Create(
        Guid authorId,
        Guid categoryId,
        string municipality,
        string title,
        string content,
        IEnumerable<string> imageUrls)
        => new(authorId, categoryId, municipality, title, content, imageUrls);

    public void Edit(
        string title,
        string content,
        Guid? categoryId = null,
        string? municipality = null)
    {
        Title = title;
        Content = content;

        if (categoryId.HasValue)
            CategoryId = categoryId.Value;

        if (!string.IsNullOrWhiteSpace(municipality))
            Municipality = municipality;

        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeStatus(PostStatus status)
    {
        Status = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetImages(IEnumerable<string> imageUrls)
    {
        var urls = imageUrls.ToList();
        _images.Clear();
        for (var i = 0; i < urls.Count; i++)
        {
            _images.Add(new PostImage(Id, urls[i], i));
        }

        UpdatedAt = DateTime.UtcNow;
    }

    // These helpers will be used from Application layer:

    public void AddVote(Vote vote) => _votes.Add(vote);

    public void RemoveVote(Vote vote) => _votes.Remove(vote);

    public void AddComment(Comment comment) => _comments.Add(comment);
}
