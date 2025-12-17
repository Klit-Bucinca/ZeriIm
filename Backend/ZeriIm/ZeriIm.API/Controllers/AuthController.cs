using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZeriIm.Application.DTOs.Auth;
using ZeriIm.Application.Interfaces;


namespace ZeriIm.API.Controllers
{
    [ApiController]
    [Route("scalar/v1/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ============================
        // REGISTER
        // ============================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(dto);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ============================
        // LOGIN
        // ============================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(dto);

            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }


        // ============================
        // REFRESH TOKEN
        // ============================
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RefreshTokenAsync(dto.RefreshToken);

            if (!result.Success)
                return StatusCode(StatusCodes.Status401Unauthorized, result);


            return Ok(result);
        }
    }
}
