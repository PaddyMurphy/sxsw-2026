import { Grid } from "@chakra-ui/react";
import type { Artist } from "../lib/types";
import { ArtistCard } from "./ArtistCard";

export function ArtistGrid({
  artists,
  onSelectArtist,
}: {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
}) {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap={5}
    >
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onClick={() => onSelectArtist(artist)}
        />
      ))}
    </Grid>
  );
}
