import { Innertube, UniversalCache } from 'youtubei.js';

import { type NextRequest } from 'next/server';
import getPot from '@/util/pot';

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

  const video = (await params).id;

  const videoInfo = await yt.music.getInfo(video);
  const manifest = await videoInfo.toDash((url) => {
    return new URL(
      (process.env.PROXY_URI || 'http://localhost:8080') +
        '/?url=' +
        encodeURIComponent(url.toString())
    );
  });

  const headers = new Headers();
  headers.set('Content-Type', 'application/dash+xml');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(manifest, {
    headers
  });
}
