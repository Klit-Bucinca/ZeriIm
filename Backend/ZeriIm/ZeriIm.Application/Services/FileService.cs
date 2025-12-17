using Microsoft.AspNetCore.Http;

namespace ZeriIm.Application.Services
{
    public class FileService : IFileService
    {
        public async Task<string> SaveFileAsync(IFormFile file)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return file.FileName;
        }
    }
}
