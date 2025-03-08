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
}

export default function Player({ src, metadata }: PlayerProps) {
  const [ musicPlayer, setMusicPlayer ] = useState<MusicPlayer | null>(null);
  
  const [ volume, setVolume ] = useState(1);

  useEffect(() => {
    setMusicPlayer(new MusicPlayer(src, metadata));
  }, [src, metadata]);

  useEffect(() => {
    musicPlayer?.on('bufferLoaded', (e) => {
      console.log(e);
      console.log(musicPlayer?.getBuffer().length);
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
    </>
  );
}