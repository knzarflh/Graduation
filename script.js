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

// ===== COVER / OPEN LETTER & AUTH =====
function initCover() {
  const coverPage = document.querySelector('.cover-page');
  const mainContent = document.querySelector('.main-content');
  const openBtn = document.querySelector('.open-btn');
  const authOverlay = document.getElementById('auth-overlay');
  const submitAuthBtn = document.getElementById('submit-auth-btn');
  const kanzaDob = document.getElementById('kanza-dob');
  const maydaDob = document.getElementById('mayda-dob');
  const authError = document.getElementById('auth-error');

  if (!openBtn || !authOverlay) return;

  // 1. Tampilkan overlay autentikasi saat tombol ditekan
  openBtn.addEventListener('click', () => {
    authOverlay.classList.add('show');
  });

  // 2. Validasi kata sandi (tanggal lahir)
  submitAuthBtn.addEventListener('click', () => {
    // Normalisasi teks: ubah ke huruf kecil, hapus spasi di awal/akhir, dan ganti spasi ganda jadi spasi tunggal
    const kanzaVal = kanzaDob.value.toLowerCase().trim().replace(/\s+/g, ' ');
    const maydaVal = maydaDob.value.toLowerCase().trim().replace(/\s+/g, ' ');

    // Daftar variasi penulisan yang dianggap benar
    const kanzaValid = ['3 januari 2007', '03 januari 2007', '3 jan 2007', '03 jan 2007', '3-1-2007', '03-01-2007', '3/1/2007', '03/01/2007', '2007-01-03'];
    const maydaValid = ['3 desember 2006', '03 desember 2006', '3 des 2006', '03 des 2006', '3-12-2006', '03-12-2006', '3/12/2006', '03/12/2006', '2006-12-03'];

    if (kanzaValid.includes(kanzaVal) && maydaValid.includes(maydaVal)) {
      // Jika benar: sembunyikan overlay & cover page, munculkan main content
      authOverlay.classList.remove('show');
      coverPage.classList.add('hidden');
      
      setTimeout(() => {
        mainContent.classList.add('visible');
        document.body.style.overflow = 'auto';
        launchConfetti();
        initScrollReveal();
        initNavigation();
      }, 800);
    } else {
      // Jika salah: tampilkan pesan error
      authError.classList.add('show');
      setTimeout(() => {
        authError.classList.remove('show');
      }, 3000); // hilangkan pesan setelah 3 detik
    }
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

// ===== IMAGE LIGHTBOX MODAL =====
function initImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeModal = document.querySelector('.close-modal');
  const clickableImages = document.querySelectorAll('.clickable-image');

  if (!modal || !modalImg) return;

  clickableImages.forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = 'flex';
      // Use a slight delay to allow display: flex to apply before adding class for transition
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      modalImg.src = this.src;
    });
  });

  const close = () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300); // match css transition duration
  };

  if (closeModal) {
    closeModal.addEventListener('click', close);
  }

  // Close when clicking outside the image
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      close();
    }
  });
}

// ===== COVERFLOW CAROUSEL (INFINITE) =====
function initCoverflow() {
  const track = document.querySelector('.carousel-track');
  let originalItems = Array.from(document.querySelectorAll('.carousel-item'));
  if (!track || originalItems.length === 0) return;

  const originalCount = originalItems.length;
  // Clone agar seakan tak terbatas (60 set = 300 elemen)
  const numSets = 60;
  for (let i = 0; i < numSets - 1; i++) {
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
  }

  const allItems = Array.from(document.querySelectorAll('.carousel-item'));

  function updateCards() {
    const trackCenter = track.offsetWidth / 2;
    const scrollLeft = track.scrollLeft;
    
    allItems.forEach(item => {
      // Optimisasi: Abaikan elemen yang jauh dari layar
      const itemOffset = item.offsetLeft - scrollLeft;
      if (itemOffset < -600 || itemOffset > track.offsetWidth + 600) {
        item.style.opacity = '0';
        return;
      }

      const itemCenter = itemOffset + item.offsetWidth / 2;
      const distanceFromCenter = itemCenter - trackCenter;
      
      const normalizedDist = distanceFromCenter / 160; 
      
      const scale = Math.max(0.6, 1 - Math.abs(normalizedDist) * 0.15);
      const rotateY = normalizedDist * -35; 
      const zIndex = Math.round(100 - Math.abs(normalizedDist) * 10);
      const opacity = Math.max(0.4, 1 - Math.abs(normalizedDist) * 0.3);

      item.style.transform = `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
      item.style.zIndex = zIndex;
      item.style.opacity = opacity;
    });
  }

  // Sembunyikan sebentar saat inisialisasi agar lompatan awal ke tengah tidak terlihat
  track.style.opacity = '0';
  
  setTimeout(() => {
    // Mulai dari set ke-30 (tengah-tengah)
    const middleIndex = 30 * originalCount;
    if (allItems[middleIndex]) {
      const target = allItems[middleIndex];
      // Posisikan scroll agar item tersebut tepat di tengah
      track.scrollLeft = target.offsetLeft - track.offsetWidth / 2 + target.offsetWidth / 2;
    }
    updateCards();
    
    // Munculkan kembali dengan smooth
    track.style.transition = 'opacity 0.5s ease';
    track.style.opacity = '1';
  }, 50);

  track.addEventListener('scroll', () => {
    requestAnimationFrame(updateCards);
  });
  
  window.addEventListener('resize', () => {
    requestAnimationFrame(updateCards);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCover();
  initMusic();
  initImageModal();
  initCoverflow();
});
