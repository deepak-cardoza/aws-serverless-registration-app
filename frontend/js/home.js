// Check if user is logged in
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token || !user.id) {
    window.location.href = 'login.html';
}

// Display user information
document.getElementById('userName').textContent = user.name || '-';
document.getElementById('userEmail').textContent = user.email || '-';
document.getElementById('userPhone').textContent = user.phone || '-';
document.getElementById('userDob').textContent = user.dateOfBirth || '-';
document.getElementById('userId').textContent = user.id || '-';

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});
