const btnLogin = document.querySelector('#btn-login');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const eyeIcon = document.getElementById("eye-icon");
const eyeSlashIcon = document.getElementById("eye-slash-icon");

eyeSlashIcon.addEventListener("click", () => {
        passwordInput.type = "text";
        eyeSlashIcon.classList.add("hidden");
        eyeIcon.classList.remove("hidden");
      });

eyeIcon.addEventListener("click", () => {
        passwordInput.type = "password";
        eyeIcon.classList.add("hidden");
        eyeSlashIcon.classList.remove("hidden");
      });


btnLogin.addEventListener('click', async () => {
	const password = passwordInput.value;
	const email = emailInput.value;

	if (!email || !password) {
		alert('Please enter your details');
		return;
	}

	const response = await fetch(apiUrl + '/auth/login', {
		method: 'POST',
		body: JSON.stringify({
			email,
			password,
		}),
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
	});
	const jsonResponse = await response.json();

	console.log('response', jsonResponse);

	// save intot localstorage
	localStorage.setItem('token', jsonResponse.token);
	localStorage.setItem('user', JSON.stringify(jsonResponse.user));
	window.location.href = '/dist/admin/dashboard.html';
});
