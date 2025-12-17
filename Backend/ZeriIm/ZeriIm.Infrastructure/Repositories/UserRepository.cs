using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeriIm.Application.Interfaces;
using ZeriIm.Domain.Users;
using ZeriIm.Infrastructure.Persistence;

using Microsoft.EntityFrameworkCore;
using ZeriIm.Domain;


namespace ZeriIm.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ZeriImDbContext _context;

        public UserRepository(ZeriImDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public Task<List<User>> GetAllAsync()
        {
            return _context.Users.ToListAsync();
        }

        public Task<User> GetByEmailAsync(string email)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public Task<User> GetByIdAsync(Guid id)
        {
            return _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<User> GetByRefreshTokenAsync(string token)
        {
            return _context.Users.FirstOrDefaultAsync(x => x.RefreshToken == token);
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProfileImageAsync(Guid userId, string imagePath)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            user.ProfileImagePath = imagePath;
            await _context.SaveChangesAsync();
        }

    }
}
