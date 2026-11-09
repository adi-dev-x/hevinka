// Plain mutable bridge between the DOM choreography (GSAP in the hero) and the lazy WebGL scene.
// No three.js import here, so the hero chunk stays light. GSAP tweens these numbers; the scene
// reads them every frame in useFrame (never React state per frame).

export type GlobeController = {
  /** DOM element whose on-screen rect the globe silhouette tracks (centre + diameter). */
  anchor: HTMLElement | null;
  /** Elements positioned over the Kochi / Dubai hubs each frame. */
  labels: { kochi: HTMLElement | null; dubai: HTMLElement | null };
  /** 0 → 1 intro: dots fade, arcs draw, atmosphere glows. */
  intro: number;
  /** 0 → 1 rotate to centre on Kochi. */
  focus: number;
  /** 0 → 1 brighten arcs leaving Kochi. */
  arcBoost: number;
  /** 0 → 1 visibility of the hub labels. */
  labelAlpha: number;
  /** Pointer in -1..1 (viewport), damped in the scene. */
  pointer: { x: number; y: number; inside: boolean };
  /** User paused looping motion (WCAG 2.2.2) or reduced motion. */
  paused: boolean;
  /** Called once when the first WebGL frame has rendered. */
  onFirstFrame?: () => void;
};

export function createGlobeController(): GlobeController {
  return {
    anchor: null,
    labels: { kochi: null, dubai: null },
    intro: 0,
    focus: 0,
    arcBoost: 0,
    labelAlpha: 0,
    pointer: { x: 0, y: 0, inside: false },
    paused: false,
  };
}

/** Background colour shared by the WebGL clear colour, the poster and the CSS behind them. */
export const GLOBE_BG = "#001c3d";

/** Poster framing: the poster image is this many times the globe diameter (to include the glow). */
export const POSTER_SCALE = 1.6;

/** Mutate the controller (kept out of component bodies so React Compiler treats it as external state). */
export function updateController(ctrl: GlobeController, patch: Partial<GlobeController>) {
  Object.assign(ctrl, patch);
}

export function setPointer(ctrl: GlobeController, x: number, y: number, inside: boolean) {
  ctrl.pointer.x = x;
  ctrl.pointer.y = y;
  ctrl.pointer.inside = inside;
}
