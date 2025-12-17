using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZeriIm.Application.DTOs.Users;
using ZeriIm.Application.Interfaces;
using ZeriIm.Application.Services;


namespace ZeriIm.Ports.Inbound
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly IImageService _imageService;
        private readonly IFileService _fileService;

        public UserController(
            IUserRepository users,
            IImageService imageService,
            IFileService fileService)
        {
            _users = users;
            _imageService = imageService;
            _fileService = fileService;
        }

        // =================== GET ALL ====================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _users.GetAllAsync());
        }

        // =================== GET BY ID ====================
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var user = await _users.GetByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        // =================== DELETE ====================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _users.DeleteAsync(id);
            return NoContent();
        }

        // =================== PROFILE IMAGE UPLOAD ====================
        [HttpPost("{id}/upload-profile-image")]
        public async Task<IActionResult> UploadProfileImage(Guid id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File must be provided");

            var imagePath = await _imageService.SaveProfileImageAsync(file, id);
            await _users.UpdateProfileImageAsync(id, imagePath);

            return Ok(new { imagePath });
        }

        // =================== SIMPLE FILE UPLOAD ====================
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var fileName = await _fileService.SaveFileAsync(file);

            return Ok(new
            {
                fileName,
                url = $"https://localhost:7038/Uploads/{fileName}"
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserUpdateDto dto)
        {
            var user = await _users.GetByIdAsync(id);
            if (user == null) return NotFound();

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Role = dto.Role;

            await _users.UpdateAsync(user); // ose repo method që bën SaveChanges
            return Ok(user);
        }

    }
}
