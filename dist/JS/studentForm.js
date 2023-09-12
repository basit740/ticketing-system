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
