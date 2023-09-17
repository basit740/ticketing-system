const fileInput = document.getElementById('ticket-attachment');
const empFormEl = document.querySelector('form');
const customAlert = document.getElementById('customAlert');
const alertMessage = document.getElementById('alertMessage');

fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
	const file = event.target.files[0];
	const maxSize = 25 * 1024 * 1024; // 25MB in bytes

	if (file && file.size > maxSize) {
		showAlert('File size exceeds the maximum limit of 25MB.');
		fileInput.value = ''; // Clear the file input to allow the user to select another file.
	} else {
		// File size is within the limit, proceed with the upload.
		// You can implement the upload functionality here.
	}
}

function showAlert(message) {
	alertMessage.textContent = message;
	customAlert.classList.remove('hidden');
}

function closeAlert() {
	customAlert.classList.add('hidden');
}

empFormEl.addEventListener('submit', async function (event) {
	event.preventDefault();

	console.log('here i am');

	const inputFileEl = document.querySelector('#ticket-attachment');
	let employeeNumber = +localStorage.getItem('employeeNumber');
	const formData = new FormData();
	formData.append('ticketEmail', document.querySelector('#ticket-email').value);
	formData.append(
		'description',
		document.querySelector('#ticket-description').value
	);
	formData.append('subject', document.querySelector('#subject-issue').value);
	formData.append('employeeNumber', +employeeNumber);

	const attachedFile = inputFileEl.files[0];
	formData.append('file', attachedFile);

	try {
		const response = await fetch(apiUrl + '/tickets', {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('userToken'),
			},
		});
		debugger;
		const jsonResponse = await response.json();

		console.log({ jsonResponse });

		if (jsonResponse.success) {
			showAlert('ticket is created');
		} else {
			showAlert(jsonResponse.message);
		}
	} catch (err) {
		showAlert(err.message);
	}
});
