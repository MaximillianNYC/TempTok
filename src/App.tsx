import { useState, useRef, useEffect } from 'react'
import './App.css'
import playIcon from '/icons/play-solid.svg'
import pauseIcon from '/icons/pause-solid.svg'

function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isScrollLocked, setIsScrollLocked] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPaused, setIsPaused] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = [
    {
      url: '/videos/video1.mp4',
      VideoLabel: "TODAY",
      transcript: "Alright folks, we've got a chilly outlook ahead! Temperatures are dancing around the 0 to 8 degree mark throughout the day. Expect a frosty start, with lows creeping to nearly 2 degrees. But as we warm up, we might see some mild temps peaking around a cozy 8 degrees. \n\nSo, grab that heavy coat and maybe a hot cup of cocoa, because it's going to be a brisk day out there! Stay warm!"
    },
    {
      url: '/videos/video2.mp4',
      VideoLabel: "HOURLY",
      transcript: "Video 2 transcript here"
    },
    {
      url: '/videos/video3.mp4',
      VideoLabel: "10 DAY",
      transcript: "Video 3 transcript here"
    }
  ]

  const SCROLL_THRESHOLD = 25;

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      setIsScrollLocked(true)
      setIsFadingOut(true)
      
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev < videos.length - 1 ? prev + 1 : 0)
        setIsFadingOut(false)
        setTimeout(() => {
          setIsScrollLocked(false)
        }, 500)
      }, 500)
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [currentVideoIndex, videos.length])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPaused(false)
    const handlePause = () => setIsPaused(true)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const handleScroll = (e: React.WheelEvent) => {
    if (isScrollLocked) return;

    if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;

    if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
      setIsScrollLocked(true)
      setIsFadingOut(true)
      
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev + 1)
        setIsFadingOut(false)
        setTimeout(() => {
          setIsScrollLocked(false)
        }, 500)
      }, 500)
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      setIsScrollLocked(true)
      setIsFadingOut(true)
      
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev - 1)
        setIsFadingOut(false)
        setTimeout(() => {
          setIsScrollLocked(false)
        }, 500)
      }, 500)
    }
  }

  const handleVideoSelect = (index: number) => {
    if (index === currentVideoIndex) return;
    
    setIsScrollLocked(true)
    setIsFadingOut(true)
    
    setTimeout(() => {
      setCurrentVideoIndex(index)
      setIsFadingOut(false)
      setTimeout(() => {
        setIsScrollLocked(false)
      }, 500)
    }, 500)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  return (
    <div className="lifetok-container" onWheel={handleScroll}>
      <div className="Nav">
        <div className="Location">
          <img src="/icons/location-dot-solid.svg" alt="Location" style={{width: '14px', height: '14px'}} />
          Manhattan, NY
        </div>
        <div className="video-info">
            {videos.map((video, index) => (
              <p 
                key={index} 
                className="VideoLabel" 
                style={{
                  fontWeight: index === currentVideoIndex ? 'bold' : 'bold',
                  opacity: index === currentVideoIndex ? 1 : 0.25,
                  transition: 'opacity 0.3s ease-in-out',
                  cursor: 'pointer'
                }}
                onClick={() => handleVideoSelect(index)}
              >
                {video.VideoLabel}
              </p>
            ))}
          </div>
          <div className="controls">
            <button 
              onClick={handlePlayPause}
              className="playbackButton"
            >
              <img src={isPaused ? playIcon : pauseIcon} alt={isPaused ? "Play" : "Pause"} style={{width: '24px', height: '24px'}} />
            </button>
            <button 
            onClick={toggleMute}
            className="muteButton"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          </div>
      </div>
      <div className={`video-container ${isFadingOut ? 'fade-out' : 'fade-in'}`}>
        <video
          ref={videoRef}
          className="video-player"
          src={videos[currentVideoIndex].url}
          autoPlay
          muted={isMuted}
          playsInline
          controls={false}
          onError={(e) => {
            console.error('Video error:', e);
          }}
        />
        <div className="transcript">
          {videos[currentVideoIndex].transcript}
        </div>
      </div>
    </div>
  )
}

export default App