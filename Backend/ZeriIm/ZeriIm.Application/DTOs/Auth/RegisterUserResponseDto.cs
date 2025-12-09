using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.DTOs.Auth
{
    public class RegisterUserResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
    }
}
