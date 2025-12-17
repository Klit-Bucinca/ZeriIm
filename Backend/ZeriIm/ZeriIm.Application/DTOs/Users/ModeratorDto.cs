using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.DTOs.Users
{
    public class ModeratorDto
    {
        public Guid UserId { get; set; }       // nga User
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }       // zakonisht "Moderator"

        public int MunicipalityId { get; set; }
        public string Status { get; set; }
        public int HandledReports { get; set; }
    }
}
