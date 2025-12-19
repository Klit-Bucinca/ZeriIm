using Microsoft.AspNetCore.Mvc;
using ZeriIm.Ports.Posts;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PriorityController : ControllerBase
{
    private readonly IPostRepository _posts;
    private readonly ICategoryRepository _categories;

    public PriorityController(IPostRepository posts, ICategoryRepository categories)
    {
        _posts = posts;
        _categories = categories;
    }

    [HttpGet("top")]
    public async Task<IActionResult> GetTopPerMunicipality(
        [FromQuery] int year,
        [FromQuery] int month,
        [FromQuery] int limit = 10,
        CancellationToken ct = default)
    {
        if (year <= 0 || month < 1 || month > 12)
        {
            var now = DateTime.UtcNow;
            year = now.Year;
            month = now.Month;
        }

        limit = limit <= 0 ? 10 : Math.Min(limit, 50);

        var posts = await _posts.GetByMonthAsync(year, month, ct);
        var categories = await _categories.ListAsync(ct);
        var categoryLookup = categories.ToDictionary(c => c.Id, c => c.Name);

        var grouped = posts
            .GroupBy(p => p.Municipality ?? "Të panjohur")
            .Select(g => new
            {
                Municipality = g.Key,
                Posts = g
                    .OrderByDescending(p => p.Votes.Sum(v => (int)v.Type))
                    .ThenByDescending(p => p.CreatedAt)
                    .Take(limit)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Content,
                        CategoryName = categoryLookup.TryGetValue(p.CategoryId, out var name) ? name : "Unknown",
                        Score = p.Votes.Sum(v => (int)v.Type),
                        p.CreatedAt,
                        ThumbnailUrl = p.Images
                            .OrderBy(i => i.Order)
                            .Select(i => i.Url)
                            .FirstOrDefault()
                    })
                    .ToList()
            })
            .OrderBy(g => g.Municipality)
            .ToList();

        return Ok(new
        {
            Year = year,
            Month = month,
            Limit = limit,
            Items = grouped
        });
    }
}
