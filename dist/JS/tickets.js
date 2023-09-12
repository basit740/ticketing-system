const myTickets = [];

function filterTickets(category) {
	const activeTable = document.getElementById('ticket-table');
	const pickedUpTable = document.getElementById('picked-up-tickets-table');
	const activeRows = activeTable.querySelectorAll('.ticket-row');
	const pickedUpRows = pickedUpTable.querySelectorAll('.ticket-row');

	activeRows.forEach((row) => {
		const requestType = row.querySelector('.request-type').textContent;
		const isPickedUp = row.parentNode.id === 'picked-up-tickets-table';
		if (category === 'all' || requestType === category || isPickedUp) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});

	pickedUpRows.forEach((row) => {
		const requestType = row.querySelector('.request-type').textContent;
		const isPickedUp = row.parentNode.id === 'picked-up-tickets-table';
		if (category === 'all' || requestType === category || isPickedUp) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});

	const tablinks = document.querySelectorAll('.tablinks');
	tablinks.forEach((link) => {
		link.classList.remove('active');
	});
	document
		.querySelector('.tablinks[onclick="filterTickets(\'' + category + '\')"]')
		.classList.add('active');
}

function toggleMyTickets() {
	const toggleCheckbox = document.querySelector('.form-checkbox');
	const activeTable = document.getElementById('ticket-table');
	const pickedUpTable = document.getElementById('picked-up-tickets-table');

	if (toggleCheckbox.checked) {
		activeTable.style.display = 'none';
		pickedUpTable.style.display = 'table';
		filterTickets('all');
	} else {
		activeTable.style.display = 'table';
		pickedUpTable.style.display = 'none';
		filterTickets('all');
	}
}

function moveToPickedUp(button) {
	const row = button.parentNode.parentNode;
	const pickedUpTable = document
		.getElementById('picked-up-tickets-table')
		.querySelector('tbody');
	pickedUpTable.appendChild(row);
	button.textContent = 'Release';
	button.onclick = function () {
		moveToActive(this);
	};
}

function moveToActive(button) {
	const row = button.parentNode.parentNode;
	const activeTable = document
		.getElementById('ticket-table')
		.querySelector('tbody');
	activeTable.appendChild(row);
	button.textContent = 'Pick Up';
	button.onclick = function () {
		moveToPickedUp(this);
	};
}

function deleteTicket(button) {
	const row = button.parentNode.parentNode;
	row.remove();
}

function editTicket(button) {
	console.log('Edit ticket clicked');
}

function handleSearch() {
	const searchInput = document.getElementById('searchInput');
	const searchTerm = searchInput.value.toLowerCase();
	const activeTable = document.getElementById('ticket-table');
	const pickedUpTable = document.getElementById('picked-up-tickets-table');
	const allRows = activeTable.querySelectorAll('.ticket-row');
	const pickedUpRows = pickedUpTable.querySelectorAll('.ticket-row');

	allRows.forEach((row) => {
		const ticketData = row.textContent.toLowerCase();
		if (ticketData.includes(searchTerm)) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});

	pickedUpRows.forEach((row) => {
		const ticketData = row.textContent.toLowerCase();
		if (ticketData.includes(searchTerm)) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
}

function applyFilters() {
	const categoryDropdown = document.getElementById('filterDropdown2');
	const statusDropdown = document.getElementById('filterDropdown4');
	const priorityDropdown = document.getElementById('filterDropdown5');

	const selectedCategory = categoryDropdown.value;
	const selectedStatus = statusDropdown.value;
	const selectedPriority = priorityDropdown.value;

	const allRows = document.querySelectorAll('.ticket-row');

	allRows.forEach((row) => {
		const category = row.querySelector('.px-4.py-2:nth-child(5)').textContent;
		const status = row.querySelector('.status-badge').textContent;
		const priority = row.querySelector('.px-4.py-2:nth-child(9)').textContent;

		const categoryMatch =
			selectedCategory === 'all' || category === selectedCategory;
		const statusMatch = selectedStatus === 'all' || status === selectedStatus;
		const priorityMatch =
			selectedPriority === 'all' || priority === selectedPriority;

		if (categoryMatch && statusMatch && priorityMatch) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
}

// Update the applyFilters function
applyFilters();

// Add event listeners to the dropdowns
document
	.getElementById('filterDropdown2')
	.addEventListener('change', applyFilters);
document
	.getElementById('filterDropdown4')
	.addEventListener('change', applyFilters);
document
	.getElementById('filterDropdown5')
	.addEventListener('change', applyFilters);

function resetFilters() {
	document.getElementById('filterDropdown2').value = 'all';
	document.getElementById('filterDropdown4').value = 'all';
	document.getElementById('filterDropdown5').value = 'all';

	applyFilters();
}

// Add event listener to the Reset Filters button

// GLOBAL VARIABLES HERE
let allTickets = [];
let tbodyTicketRows = document.querySelector('#tbody-ticket-rows');

document
	.getElementById('resetFiltersButton')
	.addEventListener('click', resetFilters);

document.addEventListener('DOMContentLoaded', function () {
	// console.log('load all the tickts here');

	tbodyTicketRows.innerHTML = `<h1 style="color:green; text-align:center;">Loading....</h1>`;
	fetch(apiUrl + '/tickets')
		.then((response) => response.json())
		.then((data) => {
			allTickets = data.tickets;
			tbodyTicketRows.innerHTML = `<h1 style="color:green; text-align:center;">LOADED!</h1>`;

			formatRows(allTickets);
		});
});

function formatRows(tickets) {
	tbodyTicketRows.innerHTML = '';
	tickets.forEach((ticket) => {
		let row = document.createElement('tr');

		row.classList.add('ticket-row');

		row.classList.add('bg-white');
		row.classList.add('border-b');

		row.innerHTML = `

    <td class="px-4 py-2 text-sm">${ticket.ticketNumber}</td>
                    <td class="px-4 py-2 text-sm">${
											ticket.student ? ticket.student._id : ticket.employee._id
										}</td>
                    <td class="px-4 py-2 text-sm whitespace-nowrap">
                 
                      ${ticket.createdAt}
                    </td>
                    <td class="px-4 py-2 text-sm">${
											ticket.student
												? ticket.student.firstName
												: ticket.employee.firstName
										}</td>
                    <td class="px-4 py-2 text-sm">${ticket.subject}</td>
                    <td class="px-4 py-2 text-sm">
                      ${ticket.description}
                    </td>
                    <td class="px-4 py-2 text-sm request-type">${
											ticket.student ? 'Student' : 'Employee'
										}</td>
                    <td class="px-4 py-2 text-sm whitespace-nowrap">
                      <span
                        class="status-badge p-1.5 text-xs font-semibold tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">${
													ticket.status
												}</span>
                    </td>
                    <td class="px-4 py-2 text-sm">Normal</td>
                    <td class="px-4 py-2 text-sm">${
											ticket.assignedTo
												? assignedTo.firstName
												: 'Not Assigned yet!'
										}</td>
                    <td class="px-4 py-2 text-sm">
                      <button
                        class="bg-blue-950 h-8 w-full rounded-lg text-xs flex-none text-white font-medium items-center opacity-90 mt-3"
                        onclick="moveToPickedUp(this)">
                        Pick Up
                      </button>

                      <a href="ticket-Edit.html"
                        class="bg-yellow-500 h-8 w-full rounded-lg text-xs flex-none text-white font-medium p-4 flex text-center items-center opacity-90 mt-3"
                        onclick="editTicket(this)">
                        Edit
                      </a>
                      <button
                        class="bg-red-950 h-8 w-full rounded-lg text-xs flex-none text-white font-medium p-4 flex items-center opacity-90 mt-3"
                        onclick="deleteTicket(this)">
                        Delete
                      </button>
                    </td>
    `;

		tbodyTicketRows.appendChild(row);
	});
}

/*

<tr
                    class="ticket-row bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="px-4 py-2 text-sm">1</td>
                    <td class="px-4 py-2 text-sm">CUST-123</td>
                    <td class="px-4 py-2 text-sm whitespace-nowrap">
                      Jul 19, 2023, 2:30PM
                    </td>
                    <td class="px-4 py-2 text-sm">John Doe</td>
                    <td class="px-4 py-2 text-sm">Software</td>
                    <td class="px-4 py-2 text-sm">
                      Experiencing technical difficulties.
                    </td>
                    <td class="px-4 py-2 text-sm request-type">Student</td>
                    <td class="px-4 py-2 text-sm whitespace-nowrap">
                      <span
                        class="status-badge p-1.5 text-xs font-semibold tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">Waiting
                        For Support</span>
                    </td>
                    <td class="px-4 py-2 text-sm">Normal</td>
                    <td class="px-4 py-2 text-sm">Support Agent 1</td>
                    <td class="px-4 py-2 text-sm">
                      <button
                        class="bg-blue-950 h-8 w-full rounded-lg text-xs flex-none text-white font-medium items-center opacity-90 mt-3"
                        onclick="moveToPickedUp(this)">
                        Pick Up
                      </button>

                      <a href="ticket-Edit.html"
                        class="bg-yellow-500 h-8 w-full rounded-lg text-xs flex-none text-white font-medium p-4 flex text-center items-center opacity-90 mt-3"
                        onclick="editTicket(this)">
                        Edit
                      </a>
                      <button
                        class="bg-red-950 h-8 w-full rounded-lg text-xs flex-none text-white font-medium p-4 flex items-center opacity-90 mt-3"
                        onclick="deleteTicket(this)">
                        Delete
                      </button>
                    </td>
                  </tr>

*/
