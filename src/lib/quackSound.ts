// Web Audio API quack sound generator

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Call this in user gesture context to unlock AudioContext for later use
export async function primeAudio() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  } catch {}
}

export async function playQuack() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    const now = ctx.currentTime;

    // Main quack oscillator
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Filter for nasal quality
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(3, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);

    // Second quack (optional double quack)
    if (Math.random() > 0.5) {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();

      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(750, now + 0.2);
      osc2.frequency.exponentialRampToValueAtTime(350, now + 0.28);

      gain2.gain.setValueAtTime(0.2, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      filter2.type = "bandpass";
      filter2.frequency.setValueAtTime(550, now + 0.2);
      filter2.Q.setValueAtTime(3, now + 0.2);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.2);
      osc2.stop(now + 0.45);
    }
  } catch (e) {
    // Silently fail if audio not available
  }
}
