using System.Collections.Concurrent;

namespace ZeriIm.API;

public static class MunicipalitiesStore
{
    public sealed record MunicipalityRecord(
        Guid Id,
        string Name,
        string Region,
        int? Population,
        string? Contact,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    private static readonly object _lock = new();
    private static readonly List<MunicipalityRecord> _items = new()
    {
        new MunicipalityRecord(Guid.Parse("00000000-0000-0000-0000-000000001111"), "Prishtine", "Rajoni i Prishtinës", 200000, "info@prishtina.com", DateTime.UtcNow, DateTime.UtcNow),
        new MunicipalityRecord(Guid.Parse("00000000-0000-0000-0000-000000001112"), "Prizren", "Rajoni i Prizrenit", 150000, "info@prizren.com", DateTime.UtcNow, DateTime.UtcNow),
        new MunicipalityRecord(Guid.Parse("00000000-0000-0000-0000-000000001113"), "Gjakove", "Rajoni i Gjakovës", 90000, "info@gjakova.com", DateTime.UtcNow, DateTime.UtcNow),
    };

    public static IReadOnlyList<MunicipalityRecord> GetAll()
    {
        lock (_lock)
        {
            return _items.ToList();
        }
    }

    public static bool TryGet(Guid id, out string name)
    {
        lock (_lock)
        {
            var item = _items.FirstOrDefault(m => m.Id == id);
            if (item is null)
            {
                name = string.Empty;
                return false;
            }
            name = item.Name;
            return true;
        }
    }

    public static MunicipalityRecord Add(string name, string region, int? population, string? contact)
    {
        lock (_lock)
        {
            var now = DateTime.UtcNow;
            var record = new MunicipalityRecord(Guid.NewGuid(), name, region, population, contact, now, now);
            _items.Add(record);
            return record;
        }
    }

    public static bool Update(Guid id, string name, string region, int? population, string? contact)
    {
        lock (_lock)
        {
            var idx = _items.FindIndex(m => m.Id == id);
            if (idx < 0) return false;
            var existing = _items[idx];
            _items[idx] = existing with
            {
                Name = name,
                Region = region,
                Population = population,
                Contact = contact,
                UpdatedAt = DateTime.UtcNow
            };
            return true;
        }
    }

    public static bool Delete(Guid id)
    {
        lock (_lock)
        {
            var idx = _items.FindIndex(m => m.Id == id);
            if (idx < 0) return false;
            _items.RemoveAt(idx);
            return true;
        }
    }
}
