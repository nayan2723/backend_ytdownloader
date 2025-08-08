import { useState } from 'react'
import { API_BASE_URL } from './config'
import './App.css'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [format, setFormat] = useState('mp4')
  const [videoInfo, setVideoInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getVideoInfo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    setLoading(true)
    setError('')
    setVideoInfo(null)

    try {
      const response = await fetch(`${API_BASE_URL}/info?url=${encodeURIComponent(videoUrl)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get video info')
      }

      setVideoInfo(data)
    } catch (err) {
      setError(err.message || 'Failed to get video info')
    } finally {
      setLoading(false)
    }
  }

  const downloadVideo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/download?url=${encodeURIComponent(videoUrl)}&format=${format}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Download failed')
      }

      // Create a blob from the response and trigger download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `video.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err.message || 'Download failed')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Video Downloader</h1>
          <p className="text-gray-600">Download videos from YouTube, Instagram, and more</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mp4">MP4 Video</option>
                <option value="mp3">MP3 Audio</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={getVideoInfo}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Get Info'}
              </button>
              <button
                onClick={downloadVideo}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing...</p>
          </div>
        )}

        {videoInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Title</h3>
                <p className="text-gray-900">{videoInfo.title}</p>
              </div>

              {videoInfo.thumbnail && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Thumbnail</h3>
                  <img 
                    src={videoInfo.thumbnail} 
                    alt="Video thumbnail" 
                    className="w-full max-w-md rounded-md shadow-sm"
                  />
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-700">Duration</h3>
                <p className="text-gray-900">{videoInfo.duration_formatted}</p>
              </div>

              {videoInfo.availableFormats && videoInfo.availableFormats.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Available Formats</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {videoInfo.availableFormats.slice(0, 6).map((format, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{format.ext}</span>
                        {format.resolution && <span className="text-gray-600 ml-2">({format.resolution})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
