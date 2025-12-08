using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Domain
{
    public class Moderator:User
    {
        public int assignedMunicipalityID { get; set; }
        public string Status { get; set; }
        public int handleReports { get; set; }
    }
}
