using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Domain.Users
{
    public class Citizen:User
    {
        public int TotalPosts { get; set; }
        public int ReputationScore { get; set; }
        public int TotalComments { get; set; }
    }
}
