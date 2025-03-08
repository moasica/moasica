import { AtSign, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';

import { HomeFeed } from '@/util/interfaces';

import Wordmark from '@/public/wordmark.svg';

import styles from '@/styles/SearchBar.module.scss';

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
          <div key={section!.title} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                {section!.strapline && <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '-4px' }}>{section!.strapline}</p>}
                <h2 style={{ fontSize: '160%' }}>{section!.title}</h2>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ display: 'flex', padding: '4px', gap: '4px', borderRadius: '50%', border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
                  <ChevronLeft />
                </button>
                <button style={{ display: 'flex', padding: '4px', gap: '4px', borderRadius: '50%', border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
                  <ChevronRight />
                </button>
              </div>
            </div>

            <ul style={{ display: 'grid', gridTemplateColumns: `repeat(${section!.content.length}, 256px)`, gap: '1rem', listStyle: 'none', overflowX: 'scroll', overflowY: 'hidden', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
              {section!.content.map((item) => (
                item && (
                  <li key={item!.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '256px' }}>
                    <a href={`/watch?v=${item!.id}`}>
                      <Image src={item!.thumbnail[0]!.url} width={256} height={256} alt="Thumbnail" style={{ borderRadius: '8px' }} />
                    </a>

                    <h3>{item!.title}</h3>
                    {item!.artist && <p>{item!.artist.map((artist) => artist.name).join(', ')}</p>}
                    {item!.subtitle && <p>{item!.subtitle}</p>}
                  </li>
                )
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
