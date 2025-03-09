'use server';

import { JSDOM } from 'jsdom';
import { BG } from 'bgutils-js';

const rk = 'O43z0dpjhgX20SCx4KAo';
const getVisitorData = async (userAgent: string): Promise<string> => {
  const html = await (await fetch('https://music.youtube.com/', { headers: { 'User-Agent': userAgent } })).text();
  const dom = new JSDOM(html);

  const scripts = dom.window.document.querySelectorAll('script[nonce]');

  let ytcfg = null;
  scripts.forEach(script => {
    if (!script.innerHTML.includes('visitorData')) return;
    if (script.innerHTML.includes('ytInitialData')) return;

    ytcfg = JSON.parse(
      script
        .innerHTML
        .split('ytcfg.set(')[1]
        .split(');')[0]
    );
  });
  if (!ytcfg) throw new Error('Could not find visitorData!');

  const visitorData = ytcfg['INNERTUBE_CONTEXT']['client']['visitorData'];
  if (!visitorData) throw new Error('Could not find visitorData!');

  return visitorData;
};

export default async function getPot({
  userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  requestKey = rk
}: {
  userAgent?: string,
  requestKey?: string
}): Promise<{
  token: string,
  visitorData: string
}> {
  try {
    const dom = new JSDOM();
    const visitorData = await getVisitorData(userAgent);
    
    Object.assign(globalThis, {
      window: dom.window,
      document: dom.window.document,
    });

    const bgConfig = {
      fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => fetch(input, init),
      globalObj: globalThis,
      identifier: visitorData,
      requestKey
    };
    const bgChallenge = await BG.Challenge.create(bgConfig);

    if (!bgChallenge) throw new Error('Unable to create challenge!');

    const interpreterJavascript = bgChallenge.interpreterJavascript.privateDoNotAccessOrElseSafeScriptWrappedValue;
    if (interpreterJavascript) {
      new Function(interpreterJavascript)();
    } else throw new Error('Could not load VM');
    
    const token = await BG.PoToken.generate({
      program: bgChallenge.program,
      globalName: bgChallenge.globalName,
      bgConfig
    });

    return {
      token: token.poToken,
      visitorData
    };
  } catch (e) {
    console.error(e);

    return {
      token: '',
      visitorData: ''
    };
  }
}