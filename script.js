(() => {
  const root = document.documentElement;

  // Theme toggle — night mode by default, remembers the visitor's choice
  const toggle = document.querySelector('.theme-toggle');
  const isDark = () => root.dataset.theme !== 'light';
  toggle.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Live Karachi time in the hero
  const timeEl = document.getElementById('local-time');
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Karachi', hour: 'numeric', minute: '2-digit' });
  const tick = () => { timeEl.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 30000);

  document.getElementById('year').textContent = new Date().getFullYear();

  // Copy email
  const copyBtn = document.getElementById('copy-email');
  const status = document.querySelector('.copy-status');
  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch (e) {
      const tmp = Object.assign(document.createElement('textarea'), { value: email });
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      tmp.remove();
    }
    status.textContent = 'Copied!';
    setTimeout(() => { status.textContent = ''; }, 2000);
  });

  // Contact form → mailto (no backend needed on GitHub Pages)
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const empty = !field.value.trim();
      field.setAttribute('aria-invalid', empty);
      if (empty && valid) { field.focus(); valid = false; }
    });
    if (!valid) return;
    const { name, company, message } = Object.fromEntries(new FormData(form));
    const subject = `Portfolio enquiry from ${name}${company ? ` (${company})` : ''}`;
    location.href = `mailto:${copyBtn.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });

  // Fade sections in as they scroll into view
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
})();
