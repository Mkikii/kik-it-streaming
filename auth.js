document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginFormContainer = document.getElementById('login-form');
    const registerFormContainer = document.getElementById('register-form');

    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginFormContainer.classList.remove('active');
        registerFormContainer.classList.add('active');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerFormContainer.classList.remove('active');
        loginFormContainer.classList.add('active');
    });

    // Original localStorage login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        localStorage.setItem('kik-it-authenticated', 'true');
        window.location.href = 'index.html';
    });

    // Original registration (demo only)
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Registration successful! Please login.');
        registerFormContainer.classList.remove('active');
        loginFormContainer.classList.add('active');
    });
});