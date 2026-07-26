/* ============================================================
   hero-video.js — looping homepage videos (hero + video band)
   Any <video data-loop-video> is played only while it's on screen and
   only when the user hasn't asked for reduced motion — motion-sensitive
   visitors keep the static poster. Off-screen videos are paused to save
   CPU/battery, and below-the-fold clips (preload="none") don't fetch
   their bytes until they scroll into view. Elements are muted +
   playsinline, so play() is allowed without a user gesture.
   ============================================================ */

const videos = document.querySelectorAll('[data-loop-video]');

if (videos.length) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target;
        if (entry.isIntersecting && !reduce.matches) {
          video.play().catch(() => {}); // ignore autoplay rejection; poster stays
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.25 },
  );

  videos.forEach((video) => io.observe(video));

  // If the user switches on reduced motion mid-session, stop everything.
  reduce.addEventListener('change', () => {
    if (reduce.matches) videos.forEach((video) => video.pause());
  });
}
