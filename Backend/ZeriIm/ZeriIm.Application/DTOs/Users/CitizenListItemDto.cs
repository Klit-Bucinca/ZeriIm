using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.DTOs.Users
{
    public class CitizenListItemDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public int TotalPosts { get; set; }
        public int ReputationScore { get; set; }
    }
}
