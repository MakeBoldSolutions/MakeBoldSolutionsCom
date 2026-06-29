// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// animations.jsx — timeline engine. Exports (on window): Stage, Sprite,
//   TextSprite, ImageSprite, RectSprite, VideoSprite, PlaybackBar,
//   useTime, useTimeline, useSprite, Easing, interpolate, animate, clamp.
//
//   <Stage width={1280} height={720} duration={10} background="#f6f4ef">
//     <Sprite start={0} end={3}>
//       <TextSprite text="Hello" x={100} y={300} size={72} color="#111" />
//     </Sprite>
//     <Sprite start={2} end={8}>
//       <ImageSprite src="hero.png" x={200} y={120} width={640} height={360} kenBurns />
//     </Sprite>
//   </Stage>
//
// Stage({width,height,duration,background,fps,loop,autoplay}) — auto-scales to
//   viewport; scrubber + play/pause + ←/→ seek + space + 0-reset; persists
//   playhead. The canvas is an <svg><foreignObject>, export-ready: Share →
//   Export → Video (or the PlaybackBar's download button) renders it to .mp4.
//   Screenshot tools DOM-rerender (not pixel-capture) and unwrap this wrapper
//   so captures should work — but if one comes back black, that's a capture
//   artifact, not a render bug; trust the live preview.
// Sprite({start,end,keepMounted}) — mounts children only while playhead is in
//   [start,end]. Children read {localTime, progress, duration} via useSprite().
// useTime() → seconds; useTimeline() → {time,duration,playing,setTime,setPlaying}.
// TextSprite({text,x,y,size,color,font,weight,align,entryDur,exitDur}) — fades/scales in+out.
// ImageSprite({src,x,y,width,height,fit,radius,kenBurns,placeholder}) — same, with optional ken-burns.
// RectSprite({x,y,width,height,color,radius}) — solid box with entry/exit.
// VideoSprite({src,start,end,speed,style}) — looped <video> clip synced to the
//   timeline; its audio is mixed into the exported video.
// Easing.{linear,easeIn/Out/InOut Quad/Cubic/Quart/Quint/Expo/Back, …}
// interpolate([t0,t1,…],[v0,v1,…],ease?) → (t)=>v  — piecewise tween.
// animate({from,to,start,end,ease}) → (t)=>v  — single tween.
//
// Build scenes by composing Sprites inside Stage. Absolutely-position elements.
//
// In a .dc.html project, put your scene in a sibling my-scene.jsx (reading
// {Stage, Sprite, useTime, Easing, …} from window is safe) and mount BOTH:
//   <x-import component-from-global-scope="MyScene"
//             from="./animations.jsx ./my-scene.jsx"></x-import>
// The two files in from= load in order, so my-scene.jsx can use the globals
// animations.jsx set.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: (t) => t,

  // Quad
  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  // Quart
  easeInQuart:    (t) => t * t * t * t,
  easeOutQuart:   (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  // Expo
  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },

  // Sine
  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Back (overshoot)
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // Elastic
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({ time: 0, duration: 10, playing: false });

const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only when the playhead is inside [start, end]. Provides
// a sub-context with `localTime` (seconds since start) and `progress` (0..1).
//
//   <Sprite start={2} end={5}>
//     {({ localTime, progress }) => <Thing x={progress * 100} />}
//   </Sprite>
//
// Or as a plain wrapper — children can call useSprite() themselves.

const SpriteContext = React.createContext({ localTime: 0, progress: 0, duration: 0 });
const useSprite = () => React.useContext(SpriteContext);

function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration)
    ? clamp(localTime / duration, 0, 1)
    : 0;

  const value = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── Sample sprite components ────────────────────────────────────────────────

// TextSprite: fades/slides text in on entry, holds, then fades out on exit.
// Props: text, x, y, size, color, font, entryDur, exitDur, align
function TextSprite({
  text,
  x = 0, y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em',
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let ty = 0;

  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * 8;
  }

  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  );
}

// ImageSprite: scales + fades in; optional Ken Burns drift during hold.
function ImageSprite({
  src,
  x = 0, y = 0,
  width = 400, height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null, // {label: string} for striped placeholder
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0;
    scale = 1 + (kenBurnsScale - 1) * holdT;
  }

  const content = placeholder ? (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      {placeholder.label || 'image'}
    </div>
  ) : (
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
  );

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }}>
      {content}
    </div>
  );
}

// RectSprite: simple rectangle that animates position/size/color via props.
// Useful demo primitive — takes a `render` fn for per-frame customization.
function RectSprite({
  x = 0, y = 0,
  width = 100, height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render, // optional: (ctx) => style overrides
}) {
  const spriteCtx = useSprite();
  const { localTime, duration } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1);
    scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = 1 - 0.15 * t;
  }

  const overrides = render ? render(spriteCtx) : {};

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides,
    }} />
  );
}


// ── Font inlining ───────────────────────────────────────────────────────────
// Copy every @font-face rule from the page into a <style> inside the svg's
// foreignObject, with font URLs rewritten to data: URLs. Makes the svg
// self-describing so serializing it alone (video export fast path) still
// renders with the right fonts. Sets data-om-fonts-inlined on the svg when
// done so the exporter can wait for it.

function useInlineFontsInto(svgRef) {
  React.useEffect(() => {
    const svg = svgRef.current;
    const host = svg && svg.querySelector('foreignObject > div');
    if (!svg || !host) return;
    let cancelled = false;
    (async () => {
      const rules = [];
      for (const ss of document.styleSheets) {
        let cssRules;
        try { cssRules = ss.cssRules; } catch {
          // Cross-origin sheet without crossorigin attr (e.g. the standard
          // fonts.googleapis.com <link>) — fetch the CSS text directly and
          // regex-extract the @font-face blocks.
          if (ss.href) {
            try {
              const txt = await fetch(ss.href).then(r => { if (!r.ok) throw 0; return r.text(); });
              for (const ff of (txt.match(/@font-face\s*{[^}]*}/g) || []))
                rules.push({ css: ff, base: ss.href });
            } catch {}
          }
          continue;
        }
        if (!cssRules) continue;
        for (const r of cssRules) {
          if (r.type === CSSRule.FONT_FACE_RULE) {
            rules.push({ css: r.cssText, base: ss.href || location.href });
          }
        }
      }
      const toDataURL = (url) => fetch(url)
        .then(r => { if (!r.ok) throw 0; return r.blob(); })
        .then(b => new Promise(res => {
          const fr = new FileReader();
          fr.onload = () => res(fr.result);
          fr.onerror = () => res(url);
          fr.readAsDataURL(b);
        }))
        .catch(() => url);
      const parts = await Promise.all(rules.map(async ({ css, base }) => {
        const re = /url\((['"]?)([^'")]+)\1\)/g;
        let out = css, m;
        while ((m = re.exec(css))) {
          const u = m[2];
          if (u.startsWith('data:')) continue;
          let abs; try { abs = new URL(u, base).href; } catch { continue; }
          out = out.split(m[0]).join(`url("${await toDataURL(abs)}")`);
        }
        return out;
      }));
      if (cancelled || !parts.length) {
        svg.setAttribute('data-om-fonts-inlined', 'true');
        return;
      }
      const style = document.createElement('style');
      style.textContent = parts.join('\n');
      host.insertBefore(style, host.firstChild);
      svg.setAttribute('data-om-fonts-inlined', 'true');
    })();
    return () => { cancelled = true; };
  }, []);
}


function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children,
}) {
  // Props arrive as strings when Stage is mounted via <x-import> (DC
  // projects) — coerce so style={{width}} gets a number React can px-ify.
  width = +width || 1280; height = +height || 720;
  duration = +duration || 10; fps = +fps || 60;
  if (typeof loop === 'string') loop = loop !== 'false';
  if (typeof autoplay === 'string') autoplay = autoplay !== 'false';

  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);

  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead
  React.useEffect(() => {
    try { localStorage.setItem(persistKey + ':t', String(time)); } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(
        el.clientWidth / width,
        (el.clientHeight - barH) / height
      );
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;
          else { next = duration; setPlaying(false); }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  // Video-export protocol: the exporter dispatches this event per frame;
  // pause + sync the playhead so the capture sees exactly that timestamp.
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onSeek = (e) => {
      setPlaying(false);
      setTime(clamp(e.detail.time, 0, duration));
    };
    el.addEventListener('data-om-seek-to-time-frame', onSeek);
    return () => el.removeEventListener('data-om-seek-to-time-frame', onSeek);
  }, [duration]);

  // Inline @font-face rules into the svg's foreignObject so the svg is
  // self-describing — serializing it alone (for video export) then renders
  // with the right fonts. Sets data-om-fonts-inlined once done.
  useInlineFontsInto(canvasRef);

  const displayTime = hoverTime != null ? hoverTime : time;

  const ctxValue = React.useMemo(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing]
  );

  return (
    <div
      ref={stageRef}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Canvas area — vertically centered in remaining space */}
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        <svg
          ref={canvasRef}
          width={width} height={height}
          data-om-exportable-video-with-duration-secs={duration}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            flexShrink: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            display: 'block',
          }}
        >
          <foreignObject x="0" y="0" width="100%" height="100%">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width, height,
                background,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <TimelineContext.Provider value={ctxValue}>
                {children}
              </TimelineContext.Provider>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Playback bar — stacked below canvas, never overlapping */}
      <PlaybackBar
        time={displayTime}
        actualTime={time}
        duration={duration}
        playing={playing}
        onPlayPause={() => setPlaying(p => !p)}
        onReset={() => { setTime(0); }}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
      />
    </div>
  );
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const timeFromEvent = React.useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);

  const onTrackMove = (e) => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };

  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };

  const onTrackDown = (e) => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e) => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = (t) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor((total * 100) % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';

  return (
    <div data-omelette-chrome style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 16px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',

      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      <IconButton onClick={onReset} title="Return to start (0)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
          </svg>
        )}
      </IconButton>

      {/* Current time: fixed width so it doesn't thrash */}
      <div style={{
        fontFamily: mono,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'right',
        color: '#f6f4ef',
      }}>
        {fmt(time)}
      </div>

      {/* Scrub track */}
      <div
        ref={trackRef}
        onMouseMove={onTrackMove}
        onMouseLeave={onTrackLeave}
        onMouseDown={onTrackDown}
        style={{
          flex: 1,
          height: 22,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          position: 'absolute',
          left: 0, right: 0, height: 4,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: 0, width: `${pct}%`, height: 4,
          background: 'oklch(72% 0.12 250)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: `${pct}%`, top: '50%',
          width: 12, height: 12,
          marginLeft: -6, marginTop: -6,
          background: '#fff',
          borderRadius: 6,
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}/>
      </div>

      {/* Duration: fixed width */}
      <div style={{
        fontFamily: mono,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'left',
        color: 'rgba(246,244,239,0.55)',
      }}>
        {fmt(duration)}
      </div>

      {typeof VideoEncoder !== 'undefined' && (
        <IconButton
          title="Export video"
          onClick={() => window.parent.postMessage({ type: 'omelette:request-video-export' }, '*')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7m0 0L4 6m3 3l3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </IconButton>
      )}
    </div>
  );
}

function IconButton({ children, onClick, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  );
}


// ── VideoSprite ─────────────────────────────────────────────────────────────
// Renders a <video> that loops within [start,end] of its source at `speed`,
// kept in sync with the Stage's playhead. Carries the
// data-om-exportable-video-play-* attrs so video export can mix its audio.
//
//   <VideoSprite src="clip.mp4" start={2} end={5} speed={1}
//     style={{ width: 640, height: 360 }} />

function VideoSprite({ src, start = 0, end, speed = 1, style, ...rest }) {
  start = +start || 0; speed = +speed || 1;
  if (end != null) end = +end || undefined;
  const t = useTime();
  const ref = React.useRef(null);
  const span = Math.max(0.001, ((end ?? start + 1) - start));
  React.useEffect(() => {
    const v = ref.current;
    if (!v || v.readyState < 1) return;
    const target = start + ((t * speed) % span);
    if (Math.abs(v.currentTime - target) > 0.05) v.currentTime = target;
  }, [t, start, span, speed]);
  return (
    <video
      ref={ref}
      src={src}
      muted playsInline preload="auto"
      data-om-exportable-video-play-start={start}
      data-om-exportable-video-play-end={end ?? start + span}
      data-om-exportable-video-play-speed={speed}
      style={{ display: 'block', objectFit: 'cover', ...style }}
      {...rest}
    />
  );
}


Object.assign(window, {
  Easing, interpolate, animate, clamp,
  TimelineContext, useTime, useTimeline,
  Sprite, SpriteContext, useSprite,
  TextSprite, ImageSprite, RectSprite, VideoSprite,
  Stage, PlaybackBar,
});

// ════════ Make Bold Solutions intro scenes ════════
// Make Bold Solutions — intro animation scenes.
// Mounted alongside animations.jsx (loaded first), which puts Stage/Sprite/etc on window.

// ── Brand constants ─────────────────────────────────────────────────────────
const RUST = '#982407';
const RUST_DEEP = '#841e05';
const EMBER = '#c6620c';
const EMBER_SOFT = '#e88f3d';
const INK = '#1e1e1e';
const INK_2 = '#2c2c2b';
const CREAM = '#f8f6f2';
const CREAM_DEEP = '#efece4';
const WHITE = '#ffffff';
const MUTED_DARK = '#9b988f';   // muted on dark
const MUTED_LIGHT = '#76736c';  // muted on cream
const ROSE = '#f4d2c8';         // light rust tint (for mark on rust bg)

const DISPLAY = '"Be Vietnam Pro", system-ui, sans-serif';
const BODY = '"Inter Tight", system-ui, sans-serif';

const W = 1920, H = 1080, CX = 960;

// ── The peak mark (two-peak logo), reveals bottom→top, staggered ─────────────
function PeakMark({ height = 220, x = CX, y = 0, align = 'center', p = 1, rust = RUST, ink = INK, drift = 0 }) {
  const w = height * 412 / 208;
  const uid = React.useId().replace(/:/g, '');
  const rp = Easing.easeOutCubic(clamp((p - 0) / 0.65, 0, 1));
  const ip = Easing.easeOutCubic(clamp((p - 0.16) / 0.7, 0, 1));
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${tx}, ${drift}px)`, willChange: 'transform' }}>
      <svg width={w} height={height} viewBox="0 0 412 208" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id={'r' + uid}><rect x="0" y={208 * (1 - rp)} width="412" height={208 * rp} /></clipPath>
          <clipPath id={'i' + uid}><rect x="0" y={208 * (1 - ip)} width="412" height={208 * ip} /></clipPath>
        </defs>
        <path d="M287.64,207.95H0L236.35,24.05l51.3,183.9Z" fill={rust} clipPath={`url(#r${uid})`} />
        <path d="M412,207.95H103.29L368.03,0l43.97,207.95Z" fill={ink} clipPath={`url(#i${uid})`} />
      </svg>
    </div>
  );
}

// ── Full lockup: mark + "Make Bold" + spaced SOLUTIONS ───────────────────────
function PeakMarkSprite({ start, end, ...rest }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const inP = Easing.easeOutExpo(clamp(localTime / 1.0, 0, 1));
        const outStart = duration - 0.4;
        const outP = localTime > outStart ? clamp((localTime - outStart) / 0.4, 0, 1) : 0;
        const drift = (1 - inP) * 60 - Math.sin(localTime * 0.7) * 4;
        return <div style={{ opacity: (1 - outP) }}><PeakMark p={inP} drift={drift} {...rest} /></div>;
      }}
    </Sprite>
  );
}

// ── Eyebrow (spaced uppercase) ───────────────────────────────────────────────
function Eyebrow({ start, end, text, x = CX, y, color = EMBER, size = 26, align = 'center' }) {
  return (
    <Sprite start={start} end={end}>
      <TextSprite text={text} x={x} y={y} size={size} weight={700} color={color}
        font={BODY} align={align} letterSpacing="0.32em" entryDur={0.4} exitDur={0.3} entryEase={Easing.easeOutCubic} />
    </Sprite>
  );
}

// ── A headline line ──────────────────────────────────────────────────────────
function Line({ start, end, text, x = CX, y, size = 100, color = INK, weight = 800, align = 'center', font = DISPLAY, ls = '-0.02em', entry = Easing.easeOutExpo }) {
  return (
    <Sprite start={start} end={end}>
      <TextSprite text={text} x={x} y={y} size={size} weight={weight} color={color}
        font={font} align={align} letterSpacing={ls} entryDur={0.5} exitDur={0.35} entryEase={entry} />
    </Sprite>
  );
}

// ── Credential chip (pops in, peak bullet) ───────────────────────────────────
function Chip({ label, x, y, variant = 'outline', accent = RUST, onDark = true }) {
  const { localTime } = useSprite();
  const p = Easing.easeOutBack(clamp(localTime / 0.45, 0, 1));
  const op = clamp(localTime / 0.3, 0, 1);
  const filled = variant === 'filled';
  const fg = filled ? CREAM : (onDark ? CREAM : INK);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `translateY(-50%) scale(${0.7 + 0.3 * p})`,
      transformOrigin: 'left center', opacity: op,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 28px', borderRadius: 10,
      background: filled ? accent : 'transparent',
      border: filled ? 'none' : `2px solid ${onDark ? 'rgba(248,246,242,0.32)' : 'rgba(30,30,30,0.22)'}`,
      fontFamily: BODY, fontSize: 34, fontWeight: 600, color: fg, whiteSpace: 'nowrap',
    }}>
      <svg width="22" height="14" viewBox="0 0 412 208"><path d="M412,207.95H103.29L368.03,0l43.97,207.95Z M287.64,207.95H0L236.35,24.05l51.3,183.9Z" fill={filled ? CREAM : accent} /></svg>
      {label}
    </div>
  );
}

// ── Cost bars: full-time vs fractional ───────────────────────────────────────
function CostBars({ x, y, w }) {
  const { localTime } = useSprite();
  const full = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));
  const frac = Easing.easeOutExpo(clamp((localTime - 0.5) / 0.9, 0, 1));
  const barH = 64, gap = 156;
  const row = (top, label, width, color, txt, labelColor) => (
    <div style={{ position: 'absolute', left: 0, top }}>
      <div style={{ fontFamily: BODY, fontSize: 28, fontWeight: 600, color: labelColor, marginBottom: 12 }}>{label}</div>
      <div style={{ width, height: barH, background: color, borderRadius: 8, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: BODY, fontSize: 26, fontWeight: 700, color: txt, padding: '0 22px', whiteSpace: 'nowrap', opacity: width > 200 ? 1 : 0 }}></span>
      </div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w }}>
      {row(0, 'A full-time CFO', w * full, INK_2, CREAM, MUTED_LIGHT)}
      {row(gap, 'Make Bold — fractional', w * 0.34 * frac, RUST, CREAM, RUST)}
    </div>
  );
}

// ── Ascending chart that climbs over a peak ──────────────────────────────────
function getPointAt(pts, frac) {
  let total = 0; const segs = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d); total += d;
  }
  let target = total * frac, acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= target) {
      const t = segs[i] === 0 ? 0 : (target - acc) / segs[i];
      return { x: pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, y: pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t, total };
    }
    acc += segs[i];
  }
  const last = pts[pts.length - 1];
  return { x: last[0], y: last[1], total };
}

function AscendingChart({ x, y, w, h }) {
  const { localTime } = useSprite();
  const draw = Easing.easeInOutCubic(clamp((localTime - 0.3) / 2.4, 0, 1));
  // points in chart-local coords (0..w, 0..h), y down
  const base = h - 20;
  const pts = [
    [0, base], [w * 0.14, base - h * 0.14], [w * 0.27, base - h * 0.08],
    [w * 0.42, base - h * 0.34], [w * 0.55, base - h * 0.30],
    [w * 0.70, base - h * 0.58], [w * 0.84, base - h * 0.74], [w, base - h * 0.96],
  ];
  const dpath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const { x: dx, y: dy, total } = getPointAt(pts, draw);
  const areaPath = `M0,${base} ` + pts.slice(0, 1).concat(pts).map(p => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ` L${dx.toFixed(1)},${base} Z`;
  const summit = pts[pts.length - 1];
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
        {/* faint peak silhouette behind */}
        <path d={`M0,${base} L${w * 0.5},${base - h * 0.5} L${w * 0.78},${base - h * 0.2} L${w},${base - h * 0.85} L${w},${base} Z`} fill={CREAM_DEEP} opacity="0.8" />
        {/* baseline */}
        <line x1="0" y1={base} x2={w} y2={base} stroke="#ddd9d0" strokeWidth="2" />
        {/* area under climb (clipped by draw via width) */}
        <clipPath id="climbClip"><rect x="0" y="0" width={dx} height={h} /></clipPath>
        <path d={areaPath} fill={RUST} opacity="0.10" clipPath="url(#climbClip)" />
        {/* the climbing line */}
        <path d={dpath} fill="none" stroke={RUST} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={total} strokeDashoffset={total * (1 - draw)} />
        {/* summit flag (peak mark) appears at end */}
        {draw > 0.97 && (
          <g transform={`translate(${summit[0] - 20}, ${summit[1] - 46})`} opacity={clamp((draw - 0.97) / 0.03, 0, 1)}>
            <path d="M412,207.95H103.29L368.03,0l43.97,207.95Z M287.64,207.95H0L236.35,24.05l51.3,183.9Z" fill={RUST} transform="scale(0.1)" />
          </g>
        )}
        {/* moving climber dot */}
        <circle cx={dx} cy={dy} r="11" fill={RUST} stroke={CREAM} strokeWidth="3" />
      </svg>
    </div>
  );
}

// ── Outcome row with peak bullet ─────────────────────────────────────────────
function Outcome({ label, x, y, color = INK }) {
  const { localTime } = useSprite();
  const p = Easing.easeOutExpo(clamp(localTime / 0.5, 0, 1));
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${(1 - p) * 30}px, -50%)`, opacity: clamp(localTime / 0.35, 0, 1), display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width="34" height="20" viewBox="0 0 412 208"><path d="M412,207.95H103.29L368.03,0l43.97,207.95Z M287.64,207.95H0L236.35,24.05l51.3,183.9Z" fill={EMBER} /></svg>
      <span style={{ fontFamily: DISPLAY, fontSize: 52, fontWeight: 700, color, letterSpacing: '-0.01em' }}>{label}</span>
    </div>
  );
}

// ── Background layer: wipe-in color panels by global time ─────────────────────
function BgLayer({ segments }) {
  const t = useTime();
  const clipFor = (dir, p) => {
    if (dir === 'none') return 'none';
    const o = (1 - p) * 100;
    if (dir === 'r') return `inset(0 ${o}% 0 0)`;
    if (dir === 'l') return `inset(0 0 0 ${o}%)`;
    if (dir === 't') return `inset(${o}% 0 0 0)`;
    return `inset(0 0 ${o}% 0)`;
  };
  return (
    <React.Fragment>
      {segments.map((s, i) => {
        const p = s.start <= 0 ? 1 : Easing.easeInOutQuart(clamp((t - s.start) / 0.5, 0, 1));
        if (t < s.start && i !== 0) return null;
        return (
          <div key={i} style={{
            position: 'absolute', inset: 0, background: s.color,
            clipPath: clipFor(i === 0 ? 'none' : s.dir, p), WebkitClipPath: clipFor(i === 0 ? 'none' : s.dir, p),
          }} />
        );
      })}
    </React.Fragment>
  );
}

// ── Faint drifting watermark peak (ambient motion) ───────────────────────────
function Watermark({ color, x, y, size = 900 }) {
  const t = useTime();
  const drift = Math.sin(t * 0.4) * 14;
  const scale = 1 + Math.sin(t * 0.3) * 0.02;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: 0.05, transform: `translateY(${drift}px) scale(${scale})`, pointerEvents: 'none' }}>
      <svg width={size} height={size * 208 / 412} viewBox="0 0 412 208"><path d="M412,207.95H103.29L368.03,0l43.97,207.95Z M287.64,207.95H0L236.35,24.05l51.3,183.9Z" fill={color} /></svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DIRECTION 1 — "THE CLIMB"  (narrative, metaphor-led)
// ════════════════════════════════════════════════════════════════════════════
function ClimbSequence() {
  const segs = [
    { start: 0, color: CREAM, dir: 'none' },
    { start: 5.4, color: INK, dir: 'b' },
    { start: 10.6, color: CREAM, dir: 't' },
    { start: 16.2, color: INK, dir: 'r' },
    { start: 22.4, color: CREAM, dir: 'l' },
    { start: 27.6, color: RUST, dir: 'b' },
  ];
  return (
    <React.Fragment>
      <BgLayer segments={segs} />

      {/* B0 — Brand cold open (0–5.4) */}
      <Sprite start={0} end={5.4}><Watermark color={RUST} x={1180} y={420} size={1000} /></Sprite>
      <PeakMarkSprite start={0.2} end={5.4} height={210} x={CX} y={250} />
      <Line start={0.9} end={5.4} text="Make Bold" y={530} size={132} weight={800} color={INK} />
      <Eyebrow start={1.5} end={5.4} text="S O L U T I O N S" y={700} color={EMBER} size={36} />
      <Line start={2.3} end={5.4} text="Big firm expertise. Small firm heart." y={800} size={42} weight={500} color={MUTED_LIGHT} font={BODY} ls="-0.005em" entry={Easing.easeOutCubic} />

      {/* B1 — The premise (5.4–10.6) */}
      <Eyebrow start={5.7} end={10.6} text="EVERY BUSINESS DESERVES ONE" y={300} color={EMBER_SOFT} />
      <Line start={6.0} end={10.6} text="A great CFO" y={470} size={150} weight={800} color={CREAM} />
      <Line start={6.4} end={10.6} text="shouldn't be a luxury." y={620} size={96} weight={700} color={EMBER_SOFT} />
      <Line start={8.3} end={10.6} text="Yet a full-time hire is out of reach for most." y={820} size={40} weight={500} color={MUTED_DARK} font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B2 — The fractional model (10.6–16.2) */}
      <Eyebrow start={10.9} end={16.2} text="THE FRACTIONAL MODEL" y={235} color={EMBER} align="left" x={300} />
      <Line start={11.2} end={16.2} text="Senior leadership," y={320} size={84} weight={800} color={INK} align="left" x={300} />
      <Line start={11.5} end={16.2} text="a fraction of the cost." y={420} size={84} weight={800} color={RUST} align="left" x={300} />
      <Sprite start={12.2} end={16.2}><CostBars x={300} y={560} w={1320} /></Sprite>
      <Line start={14.6} end={16.2} text="At the scope and pace your business actually needs." y={880} size={38} weight={500} color={MUTED_LIGHT} align="left" x={300} font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B3 — The Make Bold advantage (16.2–22.4) */}
      <Eyebrow start={16.5} end={22.4} text="WHO YOU PARTNER WITH" y={300} color={EMBER_SOFT} />
      <Line start={16.8} end={22.4} text="Lesley Hazleton, CPA" y={420} size={104} weight={800} color={CREAM} />
      <Sprite start={17.8} end={22.4}><Chip label="CFO of the Year — 2023" x={385} y={620} variant="filled" accent={RUST} /></Sprite>
      <Sprite start={18.2} end={22.4}><Chip label="PwC alumna" x={930} y={620} variant="outline" /></Sprite>
      <Sprite start={18.6} end={22.4}><Chip label="30+ years" x={1210} y={620} variant="outline" /></Sprite>
      <Line start={19.6} end={22.4} text="Fortune-500 financial discipline — delivered alongside you." y={790} size={40} weight={500} color={MUTED_DARK} font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B4 — Outcomes / the climb (22.4–27.6) */}
      <Eyebrow start={22.7} end={27.6} text="OUTCOMES YOU CAN SEE" y={250} color={EMBER} align="left" x={170} />
      <Sprite start={23.0} end={27.6}><AscendingChart x={150} y={330} w={820} h={620} /></Sprite>
      <Sprite start={23.6} end={27.6}><Outcome label="Cash flow clarity" x={1090} y={470} /></Sprite>
      <Sprite start={24.1} end={27.6}><Outcome label="A budget you can use" x={1090} y={620} /></Sprite>
      <Sprite start={24.6} end={27.6}><Outcome label="Books you can trust" x={1090} y={770} /></Sprite>

      {/* B5 — CTA (27.6–31) */}
      <Sprite start={27.6} end={31}><Watermark color={CREAM} x={-150} y={420} size={1100} /></Sprite>
      <PeakMarkSprite start={27.9} end={31} height={130} x={CX} y={250} rust={WHITE} ink={ROSE} />
      <Line start={28.2} end={31} text="Start your climb to value." y={460} size={112} weight={800} color={CREAM} />
      <Line start={28.9} end={31} text="makeboldsolutions.com" y={650} size={44} weight={600} color="rgba(248,246,242,0.92)" font={BODY} ls="0.01em" entry={Easing.easeOutCubic} />
      <Eyebrow start={29.4} end={31} text="BIG FIRM EXPERTISE.  SMALL FIRM HEART." y={960} color="rgba(248,246,242,0.7)" size={26} />
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DIRECTION 2 — "THE BRIEF"  (punchy full-bleed statement cuts)
// ════════════════════════════════════════════════════════════════════════════
function BriefSequence() {
  const segs = [
    { start: 0, color: RUST, dir: 'none' },
    { start: 4.6, color: INK, dir: 'r' },
    { start: 9.0, color: CREAM, dir: 'l' },
    { start: 13.4, color: RUST, dir: 'r' },
    { start: 18.0, color: INK, dir: 'l' },
    { start: 23.2, color: CREAM, dir: 'r' },
    { start: 27.6, color: RUST, dir: 't' },
  ];
  return (
    <React.Fragment>
      <BgLayer segments={segs} />

      {/* B0 — Brand (0–4.6) on rust */}
      <PeakMarkSprite start={0.1} end={4.6} height={170} x={CX} y={250} rust={WHITE} ink={ROSE} />
      <Line start={0.7} end={4.6} text="Make Bold Solutions" y={510} size={118} weight={800} color={CREAM} />
      <Eyebrow start={1.4} end={4.6} text="FRACTIONAL CFO  ·  STRATEGIC FINANCE" y={680} color="rgba(248,246,242,0.85)" size={30} />
      <Line start={2.0} end={4.6} text="Big firm expertise. Small firm heart." y={780} size={40} weight={500} color="rgba(248,246,242,0.78)" font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B1 — Premise (4.6–9.0) ink */}
      <Line start={4.9} end={9.0} text="Every business" y={400} size={150} weight={800} color={CREAM} />
      <Line start={5.2} end={9.0} text="deserves a great CFO." y={560} size={150} weight={800} color={EMBER_SOFT} />
      <Line start={6.8} end={9.0} text="Few can afford one full-time." y={780} size={44} weight={500} color={MUTED_DARK} font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B2 — Fractional (9.0–13.4) cream */}
      <Eyebrow start={9.3} end={13.4} text="THE FRACTIONAL MODEL" y={320} color={EMBER} />
      <Line start={9.6} end={13.4} text="So make it" y={460} size={120} weight={800} color={INK} />
      <Line start={9.9} end={13.4} text="fractional." y={620} size={150} weight={800} color={RUST} />
      <Line start={11.6} end={13.4} text="Senior expertise. Part-time cost. Full commitment." y={820} size={40} weight={500} color={MUTED_LIGHT} font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B3 — Credibility (13.4–18.0) rust */}
      <Eyebrow start={13.7} end={18.0} text="WHO YOU PARTNER WITH" y={300} color="rgba(248,246,242,0.85)" />
      <Line start={14.0} end={18.0} text="Lesley Hazleton, CPA" y={440} size={104} weight={800} color={CREAM} />
      <Sprite start={15.0} end={18.0}><Chip label="CFO of the Year — 2023" x={420} y={640} variant="filled" accent={INK} /></Sprite>
      <Sprite start={15.4} end={18.0}><Chip label="PwC alumna" x={980} y={640} variant="outline" /></Sprite>
      <Sprite start={15.8} end={18.0}><Chip label="30+ years" x={1260} y={640} variant="outline" /></Sprite>

      {/* B4 — Proof / stats (18.0–23.2) ink */}
      <Eyebrow start={18.3} end={23.2} text="FORTUNE-500 DISCIPLINE, MADE PERSONAL" y={280} color={EMBER_SOFT} />
      <Sprite start={18.7} end={23.2}><Outcome label="Cash flow clarity" x={560} y={480} color={CREAM} /></Sprite>
      <Sprite start={19.1} end={23.2}><Outcome label="A budget you can use" x={560} y={620} color={CREAM} /></Sprite>
      <Sprite start={19.5} end={23.2}><Outcome label="Books you can trust" x={560} y={760} color={CREAM} /></Sprite>

      {/* B5 — Audience (23.2–27.6) cream */}
      <Eyebrow start={23.5} end={27.6} text="BUILT FOR BUSINESSES OTHERS OVERLOOK" y={360} color={EMBER} />
      <Line start={23.8} end={27.6} text="Small businesses. Sole proprietors." y={500} size={76} weight={800} color={INK} />
      <Line start={24.1} end={27.6} text="Mission-driven nonprofits." y={610} size={76} weight={800} color={RUST} />
      <Line start={25.4} end={27.6} text="Direct senior-level access — no junior hand-offs." y={780} size={40} weight={500} color={MUTED_LIGHT} font={BODY} ls="0" entry={Easing.easeOutCubic} />

      {/* B6 — CTA (27.6–31) rust */}
      <PeakMarkSprite start={27.8} end={31} height={120} x={CX} y={250} rust={WHITE} ink={ROSE} />
      <Line start={28.1} end={31} text="Start your climb to value." y={460} size={108} weight={800} color={CREAM} />
      <Line start={28.8} end={31} text="makeboldsolutions.com" y={650} size={44} weight={600} color="rgba(248,246,242,0.92)" font={BODY} ls="0.01em" entry={Easing.easeOutCubic} />
      <Eyebrow start={29.3} end={31} text="BIG FIRM EXPERTISE.  SMALL FIRM HEART." y={960} color="rgba(248,246,242,0.7)" size={26} />
    </React.Fragment>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
function MBSIntroVideo({ direction = 'climb' }) {
  const bg = direction === 'brief' ? RUST : CREAM;
  return (
    <Stage width={W} height={H} duration={31} background={bg} persistKey={'mbs-' + direction}>
      {direction === 'brief' ? <BriefSequence /> : <ClimbSequence />}
    </Stage>
  );
}

window.MBSIntroVideo = MBSIntroVideo;
