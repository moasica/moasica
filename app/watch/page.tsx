import Player from '@/components/Player';
import Image from 'next/image';

export default async function Watch({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const id = (await searchParams).v as string;
  //const list = (await searchParams).list as string;

  const f = await fetch(`http://localhost:3000/api/v1/video/${id}`);
  const video = await f.json();

  if (video.playability_status!.status !== 'OK') {
    return (
      <h1>Video is unplayable!</h1>
    );
  }

  const meta = {
    title: video.basic_info?.title,
    artist: video.basic_info?.author,
    artwork: video.basic_info?.thumbnail.map((thumb: any) => { return { src: thumb.url }; })
  };

  return (
    <div>
      <h1>{video.basic_info?.title}</h1>
      <p>{video.basic_info?.author}</p>

      <Image src={video.basic_info?.thumbnail[0].url} height={512} width={512} alt="Thumbnail" style={{ objectFit: 'cover' }} />
      <Player src={`http://localhost:3000/api/v1/video/${id}/dash`} metadata={meta} />
    </div>
  );
}
