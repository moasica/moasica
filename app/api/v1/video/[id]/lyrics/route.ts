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
  const info = await yt.music.getLyrics(video);

  return Response.json({
    text: info!.description.text,
    source: info!.footer.text?.replace('Source: ', '').trim()
  });
}
