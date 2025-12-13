using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.Interfaces
{
    public interface IImageService
    {
        Task<string> SaveProfileImageAsync(IFormFile image, Guid userId);
    }
}
