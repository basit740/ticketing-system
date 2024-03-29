document.addEventListener('DOMContentLoaded', function () {
	const btnEmployeeValidate = document.querySelector('#btn-validate-employee');
	const btnStudentValidate = document.querySelector('#btn-validate-student');

	const studentNumberEl = document.querySelector('#input-std-number');
	const employeeNumberEl = document.querySelector('#input-emp-number');

	// birthdates
	const stdBirthDateEl = document.querySelector('#std-birth-date');
	const empBirthDateEl = document.querySelector('#emp-birth-date');

	// btnSudentValidate.addEventListener('click', function (event) {
	// 	//
	// 	alert(studentNumberEl.value);
	// });
	// btnEmployeeValidate.addEventListener('click', function (event) {
	// 	//
	// 	alert(employeeNumberEl.value);
	// });

	document
		.querySelector('#std-form')
		.addEventListener('submit', async function (event) {
			event.preventDefault();
			const result = await validateStd(
				studentNumberEl.value,
				stdBirthDateEl.value
			);
			if (result.success) {
				setToLocal(
					'student',
					studentNumberEl.value,
					result.token,
					result.student
				);
				window.location.href = '/dist/client/student_form.html';
			} else {
				console.log({ result });
				alert('error validing student');
			}
		});
	document
		.querySelector('#emp-form')
		.addEventListener('submit', async function (event) {
			event.preventDefault();
			const result = await validateEmp(
				employeeNumberEl.value,
				empBirthDateEl.value
			);
			if (result.success) {
				setToLocal(
					'employee',
					employeeNumberEl.value,
					result.token,
					result.employee
				);
				window.location.href = '/dist/client/employee_form.html';
			} else {
				alert('error validing emplyoee');
			}
		});
});

async function validateEmp(empNumber, birthDate) {
	const response = await fetch(apiUrl + '/employees/validate/' + empNumber, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			birthDate: birthDate.toString(),
		}),
	});
	const jsonResponse = await response.json();
	return jsonResponse;
}
async function validateStd(stdNumber, birthDate) {
	const response = await fetch(apiUrl + '/students/validate/' + stdNumber, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			birthDate: birthDate.toString(),
		}),
	});
	const jsonResponse = await response.json();
	console.log({ jsonResponse });
	return jsonResponse;
}

function setToLocal(userType, number, token, user) {
	localStorage.setItem('userToken', token);
	if (userType === 'student') {
		localStorage.removeItem('employeeNumber');
		localStorage.removeItem('employee');
		localStorage.setItem('student', JSON.stringify(user));
		localStorage.setItem('studentNumber', number);

		return;
	}
	localStorage.removeItem('studentNumber');
	localStorage.removeItem('student');
	localStorage.setItem('employeeNumber', number);
	localStorage.setItem('employee', JSON.stringify(user));
}
