import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Container,
  HStack,
  Heading,
  Link,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import type { Artist } from "./lib/types";
import { buildArtists } from "./lib/data";
import { SearchToolbar } from "./components/SearchToolbar";
import { ArtistGrid } from "./components/ArtistGrid";
import { ArtistDetailPanel } from "./components/ArtistDetailPanel";
import { WaveformBackground } from "./components/WaveformBackground";

export default function App() {
  const [reduceMotion] = useMediaQuery(["(prefers-reduced-motion: reduce)"]);
  const allArtists = useMemo(() => buildArtists(), []);
  const [filtered, setFiltered] = useState<Artist[]>(allArtists);
  const [selected, setSelected] = useState<Artist | null>(null);

  return (
    <Box
      minH="100vh"
      py={{ base: 10, md: 14 }}
      position="relative"
      bg="radial-gradient(ellipse 120% 60% at 10% 0%, rgba(0,217,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 100% 50% at 90% 20%, rgba(129,140,248,0.15) 0%, transparent 55%), radial-gradient(ellipse 80% 40% at 50% 100%, rgba(56,178,172,0.18) 0%, transparent 50%), linear-gradient(180deg, #0a0a0f 0%, #0d1020 40%, #120d1e 70%, #0a0a0f 100%)"
      backgroundAttachment="fixed"
    >
      <WaveformBackground />
      <Container maxW="6xl" position="relative" zIndex={1}>
        <VStack gap={{ base: 6, md: 8 }} align="stretch">
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
          >
            <Box>
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                letterSpacing="-0.02em"
              >
                SXSW Music 2026
              </Heading>
              <Text mt={3} opacity={0.85} maxW="72ch">
                Music I saw at SXSW 2026. Explore {allArtists.length} artists,
                venues, and set times. Photos and listening links are provided
                where possible.
              </Text>
              <HStack mt={4} gap={2} wrap="wrap">
                <Badge variant="surface" colorPalette="teal">
                  {allArtists.length} artists
                </Badge>
              </HStack>
            </Box>
          </motion.section>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              ease: "easeOut",
              delay: reduceMotion ? 0 : 0.05,
            }}
          >
            <SearchToolbar artists={allArtists} onFilter={setFiltered} />
          </motion.div>

          <ArtistGrid artists={filtered} onSelectArtist={setSelected} />

          <ArtistDetailPanel
            artist={selected}
            onClose={() => setSelected(null)}
          />

          <VStack gap={1}>
            <Text fontSize="sm" opacity={0.7} marginBlockEnd={4}>
              Data:{" "}
              <Link href="https://sxsw.com/" textDecoration="underline">
                sxsw.com
              </Link>
              {" · "}
              <Link href="https://open.spotify.com/" textDecoration="underline">
                Spotify
              </Link>
            </Text>
            <Text fontSize="xs" opacity={0.3}>
              <Link href="https://mountaindrawn.com/">mountaindrawn.com</Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

export { App };
