'use client';

import { use, useEffect, useState } from 'react';

import { Video } from '@/util/interfaces';

import Player from './Player';
import UpNext from './UpNext';

import styles from '@/styles/PlayerPage.module.scss';

interface PlayerPageProps {
  id: string;
  meta: {
    title: string;
    artist: string;
    album?: string;
    artwork: { src: string }[];
  };
  video: Video;
}

export default function PlayerPage({ id, meta, video }: PlayerPageProps) {
  const [ song, setSong ] = useState<string>(id);
  const [ metadata, setMetadata ] = useState(meta);
  const [ data, setData ] = useState(video);

  useEffect(() => {
    (async () => {
      const f = await fetch(`/api/v1/video/${song}`);
      const video: Video = await f.json();

      setData(video);
      setMetadata({
        title: video.title,
        artist: video.artist.map((artist) => artist.name).join(', '),
        artwork: video.thumbnail.map((thumb) => {
          return { src: thumb.url };
        })
      });
    })();
  }, [song]);

  return (
    <div className={styles.player}>
      <Player
        src={`/api/v1/video/${song}/dash`}
        metadata={metadata}
        data={data}
        playback={data.playback}
      />

      <div className={styles.content}>
        <div className={styles.tabs}>
          <label>Up Next</label>

          <label>Lyrics</label>

          <label>Related</label>
        </div>

        <div className={styles.tabContent}>
          <UpNext id={id} onSelected={(id) => setSong(id)} />
        </div>
      </div>
    </div>
  );
}
