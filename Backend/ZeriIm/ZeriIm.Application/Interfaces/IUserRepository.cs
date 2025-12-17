using ZeriIm.Domain.Entities;

public interface IUserRepository
{
    Task<User> GetByIdAsync(Guid id);
    Task<User> GetByEmailAsync(string email);
    Task<User> GetByRefreshTokenAsync(string token);
    Task<List<User>> GetAllAsync();
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(Guid id);

    // Add this method to fix CS1061
    Task UpdateProfileImageAsync(Guid id, string imagePath);
}