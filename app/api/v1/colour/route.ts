import { topColoursHex } from '@colour-extractor/colour-extractor';
import { NextRequest } from 'next/server';

import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  // download the image and get the top colours
  const f = await fetch(decodeURIComponent(url!));
  const data = await f.arrayBuffer();
  const dir = path.join(process.cwd(), 'tmp');
  console.log(dir);

  const mimetype = f.headers.get('content-type');
  if (!mimetype || !mimetype.startsWith('image')) {
    return new Response('Not an image!', { status: 400 });
  }
  const extension = mimetype.split('/')[1];

  await fs.writeFile(path.join(process.cwd(), 'tmp') + '/img.' + extension, Buffer.from(data));
  const averageColor = await topColoursHex(path.join(process.cwd(), 'tmp') + '/img.' + extension);
  await fs.rm(path.join(process.cwd(), 'tmp') + '/img.' + extension);

  function averageColors(colors: string[]) {
    const total = colors.length;
    let r = 0, g = 0, b = 0;

    colors.forEach(color => {
      let hex = color.replace(/^#/, '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }

      const num = parseInt(hex, 16);
      r += (num >> 16) & 255;
      g += (num >> 8) & 255;
      b += num & 255;
    });

    r = Math.round(r / total);
    g = Math.round(g / total);
    b = Math.round(b / total);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }

  return Response.json([
    averageColors(averageColor as string[]),
    ...(averageColor as string[])
  ]);
}