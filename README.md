# ZeriIm

Social / civic reporting platform with a Facebook-style feed and an admin dashboard.

## Highlights
- Feed with posts, images, votes, and nested comments
- Facebook-style create-post modal (inline composer)
- Admin panel for users, municipalities, categories, and monthly priorities
- Priority analyzer: top N posts per municipality per month + print/export

## Tech Stack
- Frontend: React + Vite + Tailwind + TailAdmin
- Backend: ASP.NET Core Web API (.NET 8), Clean / Hexagonal Architecture
- Database: SQL Server (EF Core)

## Backend Architecture
Projects:
- ZeriIm.API (Web API)
- ZeriIm.Application (use cases)
- ZeriIm.Domain (entities)
- ZeriIm.Ports (interfaces)
- ZeriIm.Infrastructure (repositories, services)

## Getting Started

### Backend
From `ZeriIm/Backend/ZeriIm`:
```bash
dotnet ef database update --project ZeriIm.Infrastructure --startup-project ZeriIm.API
dotnet run --project ZeriIm.API
```
Local API: `http://localhost:5119`

### Frontend
From `ZeriIm/Frontend`:
```bash
npm install
npm run dev
```
Local UI: `http://localhost:5173`

## Environment Variables
Create `ZeriIm/Frontend/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5119
```

## Seeded Admin
```text
Email: admin@admin.admin
Password: AdminAdmin
```

## Admin Routes
- `/dashboard` (users)
- `/municipalities`
- `/categories`
- `/priority`

## Important Notes
- UI text is in Albanian.
- Posts support both title + content (title is required in the create modal).
- Priority analyzer supports month/year filters and per-municipality print.

## Suggested Next Additions (Optional)
- Screenshots/GIFs of feed + admin pages
- API documentation (Swagger link)
- License (MIT/Apache)
