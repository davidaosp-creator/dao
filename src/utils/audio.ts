// Web Audio API Synthesizer for Black Jack da Copa 2026

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generate procedurally synthesized sound effects
export const soundEffects = {
  // Coin flip metallic chime - "Som de moeda"
  playCoin: () => {
    try {
      const ctx = getAudioContext();
      const time = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, time);
      // Reduzi a rampa para soar mais rápido
      osc1.frequency.exponentialRampToValueAtTime(1800, time + 0.05);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200, time);
      osc2.frequency.exponentialRampToValueAtTime(2600, time + 0.05);

      // Ajuste aqui: volume sobe rápido e cai drasticamente (encurtado para 0.2s)
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.3, time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.2); 

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(time);
      osc2.start(time);
      
      // O som agora morre em 0.2 segundos, impedindo o "vazamento"
      osc1.stop(time + 0.2);
      osc2.stop(time + 0.2);
    } catch (e) {
      console.warn("Audio disabled or error in playCoin", e);
    }
  },

  // Crowd cheer - "Efeitos sonoros de torcida"
  playCrowdCheer: () => {
    try {
      const ctx = getAudioContext();
      const time = ctx.currentTime;
      const duration = 2.5;

      // Create white noise
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // Low-pass & Band-pass filter to sound like an arena crowd
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, time);
      filter.Q.setValueAtTime(1.5, time);
      filter.frequency.exponentialRampToValueAtTime(700, time + 0.4);
      filter.frequency.exponentialRampToValueAtTime(350, time + duration);

      // Low bass drone for stadium rumble
      const bassNode = ctx.createOscillator();
      bassNode.type = 'sawtooth';
      bassNode.frequency.setValueAtTime(82, time); // low E
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(120, time);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.35, time + 0.3); // rapid cheer buildup
      gainNode.gain.exponentialRampToValueAtTime(0.1, time + 1.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

      // Connect nodes
      noiseNode.connect(filter);
      filter.connect(gainNode);

      bassNode.connect(bassFilter);
      bassFilter.connect(gainNode);

      gainNode.connect(ctx.destination);

      noiseNode.start(time);
      bassNode.start(time);
      noiseNode.stop(time + duration);
      bassNode.stop(time + duration);
    } catch (e) {
      console.warn("Audio disabled or error in playCrowdCheer", e);
    }
  },

  // Referee whistle - "Apito inicial/final"
  playRefereeWhistle: () => {
    try {
      const ctx = getAudioContext();
      const time = ctx.currentTime;

      // Real referee's whistle has a crisp, piercing sound (around 2400Hz - 2600Hz) with rapid beating (flutter) and noise characteristics.
      // We combine a high-frequency band-pass filtered white noise burst with two oscillators.
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Better frequencies for real high-pitch referee whistle 
      osc1.frequency.setValueAtTime(2500, time);
      osc2.frequency.setValueAtTime(2560, time);

      // Rapid vibrating LFO for the pea rattle inside standard whistle
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(55, time); // 55Hz rapid ripple
      lfoGain.gain.setValueAtTime(120, time); // severe freq shift for realistic flutter

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Noise generator for physical air blow effect
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2530, time);
      noiseFilter.Q.setValueAtTime(8, time); // highly resonant band

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, time);
      noiseGain.gain.linearRampToValueAtTime(0.04, time + 0.015);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.35, time + 0.015);
      gainNode.gain.setValueAtTime(0.35, time + 0.18);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      lfo.start(time);
      osc1.start(time);
      osc2.start(time);
      noiseSource.start(time);

      lfo.stop(time + 0.25);
      osc1.stop(time + 0.25);
      osc2.stop(time + 0.25);

      // Secondary short whistle blow for a perfect double whistle (classic referee start)
      setTimeout(() => {
        const time2 = ctx.currentTime;
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const gNode = ctx.createGain();

        o1.frequency.setValueAtTime(2500, time2);
        o2.frequency.setValueAtTime(2560, time2);

        const lf = ctx.createOscillator();
        const lfGain = ctx.createGain();
        lf.frequency.setValueAtTime(55, time2);
        lfGain.gain.setValueAtTime(120, time2);

        lf.connect(lfGain);
        lfGain.connect(o1.frequency);
        lfGain.connect(o2.frequency);

        const noiseSrc2 = ctx.createBufferSource();
        noiseSrc2.buffer = buffer;
        const noiseFilt2 = ctx.createBiquadFilter();
        noiseFilt2.type = 'bandpass';
        noiseFilt2.frequency.setValueAtTime(2530, time2);
        noiseFilt2.Q.setValueAtTime(8, time2);

        const noiseG2 = ctx.createGain();
        noiseG2.gain.setValueAtTime(0, time2);
        noiseG2.gain.linearRampToValueAtTime(0.04, time2 + 0.015);
        noiseG2.gain.exponentialRampToValueAtTime(0.001, time2 + 0.4);

        noiseSrc2.connect(noiseFilt2);
        noiseFilt2.connect(noiseG2);
        noiseG2.connect(ctx.destination);

        gNode.gain.setValueAtTime(0, time2);
        gNode.gain.linearRampToValueAtTime(0.35, time2 + 0.015);
        gNode.gain.exponentialRampToValueAtTime(0.001, time2 + 0.4);

        o1.connect(gNode);
        o2.connect(gNode);
        gNode.connect(ctx.destination);

        lf.start(time2);
        o1.start(time2);
        o2.start(time2);
        noiseSrc2.start(time2);

        lf.stop(time2 + 0.45);
        o1.stop(time2 + 0.45);
        o2.stop(time2 + 0.45);
      }, 250);

    } catch (e) {
      console.warn("Audio disabled or error in playRefereeWhistle", e);
    }
  },

  // Card slide swoosh – "Animações suaves de cartas em transição"
  playCardDraw: () => {
    try {
      const ctx = getAudioContext();
      const time = ctx.currentTime;
      const duration = 0.25;

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);
      filter.frequency.exponentialRampToValueAtTime(2500, time + duration);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.08, time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseNode.start(time);
      noiseNode.stop(time + duration);
    } catch (e) {
      console.warn("Audio error in playCardDraw", e);
    }
  },

  // Crowd sigh (when losing or bust)
  playCrowdOoh: () => {
    try {
      const ctx = getAudioContext();
      const time = ctx.currentTime;
      const duration = 1.2;

      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, time);
      filter.Q.setValueAtTime(2.0, time);
      filter.frequency.exponentialRampToValueAtTime(250, time + duration);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.2, time + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseNode.start(time);
      noiseNode.stop(time + duration);
    } catch (e) {
      console.warn("Audio error in playCrowdLament", e);
    }
  }
};
