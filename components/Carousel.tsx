'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, Fragment } from 'react';

import Image from 'next/image';

import { Playlist, Song } from '@/util/interfaces';
import { isPlaylistArray, isSongArray } from '@/util/is';

import styles from '@/styles/Carousel.module.scss';

interface CarouselProps {
  title: string;
  strapline?: string;
  items: (Song | Playlist | undefined)[];
}

export default function Carousel({
  title,
  strapline,
  items,
}: CarouselProps) {
  const songListRef = useRef<HTMLUListElement>(null);

  const scrollLeft = () => {
    if (songListRef.current) {
      songListRef.current.scrollBy({
        left: (-256 + 16) * 2,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (songListRef.current) {
      songListRef.current.scrollBy({
        left: (256 + 16) * 2,
        behavior: 'smooth'
      });
    }
  };

  if (!items)
    return <p>Error: `items` is undefined.</p>;

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTitle}>
        <div className={styles.carouselTitleText}>
          {strapline && <label>{strapline}</label>}
          <h2>{title}</h2>
        </div>

        <div className={styles.carouselTitleControls}>
          <button onClick={scrollLeft}>
            <ChevronLeft />
          </button>
          <button onClick={scrollRight}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <ul className={styles.carouselContent} ref={songListRef}>
        {isSongArray(items) && items.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}

        {isPlaylistArray(items) && items.map((playlist) => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
        ))}
      </ul>
    </div>
  );
}

function SongItem({ song }: { song: Song }) {
  return (
    <li className={styles.carouselItem}>
      <a href={`/watch?v=${song.id}&list=${song.paylist}`}>
        <Image src={song.thumbnail[0].url} height={256} width={256} alt="Thumbnail" />
      </a>

      <div className={styles.carouselItemText}>
        <h3>{song.title}</h3>
        <p>
          {song.artist.map((artist, index) => (
            <Fragment key={artist.id}>
              <a href={`/channel/${artist.id}`}>{artist.name}</a>
              {index < song.artist.length - 1 && (
                index === song.artist.length - 2 ? ' & ' : ', '
              )}
            </Fragment>
          ))}
        </p>
      </div>
    </li>
  );
}

function PlaylistItem({ playlist }: { playlist: Playlist }) {
  return (
    <li className={styles.carouselItem}>
      <a href={`/playlist?list=${playlist.id}`}>
        <Image src={playlist.thumbnail[0].url} height={256} width={256} alt="Thumbnail" />
      </a>

      <div className={styles.carouselItemText}>
        <h3>{playlist.title}</h3>
        <p>{playlist.subtitle}</p>
      </div>
    </li>
  );
}
