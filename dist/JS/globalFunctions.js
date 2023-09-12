
//avater
window.onload = function () {
        const dropdownToggle = document.getElementById("dropdownToggle");
        const dropdownMenu = document.getElementById("dropdownMenu");

        dropdownToggle.addEventListener("click", function () {
          dropdownMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", function (event) {
          const targetElement = event.target;
          if (!targetElement.closest(".relative")) {
            dropdownMenu.classList.add("hidden");
          }
        });
      };



function checkRole() {
	let loggedInUser = JSON.parse(localStorage.getItem('user'));

	return loggedInUser.role;
}

function route2Users() {
	const role = checkRole();
	if (role === 'super_admin' || role === 'admin') {
		window.location.href = '/dist/admin/users.html';
	} else {
		return;
	}
}

function logout(event) {
	event.preventDefault();
	localStorage.clear();
	window.location.href = '/dist/admin/login.html';
}

function redirctToLogin() {
	if (!localStorage.getItem('user')) {
		window.location.href = '/dist/admin/login.html';
	}
}

document.addEventListener('DOMContentLoaded', function () {
	redirctToLogin();
});

// const userLink = document.querySelector('#link-users');
document
	.querySelector('#link-users')
	.addEventListener('click', function (event) {
		event.preventDefault();

		route2Users();
	});
