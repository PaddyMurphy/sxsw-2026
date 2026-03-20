import { useEffect, useRef } from "react";

/**
 * Full-screen canvas background rendering subtle rhythmic audio waveforms.
 * Respects prefers-reduced-motion by pausing animation.
 */
export function WaveformBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stopped = false;
    let scrollY = window.scrollY;

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Wave configuration — several overlapping waveforms at different
    // frequencies and amplitudes to simulate an equalizer / sound wave feel.
    const waves = [
      { freq: 0.008, amp: 28, speed: 0.012, yOffset: 0.30, color: "rgba(0,217,255,0.06)" },
      { freq: 0.012, amp: 22, speed: 0.018, yOffset: 0.35, color: "rgba(0,217,255,0.04)" },
      { freq: 0.006, amp: 35, speed: 0.008, yOffset: 0.65, color: "rgba(56,178,172,0.06)" },
      { freq: 0.010, amp: 18, speed: 0.022, yOffset: 0.70, color: "rgba(56,178,172,0.04)" },
      { freq: 0.014, amp: 14, speed: 0.028, yOffset: 0.50, color: "rgba(129,140,248,0.05)" },
    ];

    // Rhythmic "beat" pulse — modulates amplitude on a slow cycle
    const beatBpm = 72; // subtle resting heartbeat tempo
    const beatFreq = beatBpm / 60; // Hz

    let t = 0;

    const draw = () => {
      if (stopped) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Scroll-derived factors
      const maxScroll = document.documentElement.scrollHeight - h;
      const scrollRatio = maxScroll > 0 ? scrollY / maxScroll : 0; // 0 → 1
      const scrollPhase = scrollY * 0.002; // phase shift from scrolling

      // Beat pulse factor: oscillates 0.6 → 1.0, scroll boosts amplitude slightly
      const beat =
        (0.6 + 0.4 * Math.pow(Math.sin(t * beatFreq * Math.PI), 2)) *
        (1 + scrollRatio * 0.3);

      for (const [i, wave] of waves.entries()) {
        ctx.beginPath();
        // Scroll shifts wave vertical position: odd/even waves drift in opposite directions
        const drift = (i % 2 === 0 ? 1 : -1) * scrollRatio * 0.08;
        const baseY = h * (wave.yOffset + drift);

        for (let x = 0; x <= w; x += 2) {
          const y =
            baseY +
            wave.amp *
              beat *
              Math.sin(x * wave.freq + t * wave.speed * 60 + scrollPhase * (i + 1) * 0.5) *
              // Envelope: fade edges so waves don't clip hard at screen borders
              Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw a subtle filled area beneath each wave
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = wave.color.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.3})`);
        ctx.fill();
      }

      t += 1 / 60; // ~60fps tick
      animId = requestAnimationFrame(draw);
    };

    if (!prefersReduced) {
      draw();
    } else {
      // Draw a single static frame
      t = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const wave of waves) {
        ctx.beginPath();
        const baseY = h * wave.yOffset;
        for (let x = 0; x <= w; x += 2) {
          const y =
            baseY +
            wave.amp *
              0.6 *
              Math.sin(x * wave.freq) *
              Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
