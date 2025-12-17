using Microsoft.AspNetCore.Mvc;
using ZeriIm.Ports.Posts;
using ZeriIm.Domain.Posts;

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
        var result = items.Select(c => new { c.Id, c.Name, c.Description });
        return Ok(result.ToList());
    }

    public record CategoryRequest(string Name, string? Description);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Emri i kategorise eshte i detyrueshem.");
        }

        var category = new Category(request.Name.Trim(), request.Description?.Trim());
        await _categories.AddAsync(category, ct);

        return Ok(new { category.Id, category.Name, category.Description });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CategoryRequest request, CancellationToken ct)
    {
        var category = await _categories.GetByIdAsync(id, ct);
        if (category is null) return NotFound();

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            category.Rename(request.Name.Trim());
        }
        category.ChangeDescription(request.Description?.Trim());

        await _categories.UpdateAsync(category, ct);
        return Ok(new { category.Id, category.Name, category.Description });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _categories.DeleteAsync(id, ct);
        return NoContent();
    }
}
