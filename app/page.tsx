import { AtSign, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';

import { Content, HomeFeed, Playlist, Song } from '@/util/interfaces';

import Wordmark from '@/public/wordmark.svg';

import styles from '@/styles/SearchBar.module.scss';
import Carousel from '@/components/Carousel';

export default async function Home() {
  const f = await fetch(`http://localhost:3000/api/v1/feed`);
  const feed: HomeFeed = await f.json();

  //const sections = feed.sections;

  const chips = feed.chips;
  const content = feed.content;

  // <a href={`/watch?v=${item.id}`}>{item.item_type == 'playlist' ? item.title.text : item.title}</a>
  /*
  {sections.map((section: any) => (
        <div key={section.header.title.text}>
          <h2>{section.header.title.text}</h2>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', flexFlow: 'row wrap' }}>
            {section.contents.map((item: any) => (
              <li key={item.id}>
                <a href={`/watch?v=${item.id}`}>
                  {item.item_type == 'playlist' ? <Image src={item.thumbnail[0].url} height={128} width={128} alt="Thumbnail" /> : <Image src={item.thumbnail.contents[0].url} height={128} width={128} alt="Thumbnail" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
        */

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '48px' }}>
        <Wordmark style={{ height: '32px', width: 'auto' }} viewBox="0 0 352 78" />

        <div className={styles.searchBar}>
          <Search />

          <input type="text" placeholder="Search something..." />
        </div>

        <div>
          <button>
            <AtSign />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 48px' }}>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>  
          {chips?.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>

        {content?.map((section) => (
          <Carousel key={section?.title} title={section!.title!} strapline={section!.strapline} items={section!.content} />
        ))}
      </div>
    </>
  );
}
