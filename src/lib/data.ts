import type { Artist, ArtistMusic, ArtistPhoto, Performance, RawEvent } from "./types";
import rawEvents from "../../sxsw-music-2026.json";
import enrichmentData from "../data/enrichment.json";

type EnrichmentEntry = {
  photo?: Partial<ArtistPhoto>;
  music?: Partial<ArtistMusic>;
};

const enrichment = enrichmentData as Record<string, EnrichmentEntry>;

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u0027\u2032']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLocation(raw: string): {
  venueName: string;
  subVenue?: string;
  address: string;
} {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { venueName: "Unknown", address: "" };

  const venueName = lines[0];
  const addressPattern = /^\d+/;

  const firstAddressIdx = lines.findIndex((l, i) => i > 0 && addressPattern.test(l));

  if (firstAddressIdx > 1) {
    return {
      venueName,
      subVenue: lines.slice(1, firstAddressIdx).join(", "),
      address: lines.slice(firstAddressIdx).join(", "),
    };
  }

  return {
    venueName,
    address: lines.slice(1).join(", "),
  };
}

function cleanDescription(desc: string): string | null {
  const trimmed = desc.trim();
  if (!trimmed || trimmed === "No description provided for film.") return null;
  return trimmed
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

export function buildArtists(): Artist[] {
  const events = rawEvents as RawEvent[];
  const artistMap = new Map<string, Artist>();

  for (const event of events) {
    const id = slugify(event.Title);
    const loc = parseLocation(event.Location);

    const perf: Performance = {
      id: `${id}__${event.Starts}`,
      startsAt: event.Starts,
      endsAt: event.Ends,
      dayLabel: formatDay(event.Starts),
      venueName: loc.venueName,
      subVenue: loc.subVenue,
      address: loc.address,
    };

    const existing = artistMap.get(id);
    if (existing) {
      existing.performances.push(perf);
      if (!existing.venueNames.includes(loc.venueName)) {
        existing.venueNames.push(loc.venueName);
      }
      if (!existing.description && cleanDescription(event.Description)) {
        existing.description = cleanDescription(event.Description);
      }
    } else {
      const enriched = enrichment[id];
      const photo: ArtistPhoto = enriched?.photo ?? {};
      const music: ArtistMusic = enriched?.music ?? { provider: "none" };

      artistMap.set(id, {
        id,
        title: event.Title,
        description: cleanDescription(event.Description),
        photo,
        music,
        performances: [perf],
        venueNames: [loc.venueName],
      });
    }
  }

  // Sort performances chronologically within each artist
  for (const artist of artistMap.values()) {
    artist.performances.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }

  return Array.from(artistMap.values()).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

export function getAllDays(artists: Artist[]): string[] {
  const days = new Set<string>();
  for (const a of artists) {
    for (const p of a.performances) {
      days.add(p.dayLabel);
    }
  }
  return Array.from(days).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
}

export function getAllVenues(artists: Artist[]): string[] {
  const venues = new Set<string>();
  for (const a of artists) {
    for (const v of a.venueNames) {
      venues.add(v);
    }
  }
  return Array.from(venues).sort();
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}
