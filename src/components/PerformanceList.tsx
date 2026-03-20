import { Badge, Box, HStack, Text, VStack } from "@chakra-ui/react";
import type { Performance } from "../lib/types";
import { formatTime } from "../lib/data";

export function PerformanceList({ performances }: { performances: Performance[] }) {
  return (
    <VStack gap={3} align="stretch">
      {performances.map((perf) => (
        <Box
          key={perf.id}
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          rounded="lg"
          p={3}
          bg="whiteAlpha.50"
        >
          <HStack gap={2} wrap="wrap" mb={1}>
            <Badge variant="surface" colorPalette="teal" size="sm">
              {perf.dayLabel}
            </Badge>
            <Text fontSize="sm" fontWeight="medium">
              {formatTime(perf.startsAt)} – {formatTime(perf.endsAt)}
            </Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold">
            {perf.venueName}
          </Text>
          {perf.subVenue && (
            <Text fontSize="xs" opacity={0.7}>
              {perf.subVenue}
            </Text>
          )}
          {perf.address && (
            <Text fontSize="xs" opacity={0.5}>
              {perf.address}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
}
