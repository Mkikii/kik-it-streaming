const apiKey = 'YOUR_TMDB_API_KEY'; // replace with your real TMDB API key
const carousel = document.getElementById('movie-carousel');
const apiURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    data.results.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'image-card';
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <div class="images-info">
          <h3>${movie.title}</h3>
          <p>${movie.overview.slice(0, 60)}...</p>
        </div>
      `;
      carousel.appendChild(card);
    });
  })
  .catch(err => console.error('Error fetching movies:', err));
