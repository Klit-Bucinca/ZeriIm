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
        var category = await _categories.GetByIdAsync(request.CategoryId, ct);
        if (category is null)
            throw new InvalidOperationException("Category not found.");

        if (string.IsNullOrWhiteSpace(request.Content))
            throw new ArgumentException("Content is required.", nameof(request.Content));

        if (request.MunicipalityId == Guid.Empty || string.IsNullOrWhiteSpace(request.MunicipalityName))
            throw new ArgumentException("Municipality is required.", nameof(request.MunicipalityId));

        var derivedTitle = string.IsNullOrWhiteSpace(request.Title)
            ? request.Content.Length > 60
                ? request.Content.Substring(0, 60)
                : request.Content
            : request.Title;

        var post = Post.Create(
            request.AuthorId,
            request.CategoryId,
            request.MunicipalityName,
            derivedTitle,
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

        var category = await _categories.GetByIdAsync(post.CategoryId, ct);

        // For now hardcode AuthorName & CategoryName, you can integrate with other modules later
        return new PostDetailsDto
        {
            Id = post.Id,
            AuthorId = post.AuthorId,
            AuthorName = "Unknown",
            Title = post.Title,
            Content = post.Content,
            Municipality = post.Municipality,
            CategoryName = category?.Name ?? "Unknown",
            Score = post.Score,
            ImageUrls = post.Images.OrderBy(i => i.Order).Select(i => i.Url).ToList(),
            ThumbnailUrl = post.Images.OrderBy(i => i.Order).FirstOrDefault()?.Url ?? string.Empty,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            Comments = MapComments(post.Comments)
        };
    }

    public async Task<PagedResult<PostSummaryDto>> SearchAsync(PostSearchCriteria criteria, CancellationToken ct = default)
    {
        var result = await _posts.SearchAsync(criteria, ct);

        var categories = await _categories.ListAsync(ct);
        var categoryLookup = categories.ToDictionary(c => c.Id, c => c.Name);

        var summaries = result.Items.Select(p => new PostSummaryDto
        {
            Id = p.Id,
            Title = p.Title,
            Content = p.Content,
            Municipality = p.Municipality,
            CategoryName = categoryLookup.TryGetValue(p.CategoryId, out var name) ? name : "Unknown",
            Score = p.Score,
            CommentCount = p.Comments.Count,
            CreatedAt = p.CreatedAt,
            ImageUrls = p.Images.OrderBy(i => i.Order).Select(i => i.Url).ToList(),
            ThumbnailUrl = p.Images.OrderBy(i => i.Order).FirstOrDefault()?.Url ?? string.Empty
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
