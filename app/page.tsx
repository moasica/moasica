'use client';

import { AtSign, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { HomeFeed } from '@/util/interfaces';

import Wordmark from '@/public/wordmark.svg';

import styles from '@/styles/SearchBar.module.scss';
import Carousel from '@/components/Carousel';
import Loader from '@/components/Loader';

export default function Home() {
  const [chips, setChips] = useState<string[] | undefined>(undefined);
  const [content, setContent] = useState<HomeFeed['content'] | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const f = await fetch('/api/v1/feed');
      const feed: HomeFeed = await f.json();

      setChips(feed.chips);
      setContent(feed.content);
    })();
  }, []);

  if (!content) return <Loader />;

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '48px'
        }}
      >
        <Wordmark
          style={{ height: '32px', width: 'auto' }}
          viewBox="0 0 352 78"
        />

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

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '0 48px'
        }}
      >
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
          {chips?.map((chip) => <li key={chip}>{chip}</li>)}
        </ul>

        {content?.map((section) => (
          <Carousel
            key={section?.title}
            title={section!.title!}
            strapline={section!.strapline}
            items={section!.content}
          />
        ))}
      </div>
    </>
  );
}
