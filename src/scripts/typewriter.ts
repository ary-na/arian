export const initTypewriter = (): void => {
  const elements = document.querySelectorAll<HTMLElement>('[data-typewriter]');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => {
      if (el.dataset.typewriter) el.textContent = el.dataset.typewriter;
    });
    return;
  }

  elements.forEach((el) => {
    const text = el.dataset.typewriter;
    if (!text) return;

    let i = 0;
    el.textContent = '';

    const type = (): void => {
      if (i >= text.length) return;
      el.textContent += text[i];
      i++;
      setTimeout(type, 80);
    };

    type();
  });
};
