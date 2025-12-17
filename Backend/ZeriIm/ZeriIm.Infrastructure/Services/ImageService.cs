using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using ZeriIm.Application.Interfaces;

namespace ZeriIm.Infrastructure.Services;

public class ImageService : IImageService
{
    private readonly IHostEnvironment _env;

    public ImageService(IHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveProfileImageAsync(IFormFile image, Guid userId)
    {
        if (image == null || image.Length == 0)
            throw new Exception("Invalid image");

        string uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads/profile-images");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        string fileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        string filePath = Path.Combine(uploadsFolder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await image.CopyToAsync(stream);

        return $"profile-images/{fileName}";
    }
}
