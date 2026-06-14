# Complete Setup Guide for Windows

## Prerequisites
- Windows 10 or 11
- Administrative access
- At least 4GB RAM free
- Internet connection

## Step 1: Install Docker Desktop

### Download
1. Go to https://www.docker.com/products/docker-desktop
2. Click "Download for Windows"
3. Run the installer (DockerDesktopInstaller.exe)

### Installation
1. Follow the installer prompts
2. Check "Use WSL 2 instead of Hyper-V" (recommended for Windows 10/11)
3. Complete the installation
4. Restart your computer
5. Docker will start automatically

### Verify Installation
1. Open PowerShell
2. Run: `docker --version`
3. You should see: `Docker version XX.X.X`

## Step 2: Clone the Repository

```powershell
# Open PowerShell in your desired directory
git clone <repository-url>
cd branch1
git checkout todo-app-6modules
```

## Step 3: Start Docker Containers

```powershell
# From the project directory
docker-compose up -d
```

Wait 10-15 seconds for containers to fully start.

## Step 4: Verify Containers Are Running

```powershell
docker ps
```

You should see:
- `todo-php` (running on port 8080)
- `todo-mysql` (running on port 3306)

## Step 5: Access the Application

Open your browser and go to:
```
http://localhost:8080
```

## Step 6: Login with Demo Account

- **Email**: `user@example.com`
- **Password**: `password123`

## Troubleshooting

### Port 8080 Already in Use

```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Or change the port in docker-compose.yml:
# Change "8080:80" to "8081:80"
# Then access http://localhost:8081
```

### MySQL Connection Error

```powershell
# View logs
docker-compose logs todo-mysql

# Restart containers
docker-compose down
docker-compose up -d
```

### Docker Daemon Not Running

1. Look for Docker icon in system tray
2. If not there, open Docker Desktop from Start Menu
3. Wait for it to fully start

### Permission Denied on PowerShell

```powershell
# Run PowerShell as Administrator
# Then try docker command again
```

## Common Commands

```powershell
# View running containers
docker ps

# View all containers
docker ps -a

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f todo-php

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# Remove everything (careful!)
docker-compose down -v
```

## Access MySQL Directly

```powershell
# Using MySQL CLI
mysql -h 127.0.0.1 -u root -proot123 todoapp

# Using Docker exec
docker exec -it todo-mysql mysql -u root -proot123 todoapp
```

## Offline Usage

The app supports offline functionality:

1. **Service Worker**: Automatically caches all assets
2. **LocalStorage**: Stores todos/notes locally when offline
3. **Auto-sync**: Data syncs when connection restored

## Project Structure

```
.
├── backend/              # PHP API
│   ├── api/             # API endpoints for each module
│   ├── config.php       # Database config
│   └── Dockerfile
├── frontend/            # HTML/CSS/JS
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript modules
│   └── pages/          # HTML pages
├── database/           # SQL setup
├── docker-compose.yml  # Docker configuration
└── README.md          # Project docs
```

## 6 Modules Overview

1. **User Module** (auth.js)
   - Login/Registration
   - User management

2. **Todo Module** (todos.js)
   - Create/Read/Update/Delete todos
   - Priority levels
   - Due dates
   - Categories

3. **Notes Module** (notes.js)
   - Quick notes
   - Pin important notes
   - Color coding

4. **Category Module** (categories.js)
   - Organize todos
   - Color coded
   - Custom icons

5. **Statistics Module** (stats.js)
   - Dashboard overview
   - Priority breakdown
   - Completion rates
   - Category analytics

6. **Settings Module** (settings.js)
   - Theme selection
   - Language preferences
   - Timezone settings
   - Notification controls

## Next Steps

1. Register a new account or use demo account
2. Create your first todo in the Todos module
3. Organize with categories
4. Add quick notes
5. Check statistics on dashboard
6. Customize settings

## Performance Tips

1. Ensure Docker has sufficient resources (Settings > Resources)
2. Regular backups of your data
3. Clear browser cache if issues occur
4. Restart containers if experiencing slowness

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify Docker is running
3. Ensure ports 8080 and 3306 are available
4. Try restarting containers: `docker-compose restart`

---

**Happy Todo-ing! 📝**
