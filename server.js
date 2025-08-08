const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Info endpoint - get video information
app.get('/info', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Get video info using yt-dlp
    const command = `yt-dlp --dump-json "${url}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Info error:', error);
        return res.status(500).json({ error: 'Failed to get video info' });
      }

      try {
        const videoInfo = JSON.parse(stdout);
        
        // Extract relevant information
        const info = {
          title: videoInfo.title || 'Unknown Title',
          thumbnail: videoInfo.thumbnail || null,
          duration: videoInfo.duration || 0,
          duration_formatted: videoInfo.duration_string || '0:00',
          availableFormats: videoInfo.formats ? videoInfo.formats.map(f => ({
            format_id: f.format_id,
            ext: f.ext,
            resolution: f.resolution,
            filesize: f.filesize
          })) : []
        };

        res.json(info);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.status(500).json({ error: 'Failed to parse video info' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download endpoint
app.get('/download', async (req, res) => {
  const { url, format = 'mp4' } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  if (!['mp4', 'mp3'].includes(format)) {
    return res.status(400).json({ error: 'Format must be mp4 or mp3' });
  }

  // Create a unique filename
  const timestamp = Date.now();
  const filename = `video_${timestamp}.${format}`;
  const outputPath = path.join(__dirname, filename);

  try {
    let command;
    if (format === 'mp3') {
      // Extract audio as MP3
      command = `yt-dlp -f "bestaudio[ext=m4a]/bestaudio" --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;
    } else {
      // Download video as MP4
      command = `yt-dlp -f "best[ext=mp4]/best" -o "${outputPath}" "${url}"`;
    }
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Download error:', error);
        return res.status(500).json({ error: 'Failed to download video' });
      }

      // Check if file exists
      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({ error: 'Downloaded file not found' });
      }

      // Send file as download
      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Download response error:', err);
        }
        
        // Clean up: delete the file after sending
        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          }
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Video Downloader API is running',
    endpoints: {
      info: 'GET /info?url=<video_url>',
      download: 'GET /download?url=<video_url>&format=mp4|mp3'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

