using Microsoft.AspNetCore.Mvc;
using ZeriIm.Ports.Posts;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categories;

    public CategoriesController(ICategoryRepository categories) => _categories = categories;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var items = await _categories.ListAsync(ct);
        var result = items.Select(c => new { c.Id, c.Name });
        return Ok(result);
    }
}
