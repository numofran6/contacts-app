/**
 * STORAGE UTILITIES
 */
function getContacts() {
    const raw = localStorage.getItem("contacts");
    try {
        return JSON.parse(raw) || [];
    } catch {
        return [];
    }
}

function saveContacts(list) {
    localStorage.setItem("contacts", JSON.stringify(list));
}


/**
 * SECURITY — SANITIZE USER INPUT TO PREVENT HTML INJECTION
 */
function sanitize(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


/**
 * SORT CONTACTS ALPHABETICALLY
 */
function getSortedContacts(search = "") {
    const query = search.toLowerCase();
    let contacts = getContacts()
        .filter(c => c.name.toLowerCase().includes(query))
        .sort((a, b) => a.name.localeCompare(b.name));

    const showFavoritesOnly = document.getElementById("show-favorites")?.checked;
    if (showFavoritesOnly) {
        contacts = contacts.filter(c => c.favorite);
    }

    return contacts;
}

document.getElementById("show-favorites")?.addEventListener("change", loadContactsList);

/**
 * VIEW SINGLE CONTACT PAGE
 */
function loadContactDetails(index) {
    const contacts = getContacts();
    const contact = contacts[index];
    const container = document.getElementById("contact-details");

    if (!contact) {
        container.innerHTML = "<p>Contact not found.</p>";
        return;
    }

    // Clean values used inside href attributes
    const safePhone = sanitize(contact.phone).replace(/[^0-9+]/g, ""); 
    const safeEmail = sanitize(contact.email);

    container.innerHTML = `
        <header><strong>${sanitize(contact.name)}</strong></header>

        <p>
            <i class="icon-phone"></i>
            <a href="tel:${safePhone}">
                ${sanitize(contact.phone)}
            </a>
        </p>

        <p>
            <i class="icon-envelope"></i>
            <a href="mailto:${safeEmail}">
                ${sanitize(contact.email)}
            </a>
        </p>
    `;
}



/**
 * CONTACT FORM (ADD / EDIT)
 */
function setupForm(editIndex) {
    const form = document.getElementById("contact-form");
    const deleteBtn = document.getElementById("delete-btn");
    const title = document.getElementById("form-title");
    const saveBtn = form.querySelector('button[type="submit"]');

    let editingContact = null;

    if (editIndex !== null) {
        const contacts = getContacts();
        editingContact = contacts[editIndex];

        title.textContent = "Edit Contact";

        document.getElementById("name").value = editingContact.name;
        document.getElementById("phone").value = editingContact.phone;
        document.getElementById("email").value = editingContact.email;

        deleteBtn.style.display = "block";
        deleteBtn.onclick = () => {
            showModal(`Delete "${editingContact.name}"?`, () => {
                contacts.splice(editIndex, 1);
                saveContacts(contacts);
                location.href = "index.html";
            });
        };
    }

    /**
     * VALIDATION RULES
     */
    const fields = [
        {
            element: document.getElementById("name"),
            validate: v => /^[A-Za-z\s]{2,50}$/.test(v),
            message: "Name must contain only letters and spaces (2–50 chars)."
        },
        {
            element: document.getElementById("phone"),
            validate: v => /^\+?\d[\d\s]{5,14}$/.test(v),
            message: "Phone must be 6–15 digits, spaces allowed."
        },
        {
            element: document.getElementById("email"),
            validate: v =>
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v),
            message: "Invalid email format."
        }
    ];

    fields.forEach(f => {
        f.element.addEventListener("input", () => validateField(f));
    });

    function validateField({ element, validate, message }) {
        const error = element.parentElement.querySelector(".error-msg");
        const value = element.value.trim();
        const valid = validate(value);

        element.classList.toggle("invalid", !valid);
        error.textContent = valid ? "" : message;

        validateForm();
    }

    function validateForm() {
        const valid = fields.every(f => f.validate(f.element.value.trim()));
        saveBtn.disabled = !valid;
    }

    validateForm();


    /**
     * FORM SUBMISSION
     */
    form.onsubmit = event => {
        event.preventDefault();
        if (saveBtn.disabled) return;

        const newContact = {
            name: sanitize(document.getElementById("name").value.trim()),
            phone: sanitize(document.getElementById("phone").value.trim()),
            email: sanitize(document.getElementById("email").value.trim()),
            favorite: editingContact ? editingContact.favorite : false,
        };

        const contacts = getContacts();

        // Prevent duplicates
        const duplicate = contacts.some(
            (contact, index) =>
                index !== parseInt(editIndex) &&
                (contact.email === newContact.email || contact.phone === newContact.phone)
        );

        if (duplicate) {
            showModal("A contact with this email or phone already exists.");
            return;
        }

        if (editIndex !== null) {
            contacts[editIndex] = newContact;
        } else {
            contacts.push(newContact);
        }

        saveContacts(contacts);
        location.href = "index.html";
    };
}


/**
 * CONTACT LIST + PAGINATION
 */
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

function loadContactsList() {
    const list = document.getElementById("contacts-list");
    const empty = document.getElementById("empty-message");
    const searchInput = document.getElementById("search-input");
    const search = searchInput ? searchInput.value : "";

    const contacts = getSortedContacts(search);

    list.innerHTML = "";

    if (contacts.length === 0) {
        empty.style.display = "block";
        list.style.display = "none";
        document.getElementById("pagination").style.display = "none";
        return;
    }

    empty.style.display = "none";
    list.style.display = "block";

    const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = contacts.slice(start, start + ITEMS_PER_PAGE);

    pageItems.forEach((contact, offset) => {
        const actualIndex = start + offset;

        const card = document.createElement("div");
        card.className = "contact-card";
        card.innerHTML = `
            <p id="contact-name"><strong>${sanitize(contact.name)}</strong></p>
            <div class="contact-card-actions">
                <button class="icon-btn" data-action="view"><i class="icon-eye"></i></button>
                <button class="icon-btn" data-action="edit"><i class="icon-pencil"></i></button>
                <button class="icon-btn" data-action="delete"><i class="icon-trash"></i></button>
                <button class="icon-btn favorite-btn" data-action="favorite">
                    <i class="${contact.favorite ? 'icon-star-filled' : 'icon-star'}"></i>
                </button>
            </div>
        `;

        card.querySelector('[data-action="view"]').onclick = () =>
            (location.href = `view.html?id=${actualIndex}`);

        card.querySelector('[data-action="edit"]').onclick = () =>
            (location.href = `form.html?edit=${actualIndex}`);

        card.querySelector('[data-action="delete"]').onclick = () =>
            deleteContact(actualIndex);

        card.querySelector('[data-action="favorite"]').onclick = () => {
            contact.favorite = !contact.favorite;
            saveContacts(contacts);
            loadContactsList();
        };

        list.appendChild(card);
    });

    renderPagination(contacts.length);
}


function changePage(page) {
    currentPage = page;
    loadContactsList();
}


/**
 * DELETE CONTACT
 */
function deleteContact(index) {
    const contacts = getContacts();
    if (!contacts[index]) return;

    showModal(`Delete "${contacts[index].name}"?`, () => {
        contacts.splice(index, 1);
        saveContacts(contacts);
        loadContactsList();
    });
}


/**
 * MODAL UTILITIES
 */
let modalCallback = null;

function showModal(message, callback = null) {
    document.getElementById("modal-message").textContent = message;
    modalCallback = callback;
    document.getElementById("confirm-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("confirm-modal").style.display = "none";
    modalCallback = null;
}

document.addEventListener("DOMContentLoaded", () => {
    const cancel = document.getElementById("modal-cancel");
    const confirm = document.getElementById("modal-confirm");

    if (cancel) cancel.onclick = closeModal;

    if (confirm)
        confirm.onclick = () => {
            if (typeof modalCallback === "function") modalCallback();
            closeModal();
        };
});


/**
 * PAGINATION RENDERING
 */
function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    pagination.innerHTML += `
        <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">Prev</button>
    `;

    for (let p = 1; p <= totalPages; p++) {
        pagination.innerHTML += `
            <button class="${p === currentPage ? "active" : ""}" onclick="changePage(${p})">${p}</button>
        `;
    }

    pagination.innerHTML += `
        <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">Next</button>
    `;
}
