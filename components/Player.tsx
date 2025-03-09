'use client';

import { useEffect, useState, useMemo } from 'react';

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
    setMusicPlayer(new MusicPlayer(src, playback));
  }, [src, playback]);

  const actions = useMemo(() => ({
    play: () => {
      musicPlayer?.play();
      navigator.mediaSession.playbackState = 'playing';
    },
    pause: () => {
      musicPlayer?.pause();
      navigator.mediaSession.playbackState = 'paused';
    }
  }), [musicPlayer]);

  useEffect(() => {
    if (!musicPlayer) return;

    musicPlayer.on('loadedmetadata', () => {
      setPosition(musicPlayer.position);
      setDuration(musicPlayer?.duration);

      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata?.title,
        artist: metadata?.artist,
        album: metadata?.album,
        artwork: metadata?.artwork
      });

      musicPlayer.on('timeupdate', () => {
        setPosition(musicPlayer.position);
        setDuration(musicPlayer?.duration);
  
        navigator.mediaSession.setPositionState({
          duration: musicPlayer?.duration,
          playbackRate: musicPlayer?.playbackRate,
          position: musicPlayer?.position,
        });
      });
    });

    musicPlayer.on('play', () => {
      navigator.mediaSession.playbackState = 'playing';
    });
    musicPlayer.on('pause', () => {
      navigator.mediaSession.playbackState = 'paused';
    });

    navigator.mediaSession.setActionHandler('play', () => actions.play());
    navigator.mediaSession.setActionHandler('pause', () => actions.pause());
  }, [actions, metadata, musicPlayer]);

  useEffect(() => {
    musicPlayer?.setVolume(volume);
  }, [volume, musicPlayer]);

  return (
    <>
      <button onClick={actions.play}>Play</button>
      <button onClick={actions.pause}>Pause</button>

      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
      <input type="range" min="0" max={duration} step="0.01" value={position} onChange={(e) => setPosition(parseFloat(e.target.value))} onMouseUp={(e) => { if (musicPlayer) musicPlayer.position = position; }} />
    </>
  );
}