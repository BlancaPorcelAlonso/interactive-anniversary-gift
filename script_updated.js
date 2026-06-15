/* ==========================================================================
   INTERACTIVE LOGIC & ANIMATIONS (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const screenGift = document.getElementById('screen-gift');
  const screenMemories = document.getElementById('screen-memories');
  const screenLetter = document.getElementById('screen-letter');
  const screenCelebration = document.getElementById('screen-celebration');
  
  const btnOpenGift = document.getElementById('btn-open-gift');
  const giftBox = document.getElementById('gift-box');
  
  const btnOpenLetter = document.getElementById('btn-open-letter');
  const envelopeContainer = document.getElementById('envelope-container');
  const receiptPaper = document.getElementById('receipt-paper');
  const termsContainer = document.getElementById('terms-container');
  
  const btnAccept = document.getElementById('btn-accept');
  const btnDecline = document.getElementById('btn-decline');
  const btnRestart = document.getElementById('btn-restart');
  
  const daysCounter = document.getElementById('days-counter');
  const ambientContainer = document.getElementById('ambient-container');
  const toastContainer = document.getElementById('toast-container');
  
  // Confetti Canvas Config
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  // --- State Variables ---
  let confettiActive = false;
  let confettiParticles = [];
  let celebrationInterval = null;

  // --- Dynamic Days Calculation ---
  // Start date: 15 de Mayo de 2026 (1 month before current local date: 15 de Junio de 2026)
  const anniversaryStart = new Date('2026-05-15T00:00:00');
  function updateDaysCounter() {
    const today = new Date();
    const diffTime = Math.abs(today - anniversaryStart);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    daysCounter.textContent = diffDays;
  }
  updateDaysCounter();

  // --- Ambient Background elements ---
  const symbols = ['☁️', '✨', '💙', '⭐', '🎈'];
  function spawnAmbientElements() {
    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div');
      element.className = 'ambient-element';
      element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = `${Math.random() * 100}vh`;
      element.style.fontSize = `${15 + Math.random() * 20}px`;
      element.style.animationDelay = `${Math.random() * -10}s`;
      element.style.animationDuration = `${8 + Math.random() * 8}s`;
      ambientContainer.appendChild(element);
    }
  }
  spawnAmbientElements();

  // --- Screen Navigation Helper ---
  function changeScreen(currentScreen, nextScreen) {
    currentScreen.classList.remove('active');
    setTimeout(() => {
      nextScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600); // Matches CSS transition delay
  }

  // ==========================================================================
  // SCREEN 1: OPEN GIFT
  // ==========================================================================
  btnOpenGift.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(100);
    
    // Add opened class to start 3D lid translation
    giftBox.classList.add('opened');
    btnOpenGift.disabled = true;
    
    setTimeout(() => {
      changeScreen(screenGift, screenMemories);
    }, 1200);
  });

  // ==========================================================================
  // SCREEN 2: VIEW MEMORIES
  // ==========================================================================
  btnOpenLetter.addEventListener('click', () => {
    changeScreen(screenMemories, screenLetter);
  });

  // ==========================================================================
  // SCREEN 3: OPEN OFFICIAL ENVELOPE & ROLLOUT RECEIPT
  // ==========================================================================
  function openEnvelope() {
    if (envelopeContainer.classList.contains('open')) return;

    if (navigator.vibrate) navigator.vibrate([50, 50]);

    // 1) Abre la solapa del sobre
    envelopeContainer.classList.add('open');

    // 2) Un pelín después, el ticket empieza a salir de dentro
    // setTimeout(() => {
    //   receiptPaper.classList.add('open');
    // }, 350);

    // 3) El sobre se aparta y el ticket queda colocado en la pantalla
    setTimeout(() => {
      envelopeContainer.classList.add('hidden');
      receiptPaper.classList.remove('open');
      receiptPaper.classList.add('centered');
    }, 2100);

    // 4) Los botones aparecen solo cuando el ticket ya está colocado
    setTimeout(() => {
      termsContainer.classList.add('visible');
      termsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2650);
  }

  envelopeContainer.addEventListener('click', openEnvelope);

  // ==========================================================================
  // SCREEN 5: TERMS & CONDITIONS - STATIC DECLINE BUTTON WITH ERROR TOASTS
  // ==========================================================================
  const errorMessages = [
    "Error 403: opción no disponible.",
    "Error 404: botón no encontrado.",
    "Lo sentimos, la cancelación no está incluida en tu plan.",
    "¡Acceso denegado! Tu corazón ya firmó permanencia indefinida. 🔒💙",
    "Error 502: ¡Demasiado amor detectado para cancelar!",
    "Alerta: Suscripción de novio premium no cancelable. 😊",
    "Acción inválida: Daniel Labrada no tiene permisos de baja.",
    "Cláusula de rescisión activa: 1000 millones de besos para continuar."
  ];

  function showRandomErrorToast() {
    const randomMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];

    // Borra avisos anteriores para que no se acumulen
    toastContainer.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'toast error-pop';
    toast.innerHTML = `
      <div class="error-icon">🚫</div>
      <div class="error-text">
        <strong>Solicitud rechazada</strong>
        <span>${randomMsg}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Animación graciosa del botón de NO
    btnDecline.classList.add('run-away');
    setTimeout(() => {
      btnDecline.classList.remove('run-away');
    }, 700);

    setTimeout(() => {
      toast.remove();
    }, 1700);
  }

  // Handle click on Decline button
  btnDecline.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add visual shake class to decline button on click
    btnDecline.classList.add('btn-shake');
    setTimeout(() => {
      btnDecline.classList.remove('btn-shake');
    }, 500);

    showRandomErrorToast();
    if (navigator.vibrate) navigator.vibrate(80);
  });

  // Add CSS shake keyframes dynamically if they don't exist
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.innerHTML = `
      .btn-shake {
        animation: nopeWiggle 0.55s ease;
      }
      @keyframes nopeWiggle {
        0% { transform: translateX(0) rotate(0deg); }
        20% { transform: translateX(-12px) rotate(-2deg); }
        40% { transform: translateX(12px) rotate(2deg); }
        60% { transform: translateX(-8px) rotate(-1deg); }
        80% { transform: translateX(8px) rotate(1deg); }
        100% { transform: translateX(0) rotate(0deg); }
      }
      .run-away {
        animation: runAway 0.7s ease both;
      }
      @keyframes runAway {
        0% { transform: translateX(0) rotate(0); }
        30% { transform: translateX(22px) rotate(2deg); }
        60% { transform: translateX(-18px) rotate(-2deg); }
        100% { transform: translateX(0) rotate(0); }
      }    `;
    document.head.appendChild(style);
  }

  // ==========================================================================
  // SCREEN 6: CELEBRATION (FINAL SCREEN)
  // ==========================================================================
  btnAccept.addEventListener('click', () => {
    changeScreen(screenLetter, screenCelebration);
    
    setTimeout(() => {
      startConfetti();
      startCelebrationIntervals();
    }, 600);
  });

  // --- Confetti Animation Logic ---
  const colors = [
    '#1D3557', // Navy
    '#457B9D', // Slate
    '#A2D2FF', // Sky
    '#BDE0FE', // Ice
    '#FFAFCC', // Pink Accent
    '#E5C158'  // Gold Accent
  ];

  class ConfettiParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.size = 6 + Math.random() * 8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = -2 + Math.random() * 4;
      this.speedY = 4 + Math.random() * 6;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = -4 + Math.random() * 8;
      this.shape = Math.random() > 0.45 ? 'rect' : 'circle';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.speedX += Math.sin(this.y / 30) * 0.05;
      
      if (this.y > canvas.height) {
        this.y = -20;
        this.x = Math.random() * canvas.width;
        this.speedY = 4 + Math.random() * 6;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  function startConfetti() {
    resizeCanvas();
    confettiActive = true;
    confettiParticles = [];
    
    for (let i = 0; i < 150; i++) {
      confettiParticles.push(new ConfettiParticle());
    }

    function animLoop() {
      if (!confettiActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confettiParticles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animLoop);
    }
    animLoop();
  }

  function stopConfetti() {
    confettiActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --- Celebration Floating Particle Spawns ---
  function spawnCelebrationParticle(isHeart = true) {
    const particle = document.createElement('div');
    particle.className = isHeart ? 'floating-heart' : 'floating-star';
    
    if (isHeart) {
      particle.innerHTML = `
        <svg viewBox="0 0 32 32" style="width: ${20 + Math.random() * 25}px; height: auto;">
          <path d="M16 28.5S2 16.8 2 9.5A7.5 7.5 0 0 1 16 6.1a7.5 7.5 0 0 1 14 3.4c0 7.3-14 19-14 19z" fill="${colors[Math.floor(Math.random() * colors.length)]}"/>
        </svg>
      `;
    } else {
      particle.innerHTML = `
        <svg viewBox="0 0 24 24" style="width: ${15 + Math.random() * 20}px; height: auto;">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#E5C158"/>
        </svg>
      `;
    }
    
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${3 + Math.random() * 3}s`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 6000);
  }

  function startCelebrationIntervals() {
    celebrationInterval = setInterval(() => {
      spawnCelebrationParticle(true);
      if (Math.random() > 0.5) spawnCelebrationParticle(false);
    }, 350);
  }

  function stopCelebrationIntervals() {
    if (celebrationInterval) clearInterval(celebrationInterval);
  }

  // ==========================================================================
  // RESET / RESTART FLOW
  // ==========================================================================
  btnRestart.addEventListener('click', () => {
    stopConfetti();
    stopCelebrationIntervals();
    
    // Clear all existing toasts
    toastContainer.innerHTML = '';
    
    // Reset Envelope container states
    envelopeContainer.classList.remove('open');
    envelopeContainer.classList.remove('hidden');
    receiptPaper.classList.remove('open');
    receiptPaper.classList.remove('centered');
    termsContainer.classList.remove('visible');
    
    // Re-enable gift box button and close its 3D lid
    giftBox.classList.remove('opened');
    btnOpenGift.disabled = false;
    
    // Go back to Screen 1
    changeScreen(screenCelebration, screenGift);
  });
});
