import { Music } from 'lucide-react';

import Image from 'next/image';

export default async function Home() {
  const f = await fetch(`http://localhost:3000/api/feed`);
  const feed = await f.json();

  const sections = feed.sections;

  // <a href={`/watch?v=${item.id}`}>{item.item_type == 'playlist' ? item.title.text : item.title}</a>

  return (
    <>
      <Music />

      <h1>Moasica</h1>

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
    </>
  );
}
