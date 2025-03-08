'use client';

import { useEffect, useState } from 'react';

import MusicPlayer from '@/util/MusicPlayer';

export default function Dev() {
  const [ musicPlayer, setMusicPlayer ] = useState<MusicPlayer | null>(null);
  
  const [ volume, setVolume ] = useState(1);

  useEffect(() => {
    setMusicPlayer(new MusicPlayer('http://localhost:3000/dash/out.mpd', {
      title: 'Thick Of It',
      artist: 'We The Sus Music',
      album: 'KSI',
      artwork: [
        { src: 'https://i.ytimg.com/vi/gQzWr8MoJXA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDLQ0sOeuYIxS5cen2o0N-7zM6Bjg' }
      ]
    }));
  }, []);

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