document
	.querySelector('#ticket-form')
	.addEventListener('submit', async function (event) {
		event.preventDefault();

		const inputFileEl = document.querySelector('#ticket-attachment');
		let studentNumber = +localStorage.getItem('studentNumber');
		const formData = new FormData();
		formData.append(
			'ticketEmail',
			document.querySelector('#ticket-email').value
		);
		formData.append(
			'description',
			document.querySelector('#ticket-description').value
		);
		formData.append('subject', document.querySelector('#subject-issue').value);
		formData.append('studentNumber', +studentNumber);

		const attachedFile = inputFileEl.files[0];
		formData.append('file', attachedFile);

		try {
			const response = await fetch(apiUrl + '/tickets', {
				method: 'POST',
				body: formData,
				headers: {
					// Accept: 'application/json',
					// 'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('userToken'),
				},
			});

			const jsonResponse = await response.json();

			console.log({ jsonResponse });

			if (jsonResponse.success) {
				alert('ticket is created');
			} else {
				alert(jsonResponse.message);
			}
		} catch (err) {
			alert('error creating ticket: ' + err.message);
		}
	});

document.addEventListener('DOMContentLoaded', function () {
	const student = JSON.parse(localStorage.getItem('student'));

	console.log(student);
	setStudentProfile(student);
});

function setStudentProfile(student) {
	document.querySelector('#student-name').innerHTML =
		student.firstName + ' ' + student.lastName;
	document.querySelector('#student-number').innerHTML = student.studentNumber;
	document.querySelector('#student-department').innerHTML = student.department;
	document.querySelector('#student-course').innerHTML = student.course;
	document.querySelector('#student-section').innerHTML = student.section;
	document.querySelector('#student-year-level').innerHTML = student.yearLevel;
}
