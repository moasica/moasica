export interface HomeFeed {
  chips?: string[];
  content?: (Content | undefined)[];
}

export interface Content {
  title?: string;
  strapline?: string;
  content: (Song | Playlist | undefined)[];
}

export interface Song {
  type: 'song' | 'video';
  id: string;
  paylist?: string;
  title: string;
  artist: Artist[];
  album?: Album;
  thumbnail: Thumbnail[];
}

export interface Playlist {
  type: 'playlist';
  id: string;
  title: string;
  subtitle: string;
  thumbnail: Thumbnail[];
}

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  title: string;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  id: string;
  title: string;
  artist: Artist[];
  album: Album;
  thumbnail: Thumbnail[];
  badge: number;
  lenght: number;
  views: number;
  playable: boolean;
  playback: {
    minReadAhead: number;
    maxReadAhead: number;
    readAhead: number;
  };
}