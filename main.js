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

	document.getElementById('contact-form').onsubmit = (e) => {
		e.preventDefault();
		const contact = {
			name: document.getElementById('name').value,
			phone: document.getElementById('phone').value,
			email: document.getElementById('email').value,
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
