using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Domain.Posts;
using ZeriIm.Ports.Posts;
using ZeriIm.Ports.Posts.Models;
using ZeriIm.Ports.Shared;

namespace ZeriIm.Application.Posts;

public sealed class PostService : IPostService
{
    private readonly IPostRepository _posts;
    private readonly ICategoryRepository _categories;

    public PostService(IPostRepository posts, ICategoryRepository categories)
    {
        _posts = posts;
        _categories = categories;
    }

    public async Task<Guid> CreateAsync(CreatePostRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("Title is required.", nameof(request.Title));

        if (!request.ImageUrls.Any())
            throw new ArgumentException("At least one image is required.", nameof(request.ImageUrls));

        var category = await _categories.GetByIdAsync(request.CategoryId, ct);
        if (category is null)
            throw new InvalidOperationException("Category not found.");

        var post = Post.Create(
            request.AuthorId,
            request.CategoryId,
            request.Municipality,
            request.Title,
            request.Content,
            request.ImageUrls);

        await _posts.AddAsync(post, ct);
        return post.Id;
    }

    public async Task UpdateAsync(UpdatePostRequest request, CancellationToken ct = default)
    {
        var post = await _posts.GetByIdAsync(request.PostId, ct)
                   ?? throw new InvalidOperationException("Post not found.");

        if (post.AuthorId != request.CurrentUserId)
            throw new InvalidOperationException("Not allowed to edit this post.");

        post.Edit(request.Title, request.Content, request.CategoryId, request.Municipality);

        if (request.ImageUrls is not null)
            post.SetImages(request.ImageUrls);

        await _posts.UpdateAsync(post, ct);
    }

    public async Task DeleteAsync(Guid postId, Guid currentUserId, CancellationToken ct = default)
    {
        var post = await _posts.GetByIdAsync(postId, ct)
                   ?? throw new InvalidOperationException("Post not found.");

        if (post.AuthorId != currentUserId)
            throw new InvalidOperationException("Not allowed to delete this post.");

        await _posts.DeleteAsync(post, ct);
    }

    public async Task<PostDetailsDto?> GetByIdAsync(Guid postId, Guid? currentUserId, CancellationToken ct = default)
    {
        var post = await _posts.GetByIdAsync(postId, ct);
        if (post is null) return null;

        // For now hardcode AuthorName & CategoryName, you can integrate with other modules later
        return new PostDetailsDto
        {
            Id = post.Id,
            AuthorId = post.AuthorId,
            AuthorName = "Unknown",
            Title = post.Title,
            Content = post.Content,
            Municipality = post.Municipality,
            CategoryName = "Unknown",
            Score = post.Score,
            ImageUrls = post.Images.OrderBy(i => i.Order).Select(i => i.Url).ToList(),
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            Comments = MapComments(post.Comments)
        };
    }

    public async Task<PagedResult<PostSummaryDto>> SearchAsync(PostSearchCriteria criteria, CancellationToken ct = default)
    {
        var result = await _posts.SearchAsync(criteria, ct);

        var summaries = result.Items.Select(p => new PostSummaryDto
        {
            Id = p.Id,
            Title = p.Title,
            Municipality = p.Municipality,
            CategoryName = "Unknown",
            Score = p.Score,
            CommentCount = p.Comments.Count,
            CreatedAt = p.CreatedAt,
            ThumbnailUrl = p.Images.OrderBy(i => i.Order).First().Url
        });

        return new PagedResult<PostSummaryDto>(summaries, result.Page, result.PageSize, result.TotalCount);
    }

    private static IReadOnlyCollection<CommentDto> MapComments(IEnumerable<Comment> comments)
        => comments
            .Where(c => c.ParentCommentId is null)
            .OrderBy(c => c.CreatedAt)
            .Select(MapCommentWithReplies)
            .ToList();

    private static CommentDto MapCommentWithReplies(Comment c)
    {
        return new CommentDto
        {
            Id = c.Id,
            AuthorId = c.AuthorId,
            AuthorName = "Unknown",
            Content = c.Content,
            IsEdited = c.IsEdited,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            Replies = c.Replies.Select(MapCommentWithReplies).ToList()
        };
    }
}
