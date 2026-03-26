let initialized = false;

export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);

  if (!initialized) {
    gsap.registerPlugin(ScrollTrigger);
    initialized = true;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  return { gsap, ScrollTrigger };
}
