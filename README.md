# Lifestyle Gym Africa Ltd - Full Stack Application

A complete gym management system for Lifestyle Gym Africa Ltd in Kigali, Rwanda with Node.js backend, Neon Postgres database, and auto-deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Neon Postgres account ([console.neon.tech](https://console.neon.tech))
- Render or Railway account for deployment

### Local Development

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Neon Postgres:**
   - Go to [console.neon.tech](https://console.neon.tech)
   - Create a new project
   - Copy your connection string

3. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your Neon connection string
```

4. **Initialize database:**

```bash
npm run db:init
```

5. **Start development server:**

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
lifestyle-gym/
├── server.js              # Express server
├── package.json           # Dependencies
├── db/
│   ├── index.js          # Database connection
│   └── init.js           # Database initialization
├── routes/
│   └── api.js            # API endpoints
├── public/
│   ├── fitness.html      # Main landing page
│   ├── member.html       # Member dashboard
│   └── transformation.html # Transformations gallery
├── render.yaml           # Render deployment config
├── Procfile              # Railway deployment config
└── .env.example          # Environment template
```

## 🔌 API Endpoints

### Members

- `GET /api/members` - Get all members
- `GET /api/members/:memberId` - Get single member
- `POST /api/members` - Create member
- `PUT /api/members/:memberId` - Update member

### Workouts

- `GET /api/members/:memberId/workouts` - Get member workouts
- `POST /api/members/:memberId/workouts` - Add workout

### Transformations

- `GET /api/transformations` - Get all transformations
- `GET /api/transformations/featured` - Get featured transformations
- `POST /api/transformations` - Add transformation

### Classes

- `GET /api/classes` - Get all classes
- `GET /api/classes/today` - Get today's classes

### Contact

- `POST /api/contact` - Submit contact form

### Stats

- `GET /api/stats/dashboard` - Get dashboard statistics

## 🚀 Deployment

### Option 1: Render (Recommended)

1. **Push to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Render will auto-detect `render.yaml`
   - Add environment variable: `DATABASE_URL` (your Neon connection string)
   - Click "Create Web Service"

3. **Auto-deploy is enabled!** Every push to main will auto-deploy.

### Option 2: Railway

1. **Push to GitHub** (same as above)

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repo
   - Add environment variable: `DATABASE_URL`
   - Railway will auto-detect `Procfile`

3. **Auto-deploy is enabled!**

## 🗄️ Neon Postgres Setup

1. **Create Neon Project:**
   - Visit [console.neon.tech](https://console.neon.tech)
   - Click "Create a project"
   - Choose region closest to your deployment

2. **Get Connection String:**
   - Go to "Dashboard" → "Connection Details"
   - Copy the connection string
   - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`

3. **Initialize Database:**
   ```bash
   npm run db:init
   ```

## 🔧 Environment Variables

| Variable       | Description                          | Required |
| -------------- | ------------------------------------ | -------- |
| `DATABASE_URL` | Neon Postgres connection string      | Yes      |
| `PORT`         | Server port (default: 3000)          | No       |
| `NODE_ENV`     | Environment (production/development) | No       |

## 📊 Database Schema

### Members Table

- `id`, `member_id`, `first_name`, `last_name`, `email`
- `plan_type`, `plan_status`, `plan_expiry`
- `current_weight`, `target_weight`, `calories_burnt_week`, `attendance_days`

### Workouts Table

- `id`, `member_id`, `workout_type`, `duration_minutes`
- `trainer`, `workout_date`, `status`, `notes`

### Transformations Table

- `id`, `member_id`, `member_name`
- `before_image_url`, `after_image_url`
- `program_name`, `description`, `testimonial`
- `weight_lost`, `duration_months`, `is_featured`

### Classes Table

- `id`, `class_name`, `instructor`, `class_time`
- `class_date`, `duration_minutes`, `max_capacity`, `current_enrolled`

### Contact Submissions Table

- `id`, `name`, `email`, `phone`, `message`, `status`

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** Neon Postgres (Serverless)
- **Deployment:** Render / Railway (Auto-deploy)
- **Security:** Helmet, CORS
- **Logging:** Morgan

## 📝 License

MIT License - feel free to use for your gym!
