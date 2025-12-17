using Microsoft.AspNetCore.Http;

namespace ZeriIm.Application.DTOs.Auth

{
    public class RegisterUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public IFormFile ProfileImage { get; set; }

    }
}
