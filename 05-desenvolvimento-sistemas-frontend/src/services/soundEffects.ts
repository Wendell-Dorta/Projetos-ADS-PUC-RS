// Simple synthesizer using Web Audio API to play UI sounds programmatically
export const playSound = (type: 'success' | 'delete' | 'click') => {
  if (typeof window === 'undefined') return;
  
  // Respect user preference to mute sounds
  if (localStorage.getItem('mute_sounds') === 'true') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      // Ascending chime sound (C5 to E5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'delete') {
      // Descending warning sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(392.00, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(196.00, ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'click') {
      // Short click sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    // Gracefully handle browser policy autoplay blocks
    console.debug('AudioContext blocked or not supported', e);
  }
};
