export interface HomeFeed {
  chips: string[] | undefined;
  content: (Content | undefined)[] | undefined;
}

export interface Content {
  title: string | undefined;
  strapline: string | undefined;
  content: (Song | Playlist | undefined)[];
}

export interface Song {
  type: 'song';
  id: string;
  paylist: string | undefined;
  title: string;
  artist: Artist[];
  album: Album;
  thumbnail: Thumbnail;
}

export interface Playlist {
  type: 'playlist';
  id: string;
  title: string;
  subtitle: string;
  thumbnail: Thumbnail;
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