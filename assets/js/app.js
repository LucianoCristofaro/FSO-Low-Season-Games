/* Catálogo de juegos: agrega o cambia el estado aquí.
   status: 'available' | 'soon'                                 */
const GAMES = [
  {
    id: 'jeopardy',
    title: 'Jeopardy',
    description: 'Elige categorías y puntos. Responde bien y suma; falla y resta.',
    status: 'available',
    url: 'games/jeopardy/index.html',
    icon: '🎯'
  },
  { id: 'quiz-relampago', title: 'Quiz Relámpago', description: 'Preguntas rápidas contra el reloj.', status: 'soon', url: 'games/quiz-relampago/', icon: '⚡' },
  { id: 'memorama', title: 'Memorama', description: 'Encuentra los pares y pon a prueba tu memoria.', status: 'soon', url: 'games/memorama/', icon: '🃏' },
  { id: 'ahorcado', title: 'Ahorcado', description: 'Adivina la palabra técnica antes de quedarte sin intentos.', status: 'soon', url: 'games/ahorcado/', icon: '🔤' },
  { id: 'sopa-letras', title: 'Sopa de Letras', description: 'Encuentra términos de la empresa entre las letras.', status: 'soon', url: 'games/sopa-letras/', icon: '🔍' },
  { id: 'ruleta', title: 'Ruleta Corporativa', description: 'Gira la ruleta y responde el reto que te toque.', status: 'soon', url: 'games/ruleta/', icon: '🎡' },
  { id: 'trivia-parejas', title: 'Trivia en Parejas', description: 'Competencia colaborativa por equipos.', status: 'soon', url: 'games/trivia-parejas/', icon: '👥' },
  { id: 'escape-room', title: 'Escape Room', description: 'Resuelve acertijos para "escapar" de la oficina.', status: 'soon', url: 'games/escape-room/', icon: '🔐' },
  { id: 'puzzle-logico', title: 'Puzzle Lógico', description: 'Desafíos de lógica y pensamiento crítico.', status: 'soon', url: 'games/puzzle-logico/', icon: '🧩' },
  { id: 'quien-sabe-mas', title: '¿Quién Sabe Más?', description: 'Duelo de conocimiento entre compañeros.', status: 'soon', url: 'games/quien-sabe-mas/', icon: '🏆' }
];

(function renderMenu() {
  const grid = document.getElementById('games-grid');
  grid.innerHTML = GAMES.map(game => {
    const available = game.status === 'available';
    const badge = available
      ? '<span class="badge badge-available">Disponible</span>'
      : '<span class="badge badge-soon">Próximamente</span>';

    const content = `
      <div class="card-icon" aria-hidden="true">${game.icon}</div>
      <h2 class="card-title">${game.title}</h2>
      <p class="card-desc">${game.description}</p>
      <div class="card-footer">${badge}</div>`;

    return available
      ? `<a class="game-card" href="${game.url}" aria-label="Jugar ${game.title}">${content}</a>`
      : `<article class="game-card is-disabled" aria-disabled="true">${content}</article>`;
  }).join('');
})();
