// All elements
const tiketDateEl = document.querySelector('#ticket-date');
const tiketCreatorNameEl = document.querySelector('#ticket-creator-name');
const tiketCreatorNumberEl = document.querySelector('#ticket-creator-number');
const studentSpecificEls = document.querySelectorAll('.student-specific');
const tiketCreatorBirthdateEl = document.querySelector(
	'#ticket-creator-birthdate'
);
const tiketCreatorDepartmentEl = document.querySelector(
	'#ticket-creator-department'
);
const tiketCreatorCourseEl = document.querySelector('#ticket-creator-course');
const tiketCreatorSectionEl = document.querySelector('#ticket-creator-section');
const tiketCreatorYearEl = document.querySelector('#ticket-creator-year');
const ticketNumberEl = document.querySelector('#ticket-number');
const userTypeEl = document.querySelector('#user-type');
document.addEventListener('DOMContentLoaded', () => {
	// Get the path of the current URL
	var path = window.location.pathname;
	console.log({ path });
	let ticket = null;
	ticket = JSON.parse(localStorage.getItem('studentTicket'));
	if (!ticket) {
		ticket = JSON.parse(localStorage.getItem('employeeTicket'));
	}

	if (ticket.studentId !== null) {
		// student ticket
		studentSpecificEls.forEach((el) => el.classList.remove('hidden'));
		userTypeEl.innerHTML = 'Student';
		tiketCreatorNameEl.innerHTML =
			ticket.Student.firstName + ' ' + ticket.Student.lastName;
		tiketCreatorNumberEl.innerHTML = ticket.Student.studentNumber;
		tiketCreatorBirthdateEl.innerHTML = ticket.Student.birthDate.split('T')[0];
		tiketCreatorDepartmentEl.innerHTML = ticket.Student.department;
		tiketCreatorCourseEl.innerHTML = ticket.Student.course;
		tiketCreatorSectionEl.innerHTML = ticket.Student.section;
		tiketCreatorYearEl.innerHTML = ticket.Student.yearLevel;
	} else {
		// employee ticket
		studentSpecificEls.forEach((el) => el.classList.add('hidden'));
		userTypeEl.innerHTML = 'Employee';
		tiketCreatorNameEl.innerHTML =
			ticket.Employee.firstName + ' ' + ticket.Employee.lastName;
		tiketCreatorNumberEl.innerHTML = ticket.Employee.employeeNumber;
		tiketCreatorBirthdateEl.innerHTML = ticket.Employee.birthDate.split('T')[0];
		tiketCreatorDepartmentEl.innerHTML = ticket.Employee.department;
	}
	tiketDateEl.innerHTML = ticket.createdAt.split('T')[0];
	ticketNumberEl.innerHTML = ticket.ticketNumber;
});
