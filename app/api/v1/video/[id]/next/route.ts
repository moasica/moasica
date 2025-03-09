import { Innertube, UniversalCache } from 'youtubei.js';

import getPot from '@/util/pot';

import { type NextRequest } from 'next/server';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { token, visitorData } = await getPot({});

  const yt = await Innertube.create({
    po_token: token,
    visitor_data: visitorData,
    generate_session_locally: true,

    cache: new UniversalCache(false)
  });

  const id = (await params).id;
  const info = await yt.music.getUpNext(id, true);

  return Response.json({
    videos: info.contents.map((item) => {
      if (item.type !== 'PlaylistPanelVideo') return undefined;
      const i = item as any;

      return {
        type: 'song',
        id: i.video_id,
        title: i.title.text,
        artist: i.artists.map((artist: any) => {
          return {
            id: artist.channel_id,
            name: artist.name
          };
        }),
        album: i.album ? {
          id: i.album.id,
          title: i.album.name,
          year: i.album.year
        } : undefined,
        thumbnail: i.thumbnail,
        current: i.selected
      };
    }),
    continuation: info.continuation
  });
}