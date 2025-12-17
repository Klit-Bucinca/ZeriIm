using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Application.DTOs.Users
{
    public class ModeratorListItemDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public int MunicipalityId { get; set; }
        public string Status { get; set; }
        public int HandledReports { get; set; }
    }
}
