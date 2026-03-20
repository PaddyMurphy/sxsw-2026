#!/bin/bash
# Resize and optimize artist images for web use.
# Uses macOS built-in `sips` — no dependencies needed.
#
# Images are displayed at max 300px height in the app,
# so we cap the longest edge at 600px (2x for retina).

IMAGE_DIR="$(dirname "$0")/../public/artist-images"
MAX_DIMENSION=600

echo "Optimizing images in $IMAGE_DIR ..."
echo "Max dimension: ${MAX_DIMENSION}px"
echo ""

total=0
saved=0

for img in "$IMAGE_DIR"/*.jpg; do
  [ -f "$img" ] || continue
  total=$((total + 1))

  filename=$(basename "$img")
  before_size=$(stat -f%z "$img")

  # Get current dimensions
  width=$(sips --getProperty pixelWidth "$img" 2>/dev/null | awk '/pixelWidth/{print $2}')
  height=$(sips --getProperty pixelHeight "$img" 2>/dev/null | awk '/pixelHeight/{print $2}')

  if [ -z "$width" ] || [ -z "$height" ]; then
    echo "⚠  Skipping $filename (could not read dimensions)"
    continue
  fi

  # Only resize if either dimension exceeds MAX_DIMENSION
  if [ "$width" -gt "$MAX_DIMENSION" ] || [ "$height" -gt "$MAX_DIMENSION" ]; then
    sips --resampleHeightWidthMax "$MAX_DIMENSION" "$img" --out "$img" >/dev/null 2>&1
  fi

  # Re-compress as JPEG at 80% quality
  sips --setProperty formatOptions 80 "$img" --out "$img" >/dev/null 2>&1

  after_size=$(stat -f%z "$img")
  reduction=$(( (before_size - after_size) * 100 / before_size ))

  if [ "$reduction" -gt 0 ]; then
    saved=$((saved + before_size - after_size))
    printf "✔  %-45s %6sK → %6sK  (%d%% smaller)\n" \
      "$filename" \
      "$((before_size / 1024))" \
      "$((after_size / 1024))" \
      "$reduction"
  else
    printf "–  %-45s %6sK (no change)\n" "$filename" "$((before_size / 1024))"
  fi
done

echo ""
echo "Done. Processed $total images, saved ~$((saved / 1024))K total."
