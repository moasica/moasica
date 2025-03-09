'use client';

import { NextPlaylist, Song } from '@/util/interfaces';
import Spinner from './Spinner';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from '@/styles/UpNext.module.scss';

interface UpNextProps {
  id: string;
  onSelected?: (id: string) => void;
}

export default function UpNext({ id, onSelected }: UpNextProps) {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const f = await fetch(`/api/v1/video/${id}/next`);
      const playlist: NextPlaylist = await f.json();

      setPlaylist(playlist.videos);
      setLoading(false);
    })();
  }, [id]);

  const selectSong = (e: any, id: string) => {
    e.preventDefault();

    if (onSelected) onSelected(id);
  };

  if (!playlist.length || loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Spinner width={48} height={48} />
      </div>
    );
  }

  return (
    <ul className={styles.upNext}>
      {playlist.map((song) => (
        <li key={song.id} data-current={song.current}>
          <Link href={`/watch?v=${song.id}`} onClick={(e) => selectSong(e, song.id)}>
            <Image
              src={song.thumbnail[0].url}
              width={64}
              height={64}
              alt="Thumbnail"
            />

            <div className={styles.upNextText}>
              <h3>{song.title}</h3>
              <p>{song.artist.map((artist) => artist.name).join(', ')}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
