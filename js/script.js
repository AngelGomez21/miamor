const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let baseFontSize = 18;
let fontSize = baseFontSize;
const date = "30/08/2020";
let phrase = "TEAMO";
let speed = 5;

let width, height, columns;
let dateColumns = [];
let phraseBlocks = [];
let particles = [];

function setup() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  fontSize = (width < 500) ? 24 : baseFontSize;
  columns = Math.floor(width / (fontSize * 1.5));
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textBaseline = "top";

  dateColumns = [];
  phraseBlocks = [];

  for (let i = 0; i < columns; i++) {
    if (Math.random() < 0.5) {
      dateColumns.push(createDateColumn(i));
    } else {
      phraseBlocks.push(createPhraseBlock(i));
    }
  }
}

function createDateColumn(i) {
  return {
    x: i * fontSize * 1.5,
    y: Math.random() * -height,
    speed: speed * (0.4 + Math.random() * 0.8),
    length: date.length
  };
}

function createPhraseBlock(i) {
  return {
    x: i * fontSize * 1.5,
    y: Math.random() * -height,
    speed: speed * 0.8
  };
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);

  // Fecha (sin estela, con centelleo)
  for (let col of dateColumns) {
    for (let j = 0; j < date.length; j++) {
      const char = date[j];
      const x = col.x;
      const y = col.y + j * fontSize;

      if (y > 0 && y < height) {
        if (Math.random() < 0.05) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 105, 180, 1)";
        }
        ctx.fillText(char, x, y);
      }
    }
    col.y += col.speed;
  }

  // TEAMO con estela
  for (let block of phraseBlocks) {
    for (let i = 0; i < phrase.length; i++) {
      const x = block.x + i * fontSize;
      const y = block.y;

      ctx.fillStyle = "rgba(255, 105, 180, 0.8)";
      ctx.fillText(phrase[i], x, y);

      for (let k = 1; k <= 5; k++) {
        const trailY = y - k * fontSize * 0.8;
        if (trailY > 0) {
          const alpha = 0.2 - k * 0.03;
          if (alpha > 0) {
            ctx.fillStyle = `rgba(255, 105, 180, ${alpha})`;
            ctx.fillText(phrase[i], x, trailY);
          }
        }
      }
    }
    block.y += block.speed;
  }

  // Eliminar columnas fuera de pantalla
  dateColumns = dateColumns.filter(col => col.y < height + col.length * fontSize);
  phraseBlocks = phraseBlocks.filter(block => block.y < height + fontSize * 2);

  // Generar nuevas columnas
  if (Math.random() < 0.3) {
    const i = Math.floor(Math.random() * columns);
    dateColumns.push(createDateColumn(i));
  }

  if (Math.random() < 0.1) {
    const i = Math.floor(Math.random() * columns);
    phraseBlocks.push(createPhraseBlock(i));
  }

  // Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 105, 180, ${p.alpha})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// Interacción con partículas al hacer clic
canvas.addEventListener("click", (e) => {
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      alpha: 1
    });
  }
});

// Control de velocidad
document.getElementById("speedRange").addEventListener("input", (e) => {
  speed = parseInt(e.target.value, 10);
  dateColumns.forEach(col => {
    col.speed = speed * (0.4 + Math.random() * 0.8);
  });
  phraseBlocks.forEach(block => {
    block.speed = speed * 0.8;
  });
});

// Cambio de frase
document.getElementById("phraseSelect").addEventListener("change", (e) => {
  phrase = e.target.value.toUpperCase();
  setup();
});

// Aquí forzamos que la velocidad inicie en el mínimo al cargar
document.getElementById("speedRange").value = document.getElementById("speedRange").min || 1;
speed = parseInt(document.getElementById("speedRange").value, 10);

setup();
setInterval(draw, 33);
window.addEventListener("resize", setup);
window.addEventListener("orientationchange", setup);

// -- NUEVO: Lógica del botón y formulario para mostrar/ocultar y validar --
const showFormBtn = document.getElementById('showFormBtn');
const formContainer = document.getElementById('formContainer');
const submitBtn = document.getElementById('submitBtn');
const fechaInput = document.getElementById('fecha');
const apodoInput = document.getElementById('apodo');
const citaInput = document.getElementById('cita');

// Mostrar formulario y ocultar botón
showFormBtn.addEventListener('click', () => {
  formContainer.classList.remove('hidden');
  showFormBtn.classList.add('hidden');
});

// Ocultar formulario y mostrar botón si clic afuera del formulario
document.addEventListener('click', (e) => {
  if (!formContainer.classList.contains('hidden')) {
    if (!formContainer.contains(e.target) && e.target !== showFormBtn) {
      formContainer.classList.add('hidden');
      showFormBtn.classList.remove('hidden');
    }
  }
});

// Validar y enviar al hacer click en Enviar
submitBtn.addEventListener('click', () => {
  const fecha = fechaInput.value.trim();
  const apodo = apodoInput.value.trim();
  const cita = citaInput.value.trim();

  const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  const mayusculasRegex = /^[A-Z\s]+$/;

  if (!fechaRegex.test(fecha)) {
    alert('Fecha inválida. Debe tener formato 00/00/0000.');
    return;
  }
  if (!mayusculasRegex.test(apodo)) {
    alert('El apodo debe estar en mayúsculas y sin caracteres especiales.');
    return;
  }
  if (!mayusculasRegex.test(cita)) {
    alert('La cita debe estar en mayúsculas y sin caracteres especiales.');
    return;
  }

  // Si pasa validación, redirigir a otra página (cambiar 'otra_pagina.html' si quieres)
  window.location.href = 'teamo2.html';
});
