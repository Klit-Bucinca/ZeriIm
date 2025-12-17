namespace ZeriIm.Application.DTOs.Auth
{
    public class TokenResponseDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }

        public string Role { get; set; }
    }
}
