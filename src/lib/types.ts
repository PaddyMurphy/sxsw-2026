export type Performance = {
  id: string;
  startsAt: string;
  endsAt: string;
  dayLabel: string;
  venueName: string;
  subVenue?: string;
  address: string;
};

export type ArtistPhoto = {
  localPath?: string;
  sourceUrl?: string;
  alt?: string;
};

export type ArtistMusic = {
  provider: "spotify" | "bandcamp" | "soundcloud" | "youtube" | "apple" | "other" | "none";
  url?: string;
  embedUrl?: string;
  label?: string;
};

export type Artist = {
  id: string;
  title: string;
  description: string | null;
  photo: ArtistPhoto;
  music: ArtistMusic;
  performances: Performance[];
  venueNames: string[];
};

export type RawEvent = {
  Title: string;
  Location: string;
  Starts: string;
  Ends: string;
  Description: string;
};
