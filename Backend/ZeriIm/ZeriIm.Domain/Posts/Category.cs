using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeriIm.Domain.Posts;

public sealed class Category
{
    private Category() { } // EF Core
    
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }

    public Category(string name, string? description = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
    }

    public void Rename(string name) => Name = name;

    public void ChangeDescription(string? description) => Description = description;
}

