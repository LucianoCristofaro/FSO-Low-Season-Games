/* ==========================================================
   FSO Games · Jeopardy
   Edita CATEGORIES para cambiar categorías, preguntas y puntos.
   answer = índice (0-based) de la opción correcta.
   ========================================================== */
const CATEGORIES = [
  {
    name: 'Cultura de Empresa',
    questions: [
      {
        value: 100,
        question: '¿Qué valor cultural promueve el trabajo en equipo y el apoyo entre áreas?',
        options: ['Competencia individual', 'Colaboración', 'Aislamiento', 'Secretismo'],
        answer: 1
      },
      {
        value: 200,
        question: '¿Qué significa la sigla KPI?',
        options: ['Key Performance Indicator', 'Keep Pushing Ideas', 'Knowledge Process Integration', 'Known Project Issue'],
        answer: 0
      },
      {
        value: 300,
        question: '¿Cómo se llama la reunión breve y diaria para compartir avances y bloqueos del equipo?',
        options: ['Retrospectiva', 'Daily stand-up', 'Kick-off anual', 'Auditoría'],
        answer: 1
      }
    ]
  },
  {
    name: 'Tecnología y Datos',
    questions: [
      {
        value: 100,
        question: '¿Qué significa la sigla HTML?',
        options: ['HyperText Markup Language', 'High Tech Machine Language', 'Home Tool Markup Language', 'Hyperlink Text Mode Logic'],
        answer: 0
      },
      {
        value: 200,
        question: '¿Qué tipo de base de datos organiza la información en tablas relacionadas por filas y columnas?',
        options: ['NoSQL', 'Relacional', 'De grafos', 'Clave-valor'],
        answer: 1
      },
      {
        value: 300,
        question: '¿Qué término describe grandes volúmenes de datos variados que requieren herramientas especiales para procesarse?',
        options: ['Big Data', 'Cloud Native', 'Edge Computing', 'Blockchain'],
        answer: 0
      }
    ]
  },
  {
    name: 'Trivia General',
    questions: [
      {
        value: 100,
        question: '¿Cuál es el planeta más grande del Sistema Solar?',
        options: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'],
        answer: 1
      },
      {
        value: 200,
        question: '¿En qué año llegó el ser humano a la Luna por primera vez?',
        options: ['1959', '1969', '1972', '1979'],
        answer: 1
      },
      {
        value: 300,
        question: '¿Cuál es, tradicionalmente, el río más largo del mundo?',
        options: ['Amazonas', 'Nilo', 'Yangtsé', 'Misisipi'],
        answer: 1
      }
    ]
  }
];

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* ---------- Estado ---------- */
const state = {
  score: 0,
  used: new Set(),         // claves "catIndex-qIndex"
  current: null,           // { key, question, catName, answered }
};

/* ---------- Referencias DOM ---------- */
const $ = id => document.getElementById(id);
const dom = {
  board: $('board'),
  score: $('score'),
  qModal: $('question-modal'),
  qCategory: $('q-category'),
  qValue: $('q-value'),
  qText: $('q-text'),
  qOptions: $('q-options'),
  qFeedback: $('q-feedback'),
  revealBtn: $('reveal-btn'),
  closeBtn: $('close-btn'),
  endModal: $('end-modal'),
  finalScore: $('final-score'),
  restartBtn: $('restart-btn'),
  playAgainBtn: $('play-again-btn'),
};

/* ---------- Utilidades ---------- */
const totalQuestions = () => CATEGORIES.reduce((n, c) => n + c.questions.length, 0);

function getValues() {
  // Valores de fila ordenados (tomados de la primera categoría)
  return [...new Set(CATEGORIES.flatMap(c => c.questions.map(q => q.value)))].sort((a, b) => a - b);
}

function formatPoints(n) {
  return (n > 0 ? '+' : '') + n + ' pts';
}

function animateScore() {
  dom.score.classList.remove('bump', 'neg');
  void dom.score.offsetWidth; // reinicia animación
  dom.score.classList.add('bump');
  dom.score.classList.toggle('neg', state.score < 0);
  setTimeout(() => dom.score.classList.remove('bump'), 260);
}

function updateScore() {
  dom.score.textContent = state.score;
  dom.score.classList.toggle('neg', state.score < 0);
}

/* ---------- Tablero ---------- */
function renderBoard() {
  const values = getValues();
  dom.board.style.gridTemplateColumns = `repeat(${CATEGORIES.length}, minmax(0, 1fr))`;
  dom.board.innerHTML = '';

  // Cabeceras de categoría
  CATEGORIES.forEach(cat => {
    const h = document.createElement('div');
    h.className = 'category';
    h.textContent = cat.name;
    dom.board.appendChild(h);
  });

  // Filas de casillas: fila por valor
  values.forEach(value => {
    CATEGORIES.forEach((cat, catIndex) => {
      const qIndex = cat.questions.findIndex(q => q.value === value);
      const btn = document.createElement('button');
      btn.className = 'tile';
      btn.type = 'button';

      if (qIndex === -1) {
        btn.disabled = true;
      } else {
        const key = `${catIndex}-${qIndex}`;
        btn.textContent = value;
        btn.setAttribute('aria-label', `${cat.name}, ${value} puntos`);
        if (state.used.has(key)) {
          btn.disabled = true;
          btn.classList.add('used');
        }
        btn.addEventListener('click', () => openQuestion(catIndex, qIndex));
      }
      dom.board.appendChild(btn);
    });
  });
}

/* ---------- Modal de pregunta ---------- */
function openQuestion(catIndex, qIndex) {
  const cat = CATEGORIES[catIndex];
  const q = cat.questions[qIndex];
  const key = `${catIndex}-${qIndex}`;

  state.current = { key, question: q, catName: cat.name, answered: false };

  dom.qCategory.textContent = cat.name;
  dom.qValue.textContent = `${q.value} pts`;
  dom.qText.textContent = q.question;
  dom.qFeedback.textContent = 'Elige una opción o revela la respuesta.';
  dom.qFeedback.className = 'feedback neutral';

  dom.qOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'option';
    b.innerHTML = `<span class="option-letter">${LETTERS[i]}</span><span>${opt}</span>`;
    b.addEventListener('click', () => answer(i));
    dom.qOptions.appendChild(b);
  });

  dom.revealBtn.disabled = false;
  dom.qModal.classList.add('open');
  dom.closeBtn.focus();
}

function closeQuestion() {
  if (!state.current) return;
  state.used.add(state.current.key);
  dom.qModal.classList.remove('open');
  state.current = null;
  renderBoard();
  checkEnd();
}

function lockOptions() {
  dom.qOptions.querySelectorAll('.option').forEach(b => b.disabled = true);
}

function highlightCorrect() {
  const correct = state.current.question.answer;
  dom.qOptions.querySelectorAll('.option')[correct].classList.add('correct');
}

function answer(choice) {
  const cur = state.current;
  if (!cur || cur.answered) return;
  cur.answered = true;

  const { question } = cur;
  const buttons = dom.qOptions.querySelectorAll('.option');
  lockOptions();
  dom.revealBtn.disabled = true;

  if (choice === question.answer) {
    buttons[choice].classList.add('correct');
    state.score += question.value;
    dom.qFeedback.textContent = `¡Correcto! ${formatPoints(question.value)}`;
    dom.qFeedback.className = 'feedback ok';
  } else {
    buttons[choice].classList.add('wrong');
    highlightCorrect();
    state.score -= question.value;
    dom.qFeedback.textContent = `Incorrecto. ${formatPoints(-question.value)}`;
    dom.qFeedback.className = 'feedback bad';
  }
  updateScore();
  animateScore();
}

function reveal() {
  const cur = state.current;
  if (!cur || cur.answered) return;
  cur.answered = true;

  lockOptions();
  highlightCorrect();
  dom.revealBtn.disabled = true;
  dom.qFeedback.textContent = 'Respuesta revelada. 0 pts.';
  dom.qFeedback.className = 'feedback neutral';
}

/* ---------- Fin de juego ---------- */
function checkEnd() {
  if (state.used.size >= totalQuestions()) {
    dom.finalScore.textContent = state.score;
    dom.endModal.classList.add('open');
  }
}

function resetGame() {
  state.score = 0;
  state.used.clear();
  state.current = null;
  dom.endModal.classList.remove('open');
  dom.qModal.classList.remove('open');
  updateScore();
  renderBoard();
}

/* ---------- Eventos ---------- */
dom.revealBtn.addEventListener('click', reveal);
dom.closeBtn.addEventListener('click', closeQuestion);
dom.restartBtn.addEventListener('click', () => {
  if (confirm('¿Reiniciar la partida? Se perderá el marcador actual.')) resetGame();
});
dom.playAgainBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && dom.qModal.classList.contains('open')) closeQuestion();
});

/* ---------- Inicio ---------- */
renderBoard();
updateScore();
