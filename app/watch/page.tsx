import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";

export default async function Watch({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const id = (await searchParams).v as string;

  const f = await fetch(`http://localhost:3000/api/video/${id}`);
  const video = await f.json();

  if (video.playability_status!.status !== 'OK') {
    return (
      <h1>Video is unplayable!</h1>
    );
  }

  const thumbnail = await (await fetch(video.basic_info?.thumbnail[0].url)).blob();

  return (
    <div>
      <h1>{video.basic_info?.title}</h1>
      <p>{video.basic_info?.author}</p>

      <Image src={video.basic_info?.thumbnail[0].url} height={video.basic_info?.thumbnail[0].height} width={video.basic_info?.thumbnail[0].width} alt="Thumbnail" />
      <VideoPlayer id={id} playerConfig={video.player_config} />
    </div>
  );
}
