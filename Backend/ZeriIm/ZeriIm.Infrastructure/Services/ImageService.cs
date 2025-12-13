using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeriIm.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace ZeriIm.Infrastructure.Services
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public ImageService(IWebHostEnvironment env)
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

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }


            return $"uploads/profile-images/{fileName}";   // ✔️ sakte

        }
    }
}
