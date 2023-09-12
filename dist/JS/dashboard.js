document.addEventListener('DOMContentLoaded', function () {
	if (!localStorage.getItem('user')) {
		window.location.href = '/dist/client/login.html';
	}
});
