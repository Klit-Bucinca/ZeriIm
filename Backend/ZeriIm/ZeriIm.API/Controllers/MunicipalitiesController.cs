using Microsoft.AspNetCore.Mvc;

namespace ZeriIm.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MunicipalitiesController : ControllerBase
{
    private static readonly IReadOnlyList<(Guid Id, string Name)> Municipalities = new List<(Guid, string)>
    {
        (Guid.Parse("00000000-0000-0000-0000-000000001111"), "Prishtine"),
        (Guid.Parse("00000000-0000-0000-0000-000000001112"), "Prizren"),
        (Guid.Parse("00000000-0000-0000-0000-000000001113"), "Gjakove"),
    };

    [HttpGet]
    public IActionResult GetAll()
    {
        var result = Municipalities.Select(m => new { m.Id, m.Name });
        return Ok(result);
    }
}
