import {
  Badge,
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Artist } from "../lib/types";
import { PerformanceList } from "./PerformanceList";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ArtistDetailPanel({
  artist,
  onClose,
}: {
  artist: Artist | null;
  onClose: () => void;
}) {
  const open = artist !== null;

  const imgSrc = artist?.photo.localPath
    ? `${import.meta.env.BASE_URL}${artist.photo.localPath}`
    : undefined;

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="lg"
      scrollBehavior="inside"
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent bg="gray.900" maxH="90vh">
          {artist && (
            <>
              <DialogHeader>
                <DialogTitle>{artist.title}</DialogTitle>
              </DialogHeader>
              <DialogCloseTrigger />

              <DialogBody pb={6}>
                <VStack gap={5} align="stretch">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={artist.photo.alt ?? artist.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "cover",
                        borderRadius: "var(--chakra-radii-lg)",
                      }}
                    />
                  ) : (
                    <Flex
                      w="100%"
                      h="200px"
                      align="center"
                      justify="center"
                      rounded="lg"
                      bg="whiteAlpha.100"
                    >
                      <Text fontSize="5xl" fontWeight="bold" opacity={0.4}>
                        {getInitials(artist.title)}
                      </Text>
                    </Flex>
                  )}

                  {artist.description && (
                    <Text opacity={0.85} lineHeight="tall">
                      {artist.description}
                    </Text>
                  )}

                  <Box>
                    <Heading size="sm" mb={3}>
                      Performances
                    </Heading>
                    <PerformanceList performances={artist.performances} />
                  </Box>

                  {artist.music.embedUrl && artist.music.provider === "spotify" && (
                    <Box>
                      <Heading size="sm" mb={3}>
                        Listen
                      </Heading>
                      <iframe
                        style={{ borderRadius: "12px" }}
                        src={`${artist.music.embedUrl}?utm_source=generator`}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={`${artist.title} on Spotify`}
                      />
                    </Box>
                  )}

                  {!artist.music.embedUrl && artist.music.url && (
                    <Box>
                      <Button
                        as="a"
                        href={artist.music.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        colorPalette="teal"
                      >
                        🎵 Listen on{" "}
                        {artist.music.provider !== "none"
                          ? artist.music.provider
                          : "the web"}
                      </Button>
                    </Box>
                  )}

                  {artist.music.provider === "none" && !artist.music.url && (
                    <Badge variant="surface" size="sm" alignSelf="flex-start">
                      No listening link available
                    </Badge>
                  )}
                </VStack>
              </DialogBody>
            </>
          )}
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
