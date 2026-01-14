document.addEventListener("DOMContentLoaded", () => {
  // Fade IN when page loads
  document.body.classList.add("page-ready");

  // Intercept link clicks
  document.addEventListener("click", e => {
    const link = e.target.closest("a");

    if (!link) return;
    if (!link.href) return;

    // Ignore new tabs, downloads, external links
    if (
      link.target === "_blank" ||
      link.hasAttribute("download") ||
      link.origin !== window.location.origin
    ) {
      return;
    }

    e.preventDefault();

    // Fade OUT
    document.body.classList.remove("page-ready");
    document.body.classList.add("page-exit");

    // Navigate after animation
    setTimeout(() => {
      window.location.href = link.href;
    }, 350); // must match CSS transition
  });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.querySelectorAll('.scroll-move').forEach(el => {
    observer.observe(el);
});
