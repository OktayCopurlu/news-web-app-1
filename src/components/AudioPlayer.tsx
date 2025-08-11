import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Since we don't have actual audio files, we'll simulate playback
        const interval = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= duration) {
              setIsPlaying(false);
              clearInterval(interval);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
      <button
        onClick={togglePlayPause}
        className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
      </button>
      
      <Volume2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
      
      <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>/</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div className="w-16 bg-gray-300 dark:bg-gray-600 rounded-full h-1">
        <div
          className="bg-blue-600 h-1 rounded-full transition-all"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Hidden audio element for future implementation */}
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default AudioPlayer;