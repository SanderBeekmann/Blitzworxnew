'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { formatDuration, FREEMIUM_LIMIT_SECONDS } from '@/lib/podcasts';
import { LeadCaptureForm } from '@/components/podcast/LeadCaptureForm';

interface AudioPlayerProps {
  src: string;
  slug: string;
  title: string;
  duration?: number | null;
}

export function AudioPlayer({ src, slug, title, duration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showGate, setShowGate] = useState(false);

  // Check localStorage for previous unlock
  useEffect(() => {
    const unlocked = localStorage.getItem(`podcast_unlocked_${slug}`);
    if (unlocked === 'true') setIsUnlocked(true);
  }, [slug]);

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
    setShowGate(false);
    localStorage.setItem(`podcast_unlocked_${slug}`, 'true');
    // Resume playback
    audioRef.current?.play();
  }, [slug]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (showGate) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime);

    // Freemium gate: pause at 4 minutes if not unlocked
    if (!isUnlocked && audio.currentTime >= FREEMIUM_LIMIT_SECONDS) {
      audio.pause();
      audio.currentTime = FREEMIUM_LIMIT_SECONDS;
      setIsPlaying(false);
      setShowGate(true);
    }
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    setTotalDuration(audio.duration);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const seekTime = pct * totalDuration;

    // Don't allow seeking past the freemium limit if locked
    if (!isUnlocked && seekTime >= FREEMIUM_LIMIT_SECONDS) {
      audio.currentTime = FREEMIUM_LIMIT_SECONDS - 1;
    } else {
      audio.currentTime = seekTime;
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }

  function cyclePlaybackRate() {
    const rates = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
  }

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  const gateProgress = totalDuration > 0
    ? (FREEMIUM_LIMIT_SECONDS / totalDuration) * 100
    : 0;

  return (
    <div className="relative rounded-lg border border-[#545c52] bg-[#040711] p-4 sm:p-6">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Player controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={showGate}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#cacaaa] text-[#040711] hover:bg-[#fefadc] disabled:opacity-50 transition-colors shrink-0"
          aria-label={isPlaying ? 'Pauzeer' : 'Afspelen'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664L9.555 7.168z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Time + Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-[#8b8174] mb-1.5">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span className="text-[#fefadc] text-sm font-medium truncate mx-3 hidden sm:block">
              {title}
            </span>
            <span>{formatDuration(Math.floor(totalDuration))}</span>
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="relative h-2 rounded-full bg-[#545c52]/50 cursor-pointer group"
          >
            {/* Freemium gate marker */}
            {!isUnlocked && totalDuration > 0 && (
              <div
                className="absolute top-0 h-full w-px bg-[#8b8174]"
                style={{ left: `${gateProgress}%` }}
              />
            )}
            {/* Progress fill */}
            <div
              className="h-full rounded-full bg-[#cacaaa] transition-[width] duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#fefadc] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2">
          <svg className="w-4 h-4 text-[#8b8174] shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 accent-[#cacaaa]"
            aria-label="Volume"
          />
        </div>

        {/* Playback speed */}
        <button
          onClick={cyclePlaybackRate}
          className="hidden sm:flex min-w-[3rem] items-center justify-center px-2 py-1 text-xs font-medium text-[#8b8174] border border-[#545c52] rounded hover:text-cornsilk hover:border-[#cacaaa] transition-colors"
          aria-label="Afspeelsnelheid"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Mobile title */}
      <p className="sm:hidden text-sm font-medium text-[#fefadc] mt-3 truncate">{title}</p>

      {/* Freemium gate overlay */}
      {showGate && (
        <div className="absolute inset-0 rounded-lg bg-[#040711]/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-sm text-center">
            <svg className="w-10 h-10 text-[#cacaaa] mx-auto mb-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-[#fefadc] mb-1 font-medium">
              Wil je de hele aflevering beluisteren?
            </p>
            <p className="text-xs text-[#8b8174] mb-4">
              Vul je e-mailadres in om verder te luisteren.
            </p>
            <LeadCaptureForm slug={slug} onSuccess={handleUnlock} compact />
          </div>
        </div>
      )}
    </div>
  );
}
