// Local Storage Helpers
function getContacts() {
	return JSON.parse(localStorage.getItem('contacts') || '[]');
}

function saveContacts(list) {
	localStorage.setItem('contacts', JSON.stringify(list));
}

// Load View Page
function loadContactDetails(index) {
	const contact = getContacts()[index];
	const contactDetails = document.getElementById('contact-details');
	contactDetails.innerHTML = `
    <header><strong>${contact.name}</strong></header>
    <p><i class="icon-phone"></i> <span>${contact.phone}</span></p>
    <p><i class="icon-envelope"></i> <span>${contact.email}</span></p>
  `;
}

// Setup Add/Edit Form
function setupForm(editIndex) {
	const title = document.getElementById('form-title');
	const deleteBtn = document.getElementById('delete-btn');

	if (editIndex !== null) {
		const contact = getContacts()[editIndex];
		title.textContent = 'Edit Contact';

		document.getElementById('name').value = contact.name;
		document.getElementById('phone').value = contact.phone;
		document.getElementById('email').value = contact.email;

		deleteBtn.style.display = 'block';
		deleteBtn.onclick = () => {
			showModal(`Are you sure you want to delete “${contact.name}”?`, () => {
				const contacts = getContacts();
				contacts.splice(editIndex, 1);
				saveContacts(contacts);
				location.href = 'index.html';
			});
		};
	}

	const form = document.getElementById('contact-form');
	const saveBtn = form.querySelector('button[type="submit"]');

	// --- Validation setup ---
	const inputs = [
		{ el: document.getElementById('name'), validator: val => val.length >= 2, message: 'Name must be at least 2 characters.' },
		{ el: document.getElementById('phone'), validator: val => /^\+?\d{6,15}$/.test(val), message: 'Phone must be digits only (6-15), optionally starting with +.' },
		{ el: document.getElementById('email'), validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), message: 'Please enter a valid email address.' },
	];

	// Real-time validation
	inputs.forEach(input => {
		input.el.addEventListener('input', () => validateField(input));
	});

	function validateField(inputObj) {
		const { el, validator, message } = inputObj;
		const errorEl = el.parentElement.querySelector('.error-msg');
		if (!validator(el.value.trim())) {
			el.classList.add('invalid');
			errorEl.textContent = message;
		} else {
			el.classList.remove('invalid');
			errorEl.textContent = '';
		}
		validateForm();
	}

	function validateForm() {
		const isValid = inputs.every(i => i.validator(i.el.value.trim()));
		saveBtn.disabled = !isValid;
	}

	// Initial validation
	validateForm();

	// On submit
	form.onsubmit = (e) => {
		e.preventDefault();
		if (inputs.some(i => !i.validator(i.el.value.trim()))) return;

		const contact = {
			name: document.getElementById('name').value.trim(),
			phone: document.getElementById('phone').value.trim(),
			email: document.getElementById('email').value.trim(),
		};

		const contacts = getContacts();
		if (editIndex !== null) contacts[editIndex] = contact;
		else contacts.push(contact);

		saveContacts(contacts);
		location.href = 'index.html';
	};
}

function loadContactsList() {
    const list = document.getElementById('contacts-list');
    const empty = document.getElementById('empty-message');
    const search = document.getElementById('search-input')?.value.toLowerCase() || "";
    let contacts = getContacts();

    list.innerHTML = '';

    // Filter contacts by search text
    contacts = contacts.filter(contact => contact.name.toLowerCase().includes(search));

    if (contacts.length === 0) {
        empty.style.display = 'block';
        return;
    } else {
        empty.style.display = 'none';
    }

    contacts.forEach((contact, index) => {
		const card = document.createElement('div');
		card.className = 'contact-card';
		card.innerHTML = `
			<p id="contact-name"><strong>${contact.name}</strong></p>
			<div class="contact-card-actions">
				<button class="icon-btn" data-action="view" aria-label="View contact"><i class="icon-eye"></i></button>
				<button class="icon-btn" data-action="edit" aria-label="Edit contact"><i class="icon-pencil"></i></button>
				<button class="icon-btn" data-action="delete" aria-label="Delete contact"><i class="icon-trash"></i></button>
			</div>
		`;

		const viewBtn = card.querySelector('[data-action="view"]');
		const editBtn = card.querySelector('[data-action="edit"]');
		const deleteBtn = card.querySelector('[data-action="delete"]');

		viewBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			location.href = `view.html?id=${index}`;
		});

		editBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			location.href = `form.html?edit=${index}`;
		});

		deleteBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteContact(index);
		});

		list.appendChild(card);
	});
}

// Pagination state
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

function loadContactsList() {
    const list = document.getElementById('contacts-list');
    const empty = document.getElementById('empty-message');
    const search = document.getElementById('search-input')?.value.toLowerCase() || "";
    let contacts = getContacts();

    list.innerHTML = '';

    // Filter by search
    contacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search)
    );

    // If nothing found
    if (contacts.length === 0) {
        empty.style.display = 'block';
        list.style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
        return;
    } else {
        empty.style.display = 'none';
    }

    // --- PAGINATION CALCULATIONS ---
    const totalItems = contacts.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedContacts = contacts.slice(start, start + ITEMS_PER_PAGE);

    // Render the paginated cards
    paginatedContacts.forEach((contact, index) => {
        const realIndex = start + index; // Correct index in full list

        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <p id="contact-name"><strong>${contact.name}</strong></p>
            <div class="contact-card-actions">
                <button class="icon-btn" data-action="view" aria-label="View contact"><i class="icon-eye"></i></button>
                <button class="icon-btn" data-action="edit" aria-label="Edit contact"><i class="icon-pencil"></i></button>
                <button class="icon-btn" data-action="delete" aria-label="Delete contact"><i class="icon-trash"></i></button>
            </div>
        `;

        const viewBtn = card.querySelector('[data-action="view"]');
        const editBtn = card.querySelector('[data-action="edit"]');
        const deleteBtn = card.querySelector('[data-action="delete"]');

        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            location.href = `view.html?id=${realIndex}`;
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            location.href = `form.html?edit=${realIndex}`;
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteContact(realIndex);
        });

        list.appendChild(card);
    });

    renderPagination(totalItems);
}

function deleteContact(index) {
  const contacts = getContacts();
  if (index < 0 || index >= contacts.length) return;

  showModal(`Are you sure you want to delete “${contacts[index].name}”?`, () => {
    contacts.splice(index, 1);
    saveContacts(contacts);
    loadContactsList();
  });
}


// --- Simple Modal Utility ---
let modalCallback = null;

function showModal(message, callback) {
  const modal = document.getElementById('confirm-modal');
  document.getElementById('modal-message').textContent = message;

  modalCallback = callback;
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('confirm-modal').style.display = 'none';
  modalCallback = null;
}

// Attach global handlers
document.addEventListener('DOMContentLoaded', () => {
  const cancelBtn = document.getElementById('modal-cancel');
  const confirmBtn = document.getElementById('modal-confirm');

  if (cancelBtn) cancelBtn.onclick = closeModal;

  if (confirmBtn)
    confirmBtn.onclick = () => {
      if (typeof modalCallback === 'function') modalCallback();
      closeModal();
    };
});

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Prev
    pagination.innerHTML += `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Prev</button>
    `;

    // Page Numbers
    for (let p = 1; p <= totalPages; p++) {
        pagination.innerHTML += `
            <button class="${p === currentPage ? 'active' : ''}" onclick="changePage(${p})">${p}</button>
        `;
    }

    // Next
    pagination.innerHTML += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>
    `;
}

function changePage(page) {
    currentPage = page;
    loadContactsList();
}
