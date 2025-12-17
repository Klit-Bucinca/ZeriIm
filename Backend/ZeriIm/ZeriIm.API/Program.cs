using Microsoft.EntityFrameworkCore;
using ZeriIm.Application.Interfaces;
using ZeriIm.Application.Posts;
using ZeriIm.Application.Services;
using ZeriIm.Infrastructure.Persistence;
using ZeriIm.Infrastructure.Repositories.Posts;
using ZeriIm.Infrastructure.Repositories;
using ZeriIm.Infrastructure.Services;
using ZeriIm.Ports.Outbound;
using ZeriIm.Ports.Posts;
using ZeriIm.Domain.Posts;
using ZeriIm.Domain.Entities;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext (SQL Server)
builder.Services.AddDbContext<ZeriImDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Application Services (Use Cases)
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IVoteService, VoteService>();

// Repository Implementations (Outbound Adapters)
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IVoteRepository, VoteRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Auth & files
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IFileService, FileService>();

// CORS for frontend dev
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Seed minimal categories if none exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ZeriImDbContext>();
    var users = scope.ServiceProvider.GetRequiredService<IUserRepository>();

    if (!db.Categories.Any())
    {
        db.Categories.AddRange(
            new Category("Rruge"),
            new Category("Uje dhe kanalizim"),
            new Category("Siguri"),
            new Category("Mbeturina"),
            new Category("Arsimi")
        );
        db.SaveChanges();
    }

    var adminEmail = "admin@admin.admin";
    var existingAdmin = await users.GetByEmailAsync(adminEmail);
    if (existingAdmin == null)
    {
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "Admin",
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("AdminAdmin"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await users.AddAsync(adminUser);
    }
}

app.Run();
