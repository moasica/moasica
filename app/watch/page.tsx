import Player from '@/components/Player';
import { Video } from '@/util/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

export default async function Watch({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const id = (await searchParams).v as string;
  //const list = (await searchParams).list as string;

  const f = await fetch(`http://localhost:3000/api/v1/video/${id}`);
  const video: Video = await f.json();

  if (!video.playable) {
    return (
      <h1>Video is unplayable!</h1>
    );
  }

  const meta = {
    title: video.title,
    artist: video.artist.map((artist) => artist.name).join(', '),
    artwork: video.thumbnail.map((thumb) => { return { src: thumb.url }; })
  };

  return (
    <div>
      <h1>{video.title}</h1>
      <p>
        {video.artist.map((artist, index) => (
          <Fragment key={index}>
            <Link href={`/channel/${artist.id}`}>{artist.name}</Link>
            {index < video.artist.length - 1 && (
              index === video.artist.length - 2 ? ' & ' : ', '
            )}
          </Fragment>
        ))}
      </p>

      <Image src={video.thumbnail[0].url} height={512} width={512} alt="Thumbnail" style={{ objectFit: 'cover' }} />
      <Player src={`/api/v1/video/${id}/dash`} metadata={meta} playback={video.playback} />
    </div>
  );
}
