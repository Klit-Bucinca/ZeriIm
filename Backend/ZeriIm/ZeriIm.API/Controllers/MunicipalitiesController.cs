using Microsoft.AspNetCore.Mvc;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MunicipalitiesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var result = MunicipalitiesStore.GetAll().Select(m => new
        {
            m.Id,
            m.Name,
            m.Region,
            m.Population,
            m.Contact,
            m.CreatedAt,
            m.UpdatedAt
        });
        return Ok(result);
    }

    public sealed record MunicipalityDto(string Name, string Region, int? Population, string? Contact);

    [HttpPost]
    public IActionResult Create([FromBody] MunicipalityDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name required");
        var created = MunicipalitiesStore.Add(dto.Name.Trim(), dto.Region?.Trim() ?? string.Empty, dto.Population, dto.Contact?.Trim());
        return Ok(new
        {
            created.Id,
            created.Name,
            created.Region,
            created.Population,
            created.Contact,
            created.CreatedAt,
            created.UpdatedAt
        });
    }

    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, [FromBody] MunicipalityDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name required");
        var ok = MunicipalitiesStore.Update(id, dto.Name.Trim(), dto.Region?.Trim() ?? string.Empty, dto.Population, dto.Contact?.Trim());
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        var ok = MunicipalitiesStore.Delete(id);
        if (!ok) return NotFound();
        return NoContent();
    }
}
