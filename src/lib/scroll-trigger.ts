import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isScrollTriggerRegistered = false;

export { gsap, ScrollTrigger };

export function ensureScrollTriggerRegistration(): void {
  if (isScrollTriggerRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  isScrollTriggerRegistered = true;
}
