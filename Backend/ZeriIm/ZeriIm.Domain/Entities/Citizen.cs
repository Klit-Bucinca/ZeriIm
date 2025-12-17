using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace ZeriIm.Domain.Entities
{
    public class Citizen:User
    {
        public int TotalPosts { get; set; }
        public int ReputationScore { get; set; }
        public int TotalComments { get; set; }

        // Relationships
       // public ICollection<Post> Posts { get; set; }
       // public ICollection<Comment> Comments { get; set; }
       // public ICollection<Vote> Votes { get; set; }

    }
}
