const movies = [
    { title: "Flower of Evil", image: "images/flower of evil.png" },
    { title: "Hidden Love", image: "images/hidden love.png" },
    { title: "Brave Citizen", image: "images/brave citizen.png" },
    { title: "Princess Silver", image: "images/princess silver.png" },
    { title: "Resident Playbook", image: "images/resident playbook.png" },
    { title: "Love Next Door", image: "images/love next door.png" }
];

// Carousel Animation Variables
let scrollInterval;
let scrollDirection = 1; // 1 for right, -1 for left
const scrollSpeed = 1;
const scrollDelay = 30;

document.addEventListener('DOMContentLoaded', function() {
    // Authentication Check
    if (!localStorage.getItem('kik-it-authenticated')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize Components
    initCarousel();
    initButtons();
    initVideos();
});

function initCarousel() {
    const carousel = document.getElementById('movie-carousel');
    if (!carousel) return;

    // Clear existing content
    carousel.innerHTML = '';

    // Create Movie Items
    movies.forEach((movie, index) => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-item';
        movieElement.style.backgroundImage = `url('${movie.image}')`;
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = movie.title;
        titleElement.style.color = 'black';
        titleElement.style.textShadow = '0 1px 3px rgba(255,255,255,0.8)';
        
        movieElement.appendChild(titleElement);
        movieElement.style.animationDelay = `${index * 0.15}s`;
        
        // Hover Effects
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

    // Start Auto-Scroll
    startAutoScroll(carousel);

    // Pause on Hover
    carousel.addEventListener('mouseenter', () => clearInterval(scrollInterval));
    carousel.addEventListener('mouseleave', () => startAutoScroll(carousel));
}

function startAutoScroll(carousel) {
    clearInterval(scrollInterval); // Clear any existing interval
    
    scrollInterval = setInterval(() => {
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1) {
            // Reached end - scroll back to start
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (carousel.scrollLeft <= 0) {
            // Reached start - scroll forward
            carousel.scrollBy({ left: scrollSpeed, behavior: 'smooth' });
        } else {
            // Normal scrolling
            carousel.scrollBy({ left: scrollSpeed * scrollDirection, behavior: 'smooth' });
        }
    }, scrollDelay);
}

function initButtons() {
    const playButton = document.querySelector('.play');
    const listButton = document.querySelector('.add-to-list');
    const logoutBtn = document.getElementById('logoutBtn');

    if (playButton) {
        playButton.addEventListener('click', function() {
            alert("Now playing my selected show - enjoy!");
        });
    }

    if (listButton) {
        listButton.addEventListener('click', function() {
            alert("Added to my personal watchlist!");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('kik-it-authenticated');
            window.location.href = 'login.html';
        });
    }
}

function initVideos() {
    const videos = document.querySelectorAll('video');
    if (!videos) return;

    videos.forEach(video => {
        // Error Handling
        video.addEventListener('error', function() {
            console.error('Video error:', this.error);
        });
        
        // Hover Play/Pause
        video.addEventListener('mouseenter', function() {
            this.play().catch(e => console.log('Autoplay prevented:', e));
        });
        
        video.addEventListener('mouseleave', function() {
            this.pause();
            this.currentTime = 0;
        });
    });
}

// Handle Tab Visibility Changes
document.addEventListener('visibilitychange', () => {
    const carousel = document.getElementById('movie-carousel');
    if (!carousel) return;

    if (document.visibilityState === 'visible') {
        startAutoScroll(carousel);
    } else {
        clearInterval(scrollInterval);
    }
});