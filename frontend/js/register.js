const form = document.getElementById('registerForm');
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
    btnText.innerHTML = isLoading ? '<span class="loading"></span>' : 'Register';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        password: document.getElementById('password').value
    };

    setLoading(true);

    try {
        const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
            formData
        );

        showAlert(response.data.message || 'Registration successful!', 'success');
        form.reset();
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        showAlert(message, 'error');
    } finally {
        setLoading(false);
    }
});
