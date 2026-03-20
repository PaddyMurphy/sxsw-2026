import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Text,
  Wrap,
} from "@chakra-ui/react";
import type { Artist } from "../lib/types";
import { getAllDays, getAllVenues } from "../lib/data";

export function SearchToolbar({
  artists,
  onFilter,
}: {
  artists: Artist[];
  onFilter: (filtered: Artist[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [venue, setVenue] = useState("");

  const days = useMemo(() => getAllDays(artists), [artists]);
  const venues = useMemo(() => getAllVenues(artists), [artists]);

  const applyFilters = useCallback(() => {
    let result = artists;
    const q = search.toLowerCase().trim();

    if (q) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.venueNames.some((v) => v.toLowerCase().includes(q))
      );
    }

    if (day) {
      result = result.filter((a) =>
        a.performances.some((p) => p.dayLabel === day)
      );
    }

    if (venue) {
      result = result.filter((a) => a.venueNames.includes(venue));
    }

    onFilter(result);
  }, [artists, search, day, venue, onFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const hasFilters = search !== "" || day !== "" || venue !== "";

  const filteredCount = useMemo(() => {
    let result = artists;
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.venueNames.some((v) => v.toLowerCase().includes(q))
      );
    }
    if (day) {
      result = result.filter((a) =>
        a.performances.some((p) => p.dayLabel === day)
      );
    }
    if (venue) {
      result = result.filter((a) => a.venueNames.includes(venue));
    }
    return result.length;
  }, [artists, search, day, venue]);

  return (
    <Box
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      rounded="xl"
      p={{ base: 4, md: 5 }}
      bg="whiteAlpha.50"
    >
      <Flex direction={{ base: "column", md: "row" }} gap={3}>
        <Input
          placeholder="Search artists, venues, descriptions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          flex={1}
          size="md"
        />
        <NativeSelectRoot size="md" w={{ base: "100%", md: "200px" }}>
          <NativeSelectField
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          >
            <option value="">All venues</option>
            {venues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Flex>

      <Wrap mt={3} gap={2} align="center">
        <Button
          size="xs"
          variant={day === "" ? "solid" : "outline"}
          colorPalette="teal"
          onClick={() => setDay("")}
        >
          All days
        </Button>
        {days.map((d) => (
          <Button
            key={d}
            size="xs"
            variant={day === d ? "solid" : "outline"}
            colorPalette="teal"
            onClick={() => setDay(d)}
          >
            {d}
          </Button>
        ))}
      </Wrap>

      <HStack mt={3} justify="space-between">
        <Text fontSize="sm" opacity={0.7}>
          {filteredCount} artist{filteredCount !== 1 ? "s" : ""}
        </Text>
        {hasFilters && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              setSearch("");
              setDay("");
              setVenue("");
            }}
          >
            Clear filters
          </Button>
        )}
      </HStack>
    </Box>
  );
}
