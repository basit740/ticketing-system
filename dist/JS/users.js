// GLOBAL VARS
let users = [];
let tbodyUsersEl = document.querySelector('.tbody-users');
const modal = document.querySelector('#staticModal');
const btnCloseModalEl = document.querySelector('#btn-close-modal');

const btnToggleModalEl = document.querySelector('#btn-toggle-modal');
const btnAddUserEl = document.querySelector('#btn-add-user');

const fetchUsers = async () => {
	const response = await fetch(apiUrl + '/users', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('token'),
		},
	});

	const jsonResponse = await response.json();
	return jsonResponse;
};

const formatUsersHTML = (users) => {
	// Reset existig ones
	tbodyUsersEl.innerHTML = '';
	users.forEach((user) => {
		let tr = document.createElement('tr');

		tr.classList.add('bg-white');
		tr.classList.add('border-b');
		tr.classList.add('dark:bg-gray-800');
		tr.classList.add('dark:border-gray-700');
		tr.classList.add('hover:bg-gray-50');
		tr.classList.add('dark:hover:bg-gray-600');
		tr.classList.add('bg-white');
		tr.classList.add('bg-white');
		tr.innerHTML = `
		
			<td class="p-3 text-sm whitespace-nowrap">${user._id}</td>
			<td class="p-3 text-sm text-gray-700 whitespace-nowrap">
				${user.firstName} ${user.lastName}
			</td>
			<td class="p-3 text-sm text-gray-700 whitespace-nowrap">
				${user.email}
			</td>
			<td class="p-3 text-sm text-gray-700 whitespace-nowrap">
				${user.phone ? user.phone : '12345678'}
			</td>
			<td class="p-3 text-sm text-gray-700 whitespace-nowrap">
				${user.role}
			</td>
			<td class="p-3 text-sm text-gray-700 whitespace-nowrap">
				<span
					class="p-1.5 text-xs font-semibold tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">${
						user.status ? user.status : 'Online'
					}</span>
			</td>
			<td class="px-4 py-2 text-sm">
                      

                      <button
                        href=""
                        class="bg-yellow-400 h-8 w-full rounded-lg text-xs flex-none text-white font-medium p-4 flex text-center items-center opacity-90 mt-3"
                        onclick="editUser('${user._id}')"
                      >
                        Edit
                      </button>
                      <button
                        class="bg-red-950 h-8 w-full rounded-lg text-xs flex-none text-white font-medium p-4 flex items-center opacity-90 mt-3"
												onclick="deleteUser('${user._id}')"
                      >
                        Delete
                      </button>
                    </td>
	
`;

		tbodyUsersEl.appendChild(tr);
	});
};

async function addUser() {
	const staticModal = document.getElementById('staticModal');
	const firstName = document.querySelector('#first-name').value;
	const lastName = document.querySelector('#last-name').value;
	const email = document.querySelector('#email').value;
	const password = document.querySelector('#password').value;
	const phone = document.querySelector('#phone').value;
	const confirmPassword = document.querySelector('#confirm-password').value;
	const role = document.querySelector('#user-role').value;

	if (!firstName || !email || !role) {
		alert('Pelase enter required data');
		return;
	}

	const payload = {
		firstName,
		lastName,
		email,
		password,
		phone,
		role,
	};

	const response = await fetch(apiUrl + '/auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(payload),
	});
	const jsonResponse = await response.json();

	if (jsonResponse.success) {
		closeModal();
	}
}

const openModal = () => {
	modal.classList.remove('hidden');
	modal.classList.add('block');
};
const closeModal = () => {
	modal.classList.remove('block');
	modal.classList.add('hidden');
};

// MAIN FUNCTION HERE
document.addEventListener('DOMContentLoaded', async () => {
	const usersResponse = await fetchUsers();
	formatUsersHTML(usersResponse.users);

	btnToggleModalEl.addEventListener('click', function () {
		// alert('open moadl');

		const role = checkRole();
		if (role !== 'super_admin') {
			return true;
		} else {
			openModal();
		}
	});

	// close modal
	btnCloseModalEl.addEventListener('click', function () {
		closeModal();
	});

	btnAddUserEl.addEventListener('click', async () => {
		await addUser();
		const usersResponse = await fetchUsers();
		formatUsersHTML(usersResponse.users);
	});
});

function editUser(userId) {
	let role = checkRole();
	if (role !== 'super_admin') {
		return true;
	}
	alert('edit the user');
}
function deleteUser(userId) {
	let role = checkRole();
	if (role !== 'super_admin') {
		return true;
	}
	alert('delete the user');
}
