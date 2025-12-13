using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeriIm.Domain.Users;

namespace ZeriIm.Infrastructure.Seed
{
    public static class UserSeed
    {
        public static void SeedUsers(this ModelBuilder modelBuilder)
        {
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var citizenId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var moderatorId = Guid.Parse("33333333-3333-3333-3333-333333333333");

            var fixedDate = new DateTime(2025, 11, 28, 12, 0, 0, DateTimeKind.Utc);

            // === ADMIN ===
            var adminUser = new User
            {
                Id = adminId,
                Username = "admin",
                Email = "admin@zeriim.com",
                Role = "Admin",
                CreatedAt = fixedDate,
                UpdatedAt = fixedDate,
                RefreshToken = null,
                RefreshTokenExpiryTime = null,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123")
            };

            // === CITIZEN ===
            var citizen = new Citizen
            {
                Id = citizenId,
                Username = "citizen1",
                Email = "citizen1@zeriim.com",
                Role = "Citizen",
                CreatedAt = fixedDate,
                UpdatedAt = fixedDate,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Citizen123")
            };

            // === MODERATOR ===
            var moderator = new Moderator
            {
                Id = moderatorId,
                Username = "moderator1",
                Email = "moderator1@zeriim.com",
                Role = "Moderator",
                Status = "Active",
                CreatedAt = fixedDate,
                UpdatedAt = fixedDate,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Moderator123")
            };

            modelBuilder.Entity<User>().HasData(adminUser);
            modelBuilder.Entity<Citizen>().HasData(citizen);
            modelBuilder.Entity<Moderator>().HasData(moderator);
        }
    }
}
