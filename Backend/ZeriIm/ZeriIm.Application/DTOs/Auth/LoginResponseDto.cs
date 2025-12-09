using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Success { get; set; }                 // nëse login u krye
        public string? AccessToken { get; set; }          // JWT
        public string? RefreshToken { get; set; }         // refresh token
        public DateTime? ExpiresAt { get; set; }          // kur skadon access token
        public string? Message { get; set; }

        public List<string>? Roles { get; set; }
    }
}
