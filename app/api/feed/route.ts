import { Innertube, UniversalCache } from 'youtubei.js';

import getPot from '@/util/pot';

export async function GET() {
  const { token, visitorData } = await getPot({ });
  const yt = await Innertube.create({
    po_token: token,
    visitor_data: visitorData,
    generate_session_locally: true,
    
    cache: new UniversalCache(false)
  });

  const homeFeed = await yt.music.getHomeFeed();
  return Response.json(homeFeed);
}
