# 6-Module Todo App with MySQL Backend

## Project Overview
A complete software engineering project with MySQL backend that works **offline** and supports **6 independent modules**.

## 6 Modules Included:
1. **User Module** - Authentication & User Management
2. **Todo Module** - Task Management (CRUD operations)
3. **Category Module** - Organize todos by categories
4. **Statistics Module** - Dashboard with analytics
5. **Notes Module** - Quick notes & reminders
6. **Settings Module** - User preferences & theme

## Tech Stack
- **Backend**: PHP 8.0+
- **Database**: MySQL 8.0
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Containerization**: Docker & Docker Compose
- **Offline Support**: Service Workers + LocalStorage

## Prerequisites
- Windows 10/11
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- VS Code (optional but recommended)
- Git installed

## Installation Steps

### Step 1: Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop
2. Run installer and restart your computer
3. Open PowerShell and verify: `docker --version`

### Step 2: Clone This Repository
```bash
git clone <repo-url>
cd todo-app-6modules
git checkout todo-app-6modules
```

### Step 3: Start Docker Containers
```bash
docker-compose up -d
```

### Step 4: Open in Browser
```
http://localhost:8080
```

## Default Login Credentials
- **Email**: `user@example.com`
- **Password**: `password123`

## Features
- ✅ Full User Authentication
- ✅ Offline Support (Service Workers + LocalStorage)
- ✅ Real-time Statistics Dashboard
- ✅ Category Management
- ✅ Notes Management
- ✅ User Settings & Theme
- ✅ Responsive Design
- ✅ MySQL Persistent Storage
- ✅ RESTful API Architecture

## Project Structure
```
.
├── backend/
│   ├── api/
│   │   ├── users.php
│   │   ├── todos.php
│   │   ├── categories.php
│   │   ├── statistics.php
│   │   ├── notes.php
│   │   └── settings.php
│   ├── config.php
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── modules.css
│   ├── js/
│   │   ├── app.js
│   │   ├── modules/
│   │   │   ├── auth.js
│   │   │   ├── todos.js
│   │   │   ├── notes.js
│   │   │   ├── categories.js
│   │   │   ├── stats.js
│   │   │   └── settings.js
│   │   └── offline.js
│   ├── sw.js
│   └── manifest.json
├── database/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## Common Commands

```bash
# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Access MySQL
docker exec -it todo-mysql mysql -u root -proot123 todoapp
```

## Troubleshooting

### Port 8080 already in use
```bash
docker-compose down
# Edit docker-compose.yml and change "8080:80" to "8081:80"
docker-compose up -d
```

### Database connection issues
```bash
docker-compose logs todo-php
```

## 6 Modules Overview

### 1. User Module (auth.js)
- Login/Registration
- User profile management
- Authentication with bcrypt

### 2. Todo Module (todos.js)
- Create/Read/Update/Delete todos
- Priority levels (low, medium, high)
- Due dates
- Category assignment

### 3. Notes Module (notes.js)
- Quick notes creation
- Pin important notes
- Color coding
- Note management

### 4. Category Module (categories.js)
- Organize todos
- Color coded categories
- Custom icons
- Category management

### 5. Statistics Module (stats.js)
- Dashboard overview
- Completion rates
- Priority breakdown
- Category analytics

### 6. Settings Module (settings.js)
- Theme selection (light/dark)
- Language preferences
- Timezone settings
- Notification controls

## Offline Capability

The app supports offline functionality:
1. **Service Worker**: Automatically caches all assets
2. **LocalStorage**: Stores todos/notes locally when offline
3. **Auto-sync**: Data syncs when connection restored

## API Endpoints

- `POST /api/users.php` - Register/Login
- `GET /api/users.php?user_id=ID` - Get user info
- `GET/POST/PUT/DELETE /api/todos.php` - Todos operations
- `GET/POST/PUT/DELETE /api/notes.php` - Notes operations
- `GET/POST/PUT/DELETE /api/categories.php` - Categories operations
- `GET /api/statistics.php?user_id=ID` - Get statistics
- `GET/PUT /api/settings.php?user_id=ID` - Settings management

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License
MIT

## Support
For issues or questions, please refer to the SETUP_GUIDE.md file.

---

**Happy Todo-ing! 📝**
