using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ZeriIm.Ports.Posts.Enums;

namespace ZeriIm.Ports.Posts.Models;

public sealed class PostSearchCriteria
{
    public Guid? CategoryId { get; init; }
    public string? Municipality { get; init; }
    public string? SearchTerm { get; init; }
    public PostSortBy SortBy { get; init; } = PostSortBy.Newest;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}