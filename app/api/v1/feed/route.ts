import { Innertube, UniversalCache } from 'youtubei.js';

import type { HomeFeed } from '@/util/interfaces';
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

  const chips = homeFeed.header?.chips.map((chip) => {
    return chip.text;
  });

  const content = homeFeed.sections?.map((section) => {
    if (section.type === 'MusicCarouselShelf' && 'header' in section && 'contents' in section) {
      return {
        title: section.header!.hasKey('title') ? toTitleCase(section.header.title.text as string) : undefined,
        strapline: section.header!.hasKey('strapline') ? section.header.strapline.text : undefined,
        content: section.contents.map((item: any) => {
          if (item.item_type === 'song') {
            return {
              type: item.item_type,
              id: item.id,
              paylist: item.menu.items[0].text === 'Start radio' ? item.menu.items[0].endpoint.payload.playlistId : undefined,
              title: item.title,
              artist: item.artists.map((artist: any) => {
                return {
                  id: artist.channel_id,
                  name: artist.name
                };
              }),
              album: {
                id: item.album.id,
                title: item.album.name
              },
              thumbnail: [
                {
                  url: item.thumbnail.contents[0].url.replace(`=w${item.thumbnail.contents[0].width}-h${item.thumbnail.contents[0].height}`, '=w544-h544'),
                  width: 544,
                  height: 544
                },
                ...item.thumbnail.contents
              ]
            };
          } else if (item.item_type === 'video') {
            return {
              type: item.item_type,
              id: item.id,
              paylist: item.menu.items[0].text === 'Start radio' ? item.menu.items[0].endpoint.payload.playlistId : undefined,
              title: item.title,
              artist: item.authors.map((artist: any) => {
                return {
                  id: artist.channel_id,
                  name: artist.name
                };
              }),
              thumbnail: item.thumbnail.contents
            };
          } else if (item.item_type === 'playlist') {
            return {
              type: item.item_type,
              id: item.id,
              title: item.title.text,
              subtitle: item.subtitle.text,
              thumbnail: item.thumbnail
            };
          } else return undefined;
        })
      };
    }
  });

  const feed: HomeFeed = {
    chips,
    content
  };

  return Response.json(feed);
}

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
};