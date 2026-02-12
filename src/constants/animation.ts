// Easing curves for Framer Motion
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

// Spring presets for Framer Motion
export const SPRING_SNAPPY = { stiffness: 400, damping: 25 };
export const SPRING_BOUNCY = { stiffness: 300, damping: 15 };
export const SPRING_SMOOTH = { stiffness: 200, damping: 30 };

// Duration (seconds)
export const DUR_FAST = 0.3;
export const DUR_NORMAL = 0.5;
export const DUR_SLOW = 0.8;
export const DUR_REVEAL = 1.0;
export const DUR_TRANSITION = 0.7;

// Stagger
export const STAGGER_FAST = 0.03;
export const STAGGER_NORMAL = 0.08;
export const STAGGER_SLOW = 0.15;

// Mobile breakpoint
export const MOBILE_BREAKPOINT = 768;

// ScrollTrigger defaults
export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top 85%',
  end: 'top 20%',
  scrub: 1,
};
