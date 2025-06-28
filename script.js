document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!localStorage.getItem('kik-it-authenticated')) {
        window.location.href = 'login.html';
        return;
    }

    const apiKey = '1a696a0189feb9a2da936486dab0fbd0';
    const carousel = document.getElementById('movie-carousel');
    const searchInput = document.querySelector('.search input');
    const searchButton = document.querySelector('.search button');
    const playButton = document.querySelector('.play');
    const listButton = document.querySelector('.add-to-list');
    const logoutBtn = document.getElementById('logoutBtn');

    // Local movies data
    const localMovies = [
        { title: "Flower of Evil", image: "images/flower of evil.png" },
        { title: "Hidden Love", image: "images/hidden love.png" },
        { title: "Brave Citizen", image: "images/brave citizen.png" },
        { title: "Princess Silver", image: "images/princess silver.png" },
        { title: "Resident Playbook", image: "images/resident playbook.png" },
        { title: "Love Next Door", image: "images/love next door.png" }
    ];

    // Prevent default behavior if button is inside a form
    if (searchButton) {
        searchButton.setAttribute('type', 'button');
    }

    // Initial load - show local movies by default
    displayLocalMovies();

    // Search button click
    searchButton?.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (!query) {
            displayLocalMovies();
            return;
        }

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                if (data.results.length === 0) {
                    carousel.innerHTML = `<p style="color: orange;">No results found for "${query}". Showing local movies instead.</p>`;
                    displayLocalMovies();
                } else {
                    displayTrailers(data.results);
                }
            })
            .catch(err => {
                showError('Search failed', err);
                displayLocalMovies();
            });
    });

    // Enter key triggers search
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchButton.click();
        }
    });

    // Display TMDB trailers
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

    // Display local movies
    function displayLocalMovies() {
        if (!carousel) return;
        
        carousel.innerHTML = '';
        localMovies.forEach((movie, index) => {
            const movieElement = document.createElement('div');
            movieElement.className = 'movie-item';
            movieElement.style.backgroundImage = `url('${movie.image}')`;
            
            const titleElement = document.createElement('h3');
            titleElement.textContent = movie.title;
            titleElement.style.color = 'black';
            titleElement.style.textShadow = '0 1px 3px rgba(255,255,255,0.8)';
            
            movieElement.appendChild(titleElement);
            movieElement.style.animationDelay = `${index * 0.15}s`;
            
            movieElement.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.08)';
                this.style.boxShadow = '0 10px 20px rgba(202, 4, 31, 0.5)';
            });
            
            movieElement.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
            
            carousel.appendChild(movieElement);
        });

        let scrollPos = 0;
        function autoScroll() {
            scrollPos += 0.7;
            if (scrollPos >= carousel.scrollWidth - carousel.clientWidth) {
                scrollPos = 0;
            }
            carousel.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
            requestAnimationFrame(autoScroll);
        }
        setTimeout(autoScroll, 2500);
    }

    // Error display
    function showError(message, error) {
        console.error(message, error);
        carousel.innerHTML = `<p style="color: red;">${message}. Showing local movies instead.</p>`;
    }

    // Play button
    playButton?.addEventListener('click', function() {
        alert("Now playing my selected show - enjoy!");
    });

    // Add to list button
    listButton?.addEventListener('click', function() {
        alert("Added to my personal watchlist!");
    });

    // Logout button
    logoutBtn?.addEventListener('click', function() {
        localStorage.removeItem('kik-it-authenticated');
        window.location.href = 'login.html';
    });

    // Video hover effects
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.error('Video error:', this.error);
            alert('Error loading video. Please check console for details.');
        });
        
        video.addEventListener('mouseenter', function() {
            this.play().catch(e => console.log('Autoplay prevented:', e));
        });
        
        video.addEventListener('mouseleave', function() {
            this.pause();
            this.currentTime = 0;
        });
    });
});