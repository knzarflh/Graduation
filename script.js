// ===== PARTICLE BACKGROUND =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 50;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '245,158,11' : '132,204,22';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== CONFETTI =====
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ['#f59e0b', '#84cc16', '#3b82f6', '#ef4444', '#10b981', '#ec4899'];

  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 12 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 5 + 3,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      opacity: 1
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    confetti.forEach(c => {
      c.y += c.speedY;
      c.x += c.speedX;
      c.rotation += c.rotSpeed;
      if (frame > 100) c.opacity = Math.max(0, c.opacity - 0.015);

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.globalAlpha = c.opacity;
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    });

    if (frame < 250) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ===== SCROLL REVEAL (ZOOM EFFECT) =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.timeline-item, .intro-card, .closing-card').forEach(el => {
    observer.observe(el);
  });
}

// ===== HEADER & NAVIGATION =====
function initNavigation() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('section, .cover-page');

  window.addEventListener('scroll', () => {
    // Header shadow
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Link State
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // Smooth Scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ===== COVER / OPEN LETTER =====
function initCover() {
  const coverPage = document.querySelector('.cover-page');
  const mainContent = document.querySelector('.main-content');
  const openBtn = document.querySelector('.open-btn');

  if (!openBtn) return;

  openBtn.addEventListener('click', () => {
    coverPage.classList.add('hidden');
    setTimeout(() => {
      mainContent.classList.add('visible');
      document.body.style.overflow = 'auto';
      launchConfetti();
      initScrollReveal();
      initNavigation();
    }, 800);
  });

  // Prevent scroll until opened
  document.body.style.overflow = 'hidden';
}

// ===== MUSIC TOGGLE =====
function initMusic() {
  const btn = document.querySelector('.music-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(e => console.error("Audio error:", e));
      btn.classList.add('playing');
    } else {
      audio.pause();
      btn.classList.remove('playing');
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCover();
  initMusic();
});
