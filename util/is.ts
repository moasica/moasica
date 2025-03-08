import { Playlist, Song } from './interfaces';

function isSongArray(content: (Song | Playlist | undefined)[]): content is Song[] {
  return content.every(item => item !== undefined && (item?.type === 'song' || item?.type === 'video'));
}
function isPlaylistArray(content: (Song | Playlist | undefined)[]): content is Playlist[] {
  return content.every(item => item !== undefined && item?.type === 'playlist');
}

export {
  isSongArray,
  isPlaylistArray
};
