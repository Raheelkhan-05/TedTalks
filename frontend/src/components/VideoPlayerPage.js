import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import './Pages/styles/VideoPlayerPage.css';

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./Pages/firebase";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const VideoPlayerPage = () => {
  const { talkId } = useParams();
  const navigate = useNavigate();
  const [currentTalk, setCurrentTalk] = useState(null);
  const [recommendedTalks, setRecommendedTalks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [videoError, setVideoError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoplayCountdown, setAutoplayCountdown] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  
  const [user] = useAuthState(auth);
  const [watchedDuration, setWatchedDuration] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const userEmail = user.email.replace(/\./g, "_");
      const historyRef = doc(db, "users", userEmail, "history", talkId);
      const historySnap = await getDoc(historyRef);
      if (historySnap.exists()) {
        setWatchedDuration(Math.floor(historySnap.data().watchedDuration));
        setDuration(Math.floor(historySnap.data().duration));
      }
    };

    fetchHistory();
  }, [user, talkId]);

  const updateWatchProgress = async (currentTime) => {
    if (!user) return;
    const userEmail = user.email.replace(/\./g, "_");
    const historyRef = doc(db, "users", userEmail, "history", talkId);
    await setDoc(
      historyRef,
      {
        talkId,
        watchedDuration: currentTime,
        // watchedDuration: Math.floor(currentTime), // Ensure watchedDuration is an integer
        duration: Math.floor(duration), // Ensure totalDuration is an integer
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  };

  // Format time to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetch talk data
  useEffect(() => {
    const fetchTalkData = async () => {
      try {
        setIsLoading(true);
        setVideoError(null);
        
        // Fetch talk details
        const talkResponse = await axios.get(`http://localhost:8000/api/talk/${talkId}`);
        const talkData = talkResponse.data.talk;
        setCurrentTalk(talkData);

        // Fetch recommended talks
        try {
          const recommendedResponse = await axios.post("http://localhost:8000/api/recommendations", {
            watched_talks: talkId  // Make sure this is defined and contains talk IDs
            
          });
          console.log("----Recommended Talks:", recommendedResponse.data.talks);
          setRecommendedTalks(recommendedResponse.data.talks || []);
        } catch (recError) {
          console.warn('Could not fetch recommended talks:', recError);
        }
        
      } catch (err) {
        console.error("Error fetching talk:", err);
        setVideoError(`Failed to fetch talk data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalkData();
  }, [talkId]);


    // Auto-play and full-screen setup
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isLoading) return;
    
        // Auto-play when video is loaded
        const attemptAutoPlay = async () => {
          try {
            await video.play();
            setIsPlaying(true);
          } catch (error) {
            console.warn('Autoplay was prevented:', error);
          }
        };
    
        // Full-screen change event handlers
        const handleFullscreenChange = () => {
          setIsFullScreen(!!document.fullscreenElement);
        };
    
        // Add fullscreen event listeners
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
        // Attempt autoplay
        attemptAutoPlay();
    
        // Cleanup
        return () => {
          document.removeEventListener('fullscreenchange', handleFullscreenChange);
          document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
          document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
          document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
      }, [isLoading, talkId]);

  // Video progress and buffering tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      // Current time and duration
      setCurrentTime(video.currentTime);
      setDuration(video.duration);

      // Buffering progress
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBufferedProgress(bufferedPercent);
      }
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
      
      // Start autoplay countdown if recommended talks exist
      if (recommendedTalks.length > 0) {
        setAutoplayCountdown(5);
      }
    };

    // Add event listeners
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('progress', updateProgress);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('progress', updateProgress);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [talkId, recommendedTalks]);

  // Autoplay countdown logic
  useEffect(() => {
    // Only start countdown when it's greater than 0
    if (autoplayCountdown > 0) {
      const timer = setInterval(() => {
        setAutoplayCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Navigate to next recommended talk
            if (recommendedTalks.length > 0) {
              navigate(`/video/${recommendedTalks[0].talk__id}`);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoplayCountdown, recommendedTalks, navigate]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          video.currentTime = Math.min(video.currentTime + 10, video.duration);
          break;
        case 'ArrowLeft':
          video.currentTime = Math.max(video.currentTime - 10, 0);
          break;
        case 'KeyF':
          toggleFullScreen();
          break;
        case 'KeyM':
          toggleMute();
          break;
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Function to format view count (e.g., 1.5M, 120K)
  const formatViews = (views) => {
    if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
    if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
    return views;
  };

  // Video play/pause handler
  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Playback Error:', error);
      setVideoError(`Playback Error: ${error.message}`);
      setIsPlaying(false);
    }
  }, []);

  // Seek bar handler
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    
    // Calculate seek percentage
    const seekPercent = (clickPosition / progressBarWidth) * 100;
    const newTime = (seekPercent / 100) * videoRef.current.duration;
    
    videoRef.current.currentTime = newTime;
  };

  // Mute toggle handler
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  // Fullscreen toggle handler - Updated to focus only on video
  const toggleFullScreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) { 
        video.mozRequestFullScreen();
      } else if (video.webkitRequestFullscreen) { 
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { 
        video.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { 
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { 
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { 
        document.msExitFullscreen();
      }
    }
  }, []);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Render loading or error states
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="error-container">
        <h2>Video Loading Error</h2>
        <p>{videoError}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Calculate progress percentages
  const currentProgress = duration > 0 
    ? (currentTime / duration) * 100 
    : 0;

  return (
    <div 
      ref={containerRef}
      className={`video-player-container ${isFullScreen ? 'fullscreen' : ''}`} 
      style={{marginTop: isFullScreen ? '0' : '6rem'}}
    >
      <div className="video-section">
        <div 
          className="video-wrapper"
          style={{
            position: 'relative',
            paddingBottom: isFullScreen ? '100%' : '56.25%', // 16:9 Aspect Ratio
            height: 0,
            overflow: 'hidden'
          }}
        >
          <video 
            ref={videoRef}
            src={currentTalk?.url__video}
            
            onTimeUpdate={(e) => updateWatchProgress(Math.floor(e.target.currentTime))}
            // onLoadedMetadata={(e) => setWatchedDuration(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(Math.floor(e.target.duration))}

            poster={currentTalk?.url__photo__talk}
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Play Overlay */}
          {!isPlaying && (
            <div 
              className="video-play-overlay" 
              onClick={togglePlay}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <Play size={80} color="white" />
            </div>
          )}
          
          {/* Video Controls */}
          <div className="video-controls" style={{display: 'flex', alignItems: 'center', padding: '10px'}}>
            <button onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </button>
            
            {/* Seek Bar */}
            <div 
              className="progress-container" 
              style={{
                flex: 1, 
                height: '5px', 
                backgroundColor: '#ddd', 
                position: 'relative',
                margin: '0 10px',
                cursor: 'pointer'
              }}
              onClick={handleSeek}
            >
              {/* Buffered Progress (Light Red) */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${bufferedProgress}%`,
                  backgroundColor: 'rgba(255, 0, 0, 0.3)'
                }}
              />
              
              {/* Current Progress (Red) */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${currentProgress}%`,
                  backgroundColor: 'red'
                }}
              />
            </div>
            
            {/* Time Display */}
            <div style={{marginLeft: '10px'}}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Mute Button */}
            <button onClick={toggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </button>

            {/* Fullscreen Button */}
            <button onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize2 /> : <Maximize2 />}
            </button>
          </div>

          {/* Autoplay Countdown */}
          {autoplayCountdown > 0 && (
            <div 
              style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px'
              }}
            >
              Next video in {autoplayCountdown} seconds
            </div>
          )}
        </div>
        {!isFullScreen && (
          <></>)}
        
        {/* Talk Details */}
<div className="talk-details">
  <h1>{currentTalk?.talk__name}</h1>
  
  {/* Tags Section */}
  <div className="talk-tags-container" style={{
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '0.5rem', 
    marginBottom: '1rem',
    marginTop: '1rem',
    color: '#E62B1E',
    textDecoration: 'underline'
  }}>
    {Array.isArray(currentTalk?.talks__tags) ? (
      currentTalk.talks__tags.slice(0, 4).map((tag, index) => (
        <span 
          key={index} 
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: '500',
            backgroundColor: 'rgba(230,43,30,0.1)', 
            textTransform: 'capitalize'
          }}
        >
          {tag}
        </span>
      ))
    ) : (
      <span 
        style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          backgroundColor: 'rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        No Tags
      </span>
    )}
  </div>

  {/* Speaker and Date Container */}
  <div 
    className="speaker-date-container" 
    style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '0.4rem',
      fontSize: '1rem',
    }}
  >
    <div className="speaker-info">
      <span>{currentTalk?.speaker__name}</span>
    </div>
    
    {currentTalk?.recording_date && (
      <div className="talk-date">
        {new Date(currentTalk.recording_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </div>
    )}
  </div>
  <div className="explore-tag-views" style={{marginBottom: '1rem', textAlign: 'right', justifyContent: 'flex-end'}}>
    <span className="explore-views-count">{formatViews(currentTalk.view_count)} views</span>
  </div>
  <p>{currentTalk?.talk__description}</p>
</div>
      </div>

      {/* Recommended Talks */}
      <div className="recommended-talks">
        {recommendedTalks.map((talk) => (
          <Link 
            to={`/video/${talk.talk__id}`} 
            key={talk.talk__id} 
            className="recommended-talk"
          >
            <div className="recommended-talk-thumbnail">
              <img 
                src={talk.url__photo__talk} 
                alt={talk.talk__name} 
              />
              <div className="talk-hover-play">
                <Play size={40} color="white" />
              </div>
            </div>
            <div className="recommended-talk-info">
              <h3>{talk.talk__name}</h3>
              <p>{talk.speaker__name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayerPage;