# Video Downloader Web App

A complete video downloader web application with React frontend and Node.js backend that supports downloading videos from YouTube, Instagram, and other platforms.

## Features

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + yt-dlp
- Download videos in MP4 format
- Extract audio in MP3 format
- Get video information (title, thumbnail, duration)
- Mobile-friendly responsive design
- Cross-domain API calls with CORS

## Project Structure

```
video-downloader/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── Procfile          # Railway deployment
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── config.js     # API configuration
│   │   └── index.css     # Tailwind styles
│   └── package.json      # Frontend dependencies
└── README.md
```

## Local Development

### Prerequisites

1. **Install yt-dlp** (required for video downloads):
   - **Windows**: Download from https://github.com/yt-dlp/yt-dlp/releases and add to PATH
   - **macOS**: `brew install yt-dlp`
   - **Linux**: `sudo apt install yt-dlp` or `sudo yum install yt-dlp`

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

### GET /info
Get video information including title, thumbnail, and duration.

**Query Parameters:**
- `url` (required): The video URL

**Example:**
```
GET /info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### GET /download
Download video or audio file.

**Query Parameters:**
- `url` (required): The video URL
- `format` (optional): `mp4` or `mp3` (default: `mp4`)

**Example:**
```
GET /download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=mp4
```

## Deployment

### Backend Deployment (Railway)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/video-downloader.git
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your video-downloader repository
   - Railway will automatically detect the Node.js app and deploy it
   - Note your deployment URL (e.g., `https://your-app-production.up.railway.app`)

### Frontend Deployment (Netlify)

1. **Update API URL:**
   - Edit `frontend/src/config.js`
   - Change `API_BASE_URL` to your Railway backend URL:
     ```javascript
     export const API_BASE_URL = "https://your-app-production.up.railway.app";
     ```

2. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`
   - Deploy!

## Configuration

### API Base URL

To change the backend API URL (for deployment), edit `frontend/src/config.js`:

```javascript
// For local development
export const API_BASE_URL = "http://localhost:5000";

// For production (after deploying backend)
export const API_BASE_URL = "https://your-app-production.up.railway.app";
```

## Environment Variables

- `PORT`: Backend server port (default: 5000)

## Supported Platforms

The app supports downloading from:
- YouTube
- Instagram
- TikTok
- Twitter
- Facebook
- And many more platforms supported by yt-dlp

## Troubleshooting

1. **"yt-dlp not found" error**: Make sure yt-dlp is installed and in your PATH
2. **CORS errors**: The backend includes CORS middleware, but ensure your frontend URL is allowed
3. **Download fails**: Check that the video URL is valid and accessible
4. **Large files timeout**: Some platforms may have rate limits or require authentication

## License

ISC
