using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Zerilm.Ports.Posts.Enums;

namespace Zerilm.Ports.Posts.Models;

public sealed class PostSearchCriteria
{
    public Guid? CategoryId { get; init; }
    public string? Municipality { get; init; }
    public string? SearchTerm { get; init; }
    public PostSortBy SortBy { get; init; } = PostSortBy.Newest;
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}