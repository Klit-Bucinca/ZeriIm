using Microsoft.EntityFrameworkCore;
using System;
using ZeriIm.Domain;

using ZeriIm.Domain.Users;

namespace ZeriIM.Infrastructure.Database.Seed
{
    public static class UserSeed
    {
        public static void SeedUsers(this ModelBuilder modelBuilder)
        {
            // GUID të fiksuar për seed
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var citizenId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var moderatorId = Guid.Parse("33333333-3333-3333-3333-333333333333");

            // DateTime fiks për HasData
            var fixedDate = new DateTime(2025, 11, 28, 12, 0, 0, DateTimeKind.Utc);

            // 🔑 Hash-e fiks të gjeneruara më parë me PasswordHasher
            var adminHash = "$2a$11$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // vendos hash të gjeneruar nga console
            var citizenHash = "$2a$11$YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"; // vendos hash të gjeneruar nga console
            var moderatorHash = "$2a$11$ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"; // vendos hash të gjeneruar nga console

            // Seed Admin
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminId,
                    Username = "admin",
                    Email = "admin@zeriim.com",
                    PasswordHash = adminHash,
                    Role = "Admin",
                    CreatedAt = fixedDate,
                    UpdatedAt = fixedDate,
                    RefreshToken = null,
                    RefreshTokenExpiryTime = null
                }
            );

            // Seed Citizen
            modelBuilder.Entity<Citizen>().HasData(
                new Citizen
                {
                    Id = citizenId,
                    Username = "citizen1",
                    Email = "citizen1@zeriim.com",
                    PasswordHash = citizenHash,
                    Role = "Citizen",
                    CreatedAt = fixedDate,
                    UpdatedAt = fixedDate
                }
            );

            // Seed Moderator
            modelBuilder.Entity<Moderator>().HasData(
                new Moderator
                {
                    Id = moderatorId,
                    Username = "moderator1",
                    Email = "moderator1@zeriim.com",
                    PasswordHash = moderatorHash,
                    Role = "Moderator",
                    Status = "Active",
                    CreatedAt = fixedDate,
                    UpdatedAt = fixedDate
                }
            );
        }
    }
}
