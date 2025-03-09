import { Innertube, UniversalCache } from 'youtubei.js';

import { type NextRequest } from 'next/server';
import getPot from '@/util/pot';

const badges: {
  [key: string]: number;
} = {
  MUSIC_EXPLICIT_BADGE: 1 << 0
};

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
  const info = await yt.music.getInfo(video);

  const mqtab = info.tabs!.find(
    (tab) => tab.content!.type === 'MusicQueue'
  )!.content!;
  const mqc =
    'content' in mqtab
      ? mqtab.content!.contents!.find((item) =>
        'selected' in item ? item.selected : false
      )!
      : null;

  let badge: any =
    'badges' in mqc!
      ? mqc.badges!.map((badge) => {
        return 'icon_type' in badge
          ? badges[badge.icon_type as string]
          : undefined;
      })
      : [];

  if (badge.length > 0) badge = badge.reduce((p: any, c: any) => p! + c!);
  else badge = undefined;

  return Response.json({
    id: info.basic_info.id,
    title: info.basic_info.title,
    artist:
      'artists' in mqc!
        ? mqc.artists!.map((artist) => {
          return {
            id: artist.channel_id,
            name: artist.name
          };
        })
        : undefined,
    album:
      'album' in mqc!
        ? {
          id: mqc.album!.id,
          title: mqc.album!.name,
          year: mqc.album!.year
        }
        : undefined,
    thumbnail: info.basic_info.thumbnail,
    badge,
    lenght: info.basic_info.duration,
    views: info.basic_info.view_count,
    playable: info.playability_status!.status === 'OK',
    playback:
      info.playability_status!.status === 'OK'
        ? {
          maxReadAhead:
              info.player_config!.media_common_config.dynamic_readahead_config
                .max_read_ahead_media_time_ms,
          minReadAhead:
              info.player_config!.media_common_config.dynamic_readahead_config
                .min_read_ahead_media_time_ms,
          readAhead:
              info.player_config!.media_common_config.dynamic_readahead_config
                .read_ahead_growth_rate_ms
        }
        : undefined
  });
}
