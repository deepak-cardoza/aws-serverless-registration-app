// Navigation component
function createNavigation() {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    
    nav.innerHTML = `
        <div class="nav-container">
            <a href="index.html" class="nav-brand">AWS Serverless App</a>
            <div class="nav-links">
                <a href="index.html" class="nav-link">Home</a>
                ${isLoggedIn ? `
                    <a href="home.html" class="nav-link">Profile</a>
                    <a href="#" class="nav-link" id="navLogout">Logout</a>
                ` : `
                    <a href="login.html" class="nav-link">Login</a>
                    <a href="register.html" class="nav-link">Register</a>
                `}
            </div>
        </div>
    `;
    
    document.body.insertBefore(nav, document.body.firstChild);
    
    // Add logout handler if logged in
    if (isLoggedIn) {
        document.getElementById('navLogout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', createNavigation);
