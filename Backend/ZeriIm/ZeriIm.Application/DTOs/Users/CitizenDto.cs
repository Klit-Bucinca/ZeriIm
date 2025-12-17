using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.DTOs.Users
{
    public class CitizenDto
    {
        public Guid UserId { get; set; }      // lidhja me User
        public string Username { get; set; }
        public string Email { get; set; }

        public int TotalPosts { get; set; }
        public int TotalComments { get; set; }
        public int ReputationScore { get; set; }
    }
}
