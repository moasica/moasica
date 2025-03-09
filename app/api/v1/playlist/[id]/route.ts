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
  const info = await yt.music.getPlaylist(id);

  return Response.json(info);
}