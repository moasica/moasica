'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeOff,
  VolumeX
} from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';

import { Video } from '@/util/interfaces';
import MusicPlayer from '@/util/MusicPlayer';

import Spinner from '@/components/Spinner';

import styles from '@/styles/Player.module.scss';
import SeekBar from './SeekBar';

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
  data: Video;
}

export default function Player({ src, metadata, data, playback }: PlayerProps) {
  const [musicPlayer, setMusicPlayer] = useState<MusicPlayer | null>(null);

  const [loading, setLoading] = useState(true);

  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(data.lenght);

  const [playbackState, setPlaybackState] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setMusicPlayer(new MusicPlayer(src, playback));
  }, [src, playback]);

  useEffect(() => {
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      console.log('Dragging', e, isDragging);
    });

    document.addEventListener('mouseup', () => setIsDragging(false));
  }, [isDragging]);

  const actions = useMemo(
    () => ({
      play: () => {
        musicPlayer?.play();
      },
      pause: () => {
        musicPlayer?.pause();
      }
    }),
    [musicPlayer]
  );

  useEffect(() => {
    if (!musicPlayer) return;

    musicPlayer.on('loadedmetadata', () => {
      setPosition(musicPlayer.position);
      setDuration(musicPlayer?.duration);

      setLoading(false);

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
          position: musicPlayer?.position
        });
      });
    });

    musicPlayer.on('play', () => {
      setPlaybackState(true);
      navigator.mediaSession.playbackState = 'playing';
    });
    musicPlayer.on('pause', () => {
      setPlaybackState(false);
      navigator.mediaSession.playbackState = 'paused';
    });

    navigator.mediaSession.setActionHandler('play', () => actions.play());
    navigator.mediaSession.setActionHandler('pause', () => actions.pause());
  }, [actions, metadata, musicPlayer]);

  useEffect(() => {
    musicPlayer?.setVolume(muted ? 0 : volume);
  }, [muted, volume, musicPlayer]);

  const handlePositionChange = (pos: number) => {
    musicPlayer!.position = pos;
  };

  if (!data) return null;

  return (
    <div className={styles.player}>
      <Image
        className={styles.coverArt}
        src={data.thumbnail[0].url}
        height={512}
        width={512}
        alt="Thumbnail"
      />

      <div className={styles.metadata}>
        <h1>{data.title}</h1>
        <p>
          {data.artist.map((artist, index) => (
            <Fragment key={index}>
              <Link href={`/channel/${artist.id}`}>{artist.name}</Link>
              {index < data.artist.length - 1 &&
                (index === data.artist.length - 2 ? ' & ' : ', ')}
            </Fragment>
          ))}
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.progress}>
          <SeekBar
            duration={duration}
            position={position}
            onSeek={handlePositionChange}
          />

          <div className={styles.time}>
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.buttons}>
          <div className={styles.actions}>
            <button>
              <Shuffle />
            </button>
          </div>

          <div className={styles.midButtons}>
            <button>
              <SkipBack />
            </button>

            {loading ? (
              <button className={styles.primaryButton}>
                <Spinner width={24} height={24} />
              </button>
            ) : (
              <>
                {playbackState ? (
                  <button
                    className={styles.primaryButton}
                    onClick={actions.pause}
                  >
                    <Pause />
                  </button>
                ) : (
                  <button
                    className={styles.primaryButton}
                    onClick={actions.play}
                  >
                    <Play />
                  </button>
                )}
              </>
            )}

            <button>
              <SkipForward />
            </button>
          </div>

          <div className={styles.actions}>
            <div className={styles.volume}>
              <button onClick={() => setMuted(!muted)}>
                {!muted ? (
                  volume > 0.65 ? (
                    <Volume2 />
                  ) : volume > 0.25 ? (
                    <Volume1 />
                  ) : volume > 0 ? (
                    <Volume />
                  ) : (
                    <VolumeX />
                  )
                ) : (
                  <VolumeOff />
                )}
              </button>

              <div className={styles.volumePopup}>
                <div>
                  <SeekBar
                    duration={1}
                    position={volume}
                    onSeek={(p) => {
                      setVolume(p);
                    }}
                  />
                </div>
              </div>
            </div>
            <button>
              <Repeat />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
