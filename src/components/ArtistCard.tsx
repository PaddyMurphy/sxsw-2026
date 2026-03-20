import { Badge, Box, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import type { Artist } from "../lib/types";
import { formatTime } from "../lib/data";

const MotionBox = motion.create(Box);

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

function getGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function ArtistCard({ artist, onClick }: { artist: Artist; onClick: () => void }) {
  const imgSrc = artist.photo.localPath
    ? `${import.meta.env.BASE_URL}${artist.photo.localPath}`
    : undefined;

  const firstPerf = artist.performances[0];

  return (
    <MotionBox
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ willChange: "transform" }}
    >
      <Box
        as="article"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        rounded="xl"
        overflow="hidden"
        bg="whiteAlpha.50"
        cursor="pointer"
        onClick={onClick}
        _hover={{ borderColor: "whiteAlpha.400" }}
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <Box h="180px" position="relative" overflow="hidden" flexShrink={0}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={artist.photo.alt ?? artist.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Flex
              w="100%"
              h="100%"
              align="center"
              justify="center"
              style={{ background: getGradient(artist.id) }}
            >
              <Text fontSize="3xl" fontWeight="bold" color="white" opacity={0.8}>
                {getInitials(artist.title)}
              </Text>
            </Flex>
          )}
        </Box>

        <Flex direction="column" p={4} gap={2} flex={1}>
          <Heading size="md" lineClamp={1}>
            {artist.title}
          </Heading>

          <HStack gap={1} wrap="wrap">
            {artist.venueNames.slice(0, 2).map((v) => (
              <Badge key={v} variant="surface" colorPalette="purple" size="sm">
                {v}
              </Badge>
            ))}
            {artist.venueNames.length > 2 && (
              <Badge variant="surface" size="sm">
                +{artist.venueNames.length - 2}
              </Badge>
            )}
          </HStack>

          {artist.description && (
            <Text fontSize="sm" opacity={0.75} lineClamp={3}>
              {artist.description}
            </Text>
          )}

          {firstPerf && (
            <Text fontSize="xs" opacity={0.6} mt="auto">
              {firstPerf.dayLabel} · {formatTime(firstPerf.startsAt)}
            </Text>
          )}

          {artist.music.url && (
            <Box mt={1}>
              <Badge
                as="a"
                href={artist.music.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="surface"
                colorPalette="teal"
                size="sm"
                cursor="pointer"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                🎵 {artist.music.provider !== "none" ? artist.music.provider : "Listen"}
              </Badge>
            </Box>
          )}
        </Flex>
      </Box>
    </MotionBox>
  );
}
