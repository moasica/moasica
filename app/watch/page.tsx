import { ChevronDown, Download, Home, Settings, Share2 } from 'lucide-react';

import Player from '@/components/Player';

import { NextPlaylist, Video } from '@/util/interfaces';

import Wordmark from '@/public/wordmark.svg';

import styles from '@/styles/Watch.module.scss';
import UpNext from '@/components/UpNext';
import PlayerPage from '@/components/PlayerPage';

export default async function Watch({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const id = (await searchParams).v as string;
  //const list = (await searchParams).list as string;

  const video: Video = await (
    await fetch(`http://localhost:3000/api/v1/video/${id}`)
  ).json();

  if (!video.playable) {
    return <h1>Video is unplayable!</h1>;
  }

  const meta = {
    title: video.title,
    artist: video.artist.map((artist) => artist.name).join(', '),
    artwork: video.thumbnail.map((thumb) => {
      return { src: thumb.url };
    })
  };

  const c = await (
    await fetch(
      `http://localhost:3000/api/v1/colour?url=${encodeURIComponent(video.thumbnail[0].url)}`
    )
  ).json();

  return (
    <div
      style={{
        background: `linear-gradient(0deg, rgba(10, 12, 14, 0.50) 0%, rgba(10, 12, 14, 0.50) 100%), linear-gradient(120deg, ${c[0]} 15.48%, #000 107.24%)`
      }}
    >
      <div className={styles.header}>
        <button>
          <Home />
        </button>

        <Wordmark className={styles.logo} viewBox="0 0 352 78" />

        <div className={styles.actions}>
          <button>
            <Share2 />
          </button>

          <button>
            <Download />
          </button>

          <button>
            <Settings />
          </button>
        </div>
      </div>

      <PlayerPage id={id} meta={meta} video={video} />
    </div>
  );
}
