using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeriIm.Application.DTOs.Auth;

namespace ZeriIm.Application.Interfaces
{
   public interface  IAuthService
    {
        Task<RegisterUserResponseDto> RegisterAsync(RegisterUserDto dto);
        Task<LoginResponseDto> LoginAsync(LoginUserDto dto);
        Task<LoginResponseDto> RefreshTokenAsync(string refreshToken);
    }
}
