const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const contentArea = document.getElementById('contentArea');

if (token && user.name) {
    // User is logged in - show welcome message
    contentArea.innerHTML = `
        <div style="text-align: center;">
            <h2 style="color: #333; margin-bottom: 15px;">Welcome, ${user.name}!</h2>
            <p style="color: #666; margin-bottom: 25px;">You are logged in</p>
            <a href="home.html" style="text-decoration: none;">
                <button class="btn">Go to Profile</button>
            </a>
        </div>
    `;
} else {
    // User is not logged in - show login/register buttons
    contentArea.innerHTML = `
        <div style="display: flex; gap: 15px; flex-direction: column;">
            <a href="login.html" style="text-decoration: none;">
                <button class="btn">Login</button>
            </a>
            <a href="register.html" style="text-decoration: none;">
                <button class="btn" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">Register</button>
            </a>
        </div>
    `;
}
