'use client';

import { useEffect, useState } from 'react';

import MusicPlayer from '@/util/MusicPlayer';

interface PlayerProps {
  src: string;
  metadata?: {
    title: string;
    artist: string;
    album?: string;
    artwork: { src: string }[];
  };
  playback: {
    maxReadAhead: number;
    minReadAhead: number;
    readAhead: number;
  };
}

export default function Player({ src, metadata, playback }: PlayerProps) {
  const [ musicPlayer, setMusicPlayer ] = useState<MusicPlayer | null>(null);
  
  const [ volume, setVolume ] = useState(1);
  const [ position, setPosition ] = useState(0);

  const [ duration, setDuration ] = useState(0);

  useEffect(() => {
    setMusicPlayer(new MusicPlayer(src, metadata, playback));
  }, [src, metadata, playback]);

  useEffect(() => {
    musicPlayer?.on('timeupdate', () => {
      console.log('timeupdate', musicPlayer?.position, musicPlayer?.duration);

      if (!musicPlayer) return;
      setPosition(musicPlayer.position);
      setDuration(!Number.isNaN(musicPlayer.duration) ? musicPlayer?.duration : 0);

      try {
        navigator.mediaSession.setPositionState({
          duration: musicPlayer?.duration,
          playbackRate: musicPlayer?.playbackRate,
          position: musicPlayer?.position,
        });
      } catch (e) {}
    });

    musicPlayer?.on('progress', (e) => {
      console.log('progress', e);
    });
  }, [musicPlayer]);

  useEffect(() => {
    musicPlayer?.setVolume(volume);
  }, [volume, musicPlayer]);

  return (
    <>
      <button onClick={() => musicPlayer?.play()}>Play</button>
      <button onClick={() => musicPlayer?.pause()}>Pause</button>

      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
      <input type="range" min="0" max={duration} step="0.01" value={position} onChange={(e) => setPosition(parseFloat(e.target.value))} onMouseUp={(e) => { if (musicPlayer) musicPlayer.position = position; }} />
    </>
  );
}