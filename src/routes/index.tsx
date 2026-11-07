import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday! A Purple Surprise 💜" },
      { name: "description", content: "A birthday surprise with seven greetings, a cake to celebrate, and a personal wish." },
      { property: "og:title", content: "Happy Birthday! A Purple Surprise 💜" },
      { property: "og:description", content: "Seven greetings, a cake, music and a special wish just for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

// ✏️ Personalize here
const FRIEND_NAME = "Sayanita";
const FROM_NAME = "Debjit";
const CUSTOM_WISH =
  "Happy birthday to the most wonderful person I know! Thank you for every laugh, every late-night talk and every moment you made brighter. May this year bring you endless joy, big dreams coming true, and all the love you give to others. Borahae! 💜";

const MEMBERS = [
  { name: "RM", emoji: "🐨", line: "Happy birthday! May your year be full of wisdom, wonder and big ideas." },
  { name: "Jin", emoji: "🐹", line: "Happy birthday! You deserve a world-wide-handsome celebration today!" },
  { name: "Suga", emoji: "🐱", line: "Happy birthday. Rest well, dream big, and enjoy every sweet moment." },
  { name: "J-Hope", emoji: "🐿️", line: "Happy birthday! You are my hope — shine bright like sunshine today!" },
  { name: "Jimin", emoji: "🐥", line: "Happy birthday! Sending you the warmest hugs and the softest smiles." },
  { name: "V", emoji: "🐻", line: "Happy birthday! I purple you — let's make today a beautiful memory." },
  { name: "Jungkook", emoji: "🐰", line: "Happy birthday! Let's celebrate — the cake is waiting for you!" },
];

// Happy Birthday (public domain) melody: [semitones from C4, beats]
const MELODY: [number, number][] = [
  [7, .75], [7, .25], [9, 1], [7, 1], [12, 1], [11, 2],
  [7, .75], [7, .25], [9, 1], [7, 1], [14, 1], [12, 2],
  [7, .75], [7, .25], [19, 1], [16, 1], [12, 1], [11, 1], [9, 2],
  [17, .75], [17, .25], [16, 1], [12, 1], [14, 1], [12, 2],
];

function useMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    const loop = () => {
      let t = ctx.currentTime + 0.1;
      const beat = 0.45;
      for (const [s, b] of MELODY) {
        const f = 261.63 * Math.pow(2, s / 12);
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + b * beat * 0.95);
        o.connect(g).connect(ctx.destination);
        o.start(t); o.stop(t + b * beat);
        t += b * beat;
      }
      const total = MELODY.reduce((a, [, b]) => a + b, 0) * beat;
      timer.current = window.setTimeout(loop, (total + 1) * 1000);
    };
    loop(); setPlaying(true);
  };
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    ctxRef.current?.close(); ctxRef.current = null; setPlaying(false);
  };
  useEffect(() => () => stop(), []);
  return { playing, play, stop };
}

function Confetti() {
  const pieces = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((_, i) => (
        <span key={i} className="confetti" style={{
          left: `${(i * 37) % 100}%`, animationDelay: `${(i % 12) * 0.25}s`,
          background: `var(--chart-${(i % 5) + 1})`,
        }} />
      ))}
    </div>
  );
}

function Index() {
  const [step, setStep] = useState(-1); // -1 intro, 0-6 members, 7 cake, 8 wish
  const music = useMusic();
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const allOut = candles.every((c) => !c);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 font-body text-foreground">
      <div className="sparkles" />
      {step === -1 && (
        <section className="fade-up text-center">
          <p className="text-6xl">💜</p>
          <h1 className="mt-4 font-display text-5xl text-primary md:text-7xl">Hey {FRIEND_NAME}!</h1>
          <p className="mt-4 text-lg text-muted-foreground">Seven special guests have something to tell you…</p>
          <button onClick={() => setStep(0)} className="btn mt-8">Open your surprise ✨</button>
        </section>
      )}

      {step >= 0 && step < 7 && (
        <section key={step} className="pop-in w-full max-w-md">
          <div className="rounded-3xl border border-border bg-card p-8 backdrop-blur-xl text-center shadow-[var(--shadow-glow)]">
            <div className="flex justify-center gap-1.5">{MEMBERS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />)}</div>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Greeting {step + 1} of 7</p>
            <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center float rounded-full bg-[image:var(--gradient-primary)] text-6xl ring-4 ring-primary/30 ring-offset-4 ring-offset-card">
              {MEMBERS[step]!.emoji}
            </div>
            <h2 className="mt-5 font-display text-4xl text-primary">{MEMBERS[step]!.name}</h2>
            <p className="mt-4 text-lg leading-relaxed">“{MEMBERS[step]!.line}”</p>
            <button onClick={() => setStep(step + 1)} className="btn mt-8">
              {step < 6 ? "Next 💜" : "Let's get the cake 🎂"}
            </button>
          </div>
        </section>
      )}

      {step === 7 && (
        <section className="fade-up text-center">
          {allOut && <Confetti />}
          <h2 className="font-display text-4xl text-primary md:text-5xl">
            {allOut ? "Yay! Wish made 🎉" : "Make a wish & blow out the candles"}
          </h2>
          <p className="mt-2 text-muted-foreground">{allOut ? "" : "Tap each flame to blow it out"}</p>
          <div className="cake-wrap relative mx-auto mt-12 w-80">
            <div className="relative z-10 mx-auto flex w-52 justify-around">
              {candles.map((lit, i) => (
                <button key={i} aria-label={lit ? "Blow out candle" : "Candle out"} onClick={() => setCandles(candles.map((c, j) => (j === i ? false : c)))} className="group flex flex-col items-center">
                  <span className="flex h-8 items-end">{lit ? <span className="flame" /> : <span className="smoke" />}</span>
                  <span className="candle" style={{ background: `repeating-linear-gradient(45deg, var(--frosting) 0 4px, var(--chart-${(i % 5) + 1}) 4px 8px)` }} />
                </button>
              ))}
            </div>
            <div className="tier mx-auto h-20 w-56 rounded-t-2xl"><span className="drip" /><span className="sprinkles" /></div>
            <div className="tier tier-b mx-auto h-24 w-72 rounded-t-2xl"><span className="drip" /><span className="name-tag font-display">{FRIEND_NAME}</span></div>
            <div className="plate mx-auto h-4 w-80 rounded-full" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{candles.filter(Boolean).length} candle(s) still glowing</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={music.playing ? music.stop : music.play} className="btn-outline">
              {music.playing ? "⏸ Stop music" : "🎵 Play birthday song"}
            </button>
            {allOut && <button onClick={() => setStep(8)} className="btn">Read my wish 💌</button>}
          </div>
        </section>
      )}

      {step === 8 && (
        <section className="fade-up w-full max-w-xl">
          <Confetti />
          <div className="rounded-3xl border border-border bg-card p-8 backdrop-blur-xl text-center shadow-[var(--shadow-glow)] md:p-12">
            <p className="text-5xl">💌</p>
            <h2 className="mt-4 font-display text-4xl text-primary md:text-5xl">Happy Birthday, {FRIEND_NAME}!</h2>
            <p className="mt-6 whitespace-pre-line text-lg leading-relaxed">{CUSTOM_WISH}</p>
            <p className="mt-8 font-display text-2xl text-primary">— with love, {FROM_NAME}</p>
            <button onClick={() => { setStep(-1); setCandles([true, true, true, true, true]); music.stop(); }} className="btn-outline mt-8">
              Replay ↺
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
