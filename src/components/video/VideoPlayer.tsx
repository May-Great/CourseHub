'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Tabs } from '@/components/ui';
import { VideoNotes } from './VideoNotes';
import { VideoBookmarks } from './VideoBookmarks';
import { LessonMaterials } from './LessonMaterials';
import { useProgressStore } from '@/lib/stores/progressStore';
import { Material } from '@/lib/types';
import { strings } from '@/lib/strings.ru';

interface InteractiveVideoPlayerProps {
  src: string;
  courseId: string;
  lessonId: string;
  materials?: Material[];
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onLessonComplete?: () => void;
}

export function InteractiveVideoPlayer({
  src,
  courseId,
  lessonId,
  materials = [],
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  onLessonComplete,
}: InteractiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { getVideoPosition, updateVideoPosition, completeLesson, getUserProgress } = useProgressStore();
  
  const userProgress = getUserProgress('current-user', courseId);
  const isLessonCompleted = userProgress?.completedLessons.includes(lessonId) || false;
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Restore saved position
    const savedPosition = getVideoPosition(courseId, lessonId);
    if (savedPosition > 0 && savedPosition < video.duration) {
      video.currentTime = savedPosition;
    }
    
    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      
      // Save position every 5 seconds
      if (Math.floor(time) % 5 === 0) {
        updateVideoPosition(courseId, lessonId, time);
      }
      
      // Check if video is near completion (95%)
      if (video.duration > 0 && time / video.duration >= 0.95 && !isCompleted) {
        setIsCompleted(true);
        if (!isLessonCompleted) {
          completeLesson('current-user', courseId, lessonId);
          onLessonComplete?.();
        }
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [courseId, lessonId, getVideoPosition, updateVideoPosition, completeLesson, isCompleted, isLessonCompleted, onLessonComplete]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isPlaying) {
            video.pause();
          } else {
            video.play();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(duration, video.currentTime + 10);
          break;
        case 'KeyM':
          e.preventDefault();
          video.muted = !video.muted;
          break;
        case 'KeyF':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            video.requestFullscreen();
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const time = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = time;
    setCurrentTime(time);
  };
  
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };
  
  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-2xl group relative">
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />
        
        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/10 transition-colors"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="bg-white/10 backdrop-blur-md rounded-full p-6 transition-transform transform hover:scale-110 border border-white/20">
              <div className="w-0 h-0 border-l-[24px] border-l-white border-y-[16px] border-y-transparent ml-2" />
            </div>
          )}
        </div>
        
        {/* Completion Badge */}
        {isLessonCompleted && (
          <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            Completed
          </div>
        )}

        {/* Controls - visible on group hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-6 pb-6 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative group/progress h-1 hover:h-2 transition-all cursor-pointer">
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              <div 
                className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between text-white/90">
              <div className="flex items-center space-x-6">
                <button
                  onClick={togglePlay}
                  className="hover:text-white transition-colors focus:outline-none"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                  ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                
                <div className="text-sm font-medium font-mono opacity-80">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                  className="bg-black/30 text-white text-xs rounded-md px-2 py-1 border border-white/10 hover:bg-black/50 focus:outline-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
                
                <button
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      videoRef.current?.requestFullscreen();
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}