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
    private readonly IUserRepository _users;

    public PostService(IPostRepository posts, ICategoryRepository categories, IUserRepository users)
    {
        _posts = posts;
        _categories = categories;
        _users = users;
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

        var authorIds = new HashSet<Guid> { post.AuthorId };
        CollectAuthorIds(post.Comments, authorIds);

        var authorNames = new Dictionary<Guid, string>();
        foreach (var id in authorIds)
        {
            var user = await _users.GetByIdAsync(id);
            var name = user?.Username ?? user?.Email ?? "Unknown";
            authorNames[id] = string.IsNullOrWhiteSpace(name) ? "Unknown" : name;
        }

        // For now hardcode AuthorName & CategoryName, you can integrate with other modules later
        return new PostDetailsDto
        {
            Id = post.Id,
            AuthorId = post.AuthorId,
            AuthorName = authorNames.TryGetValue(post.AuthorId, out var an) ? an : "Unknown",
            Title = post.Title,
            Content = post.Content,
            Municipality = post.Municipality,
            CategoryName = category?.Name ?? "Unknown",
            Score = post.Score,
            UserVote = currentUserId.HasValue
                ? (int?)(post.Votes.FirstOrDefault(v => v.UserId == currentUserId.Value)?.Type) ?? 0
                : 0,
            ImageUrls = post.Images.OrderBy(i => i.Order).Select(i => i.Url).ToList(),
            ThumbnailUrl = post.Images.OrderBy(i => i.Order).FirstOrDefault()?.Url ?? string.Empty,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt,
            Comments = MapComments(post.Comments, authorNames)
        };
    }

    public async Task<PagedResult<PostSummaryDto>> SearchAsync(PostSearchCriteria criteria, Guid? currentUserId = default, CancellationToken ct = default)
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
            UserVote = currentUserId.HasValue
                ? (int?)(p.Votes.FirstOrDefault(v => v.UserId == currentUserId.Value)?.Type) ?? 0
                : 0,
            CommentCount = p.Comments.Count,
            CreatedAt = p.CreatedAt,
            ImageUrls = p.Images.OrderBy(i => i.Order).Select(i => i.Url).ToList(),
            ThumbnailUrl = p.Images.OrderBy(i => i.Order).FirstOrDefault()?.Url ?? string.Empty
        });

        return new PagedResult<PostSummaryDto>(summaries, result.Page, result.PageSize, result.TotalCount);
    }

    private static void CollectAuthorIds(IEnumerable<Comment> comments, HashSet<Guid> ids)
    {
        foreach (var c in comments)
        {
            ids.Add(c.AuthorId);
            if (c.Replies is { Count: > 0 })
            {
                CollectAuthorIds(c.Replies, ids);
            }
        }
    }

    private static IReadOnlyCollection<CommentDto> MapComments(IEnumerable<Comment> comments, IReadOnlyDictionary<Guid, string> authorNames)
        => comments
            .Where(c => c.ParentCommentId is null)
            .OrderBy(c => c.CreatedAt)
            .Select(c => MapCommentWithReplies(c, authorNames))
            .ToList();

    private static CommentDto MapCommentWithReplies(Comment c, IReadOnlyDictionary<Guid, string> authorNames)
    {
        return new CommentDto
        {
            Id = c.Id,
            AuthorId = c.AuthorId,
            AuthorName = "Anonim",
            Content = c.Content,
            IsEdited = c.IsEdited,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            Replies = c.Replies.Select(r => MapCommentWithReplies(r, authorNames)).ToList()
        };
    }
}
