const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const alertBox = document.getElementById('alertBox');

function showAlert(message, type) {
    alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        alertBox.innerHTML = '';
    }, 5000);
}

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.innerHTML = isLoading ? '<span class="loading"></span>' : 'Login';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    setLoading(true);

    try {
        const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
            formData
        );

        showAlert(response.data.message || 'Login successful!', 'success');
        
        // Store token and user data
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        showAlert(message, 'error');
    } finally {
        setLoading(false);
    }
});
