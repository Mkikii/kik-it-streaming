document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '1a696a0189feb9a2da936486dab0fbd0';
  const carousel = document.getElementById('movie-carousel');
  const searchInput = document.querySelector('.search input');
  const searchButton = document.querySelector('.search button');
  const logoutBtn = document.getElementById('logoutBtn');

  // Prevent default behavior if button is inside a form
  if (searchButton) {
    searchButton.setAttribute('type', 'button');
  }

  // Load popular trailers on page load
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US`)
    .then(res => res.json())
    .then(data => displayTrailers(data.results))
    .catch(err => showError('Could not load popular movies', err));

  // Search button click
  searchButton?.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.results.length === 0) {
          carousel.innerHTML = `<p style="color: orange;">No results found for "${query}".</p>`;
        } else {
          displayTrailers(data.results);
        }
      })
      .catch(err => showError('Search failed', err));
  });

  // Enter key triggers search
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchButton.click();
    }
  });

  // Display trailers
  function displayTrailers(movies) {
    carousel.innerHTML = '';
    movies.forEach(movie => {
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`)
        .then(res => res.json())
        .then(videoData => {
          const trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          if (trailer) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col items-center gap-2';

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            iframe.width = '320';
            iframe.height = '180';
            iframe.allowFullscreen = true;
            iframe.className = 'rounded-lg shadow-md';

            const title = document.createElement('p');
            title.textContent = movie.title;
            title.className = 'text-white text-sm';

            wrapper.appendChild(iframe);
            wrapper.appendChild(title);
            carousel.appendChild(wrapper);
          }
        })
        .catch(err => console.error(`Trailer fetch failed for ${movie.title}:`, err));
    });
  }

  // Error display
  function showError(message, error) {
    console.error(message, error);
    carousel.innerHTML = `<p style="color: red;">${message}. Please try again later.</p>`;
  }

  // Logout button
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('kik-it-authenticated');
    window.location.href = 'login.html';
  });
});
