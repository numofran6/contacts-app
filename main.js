/**
 * STORAGE UTILITIES
 */
function getContacts() {
    return JSON.parse(localStorage.getItem("contacts") || "[]");
}

function saveContacts(list) {
    localStorage.setItem("contacts", JSON.stringify(list));
}


/**
 * VIEW PAGE — LOAD INDIVIDUAL CONTACT
 */
function loadContactDetails(index) {
    const contact = getContacts()[index];
    const container = document.getElementById("contact-details");

    container.innerHTML = `
        <header><strong>${contact.name}</strong></header>
        <p><i class="icon-phone"></i> <span>${contact.phone}</span></p>
        <p><i class="icon-envelope"></i> <span>${contact.email}</span></p>
    `;
}


/**
 * CONTACT FORM (ADD / EDIT)
 */
function setupForm(editIndex) {
    const title = document.getElementById("form-title");
    const deleteBtn = document.getElementById("delete-btn");
    const form = document.getElementById("contact-form");
    const saveBtn = form.querySelector('button[type="submit"]');

    /**
     * Load Contact for Editing
     */
    if (editIndex !== null) {
        const contact = getContacts()[editIndex];
        title.textContent = "Edit Contact";

        document.getElementById("name").value = contact.name;
        document.getElementById("phone").value = contact.phone;
        document.getElementById("email").value = contact.email;

        deleteBtn.style.display = "block";
        deleteBtn.onclick = () =>
            showModal(`Are you sure you want to delete “${contact.name}”?`, () => {
                const contacts = getContacts();
                contacts.splice(editIndex, 1);
                saveContacts(contacts);
                location.href = "index.html";
            });
    }

    /**
     * Validation Setup
     */
    const inputs = [
        {
            el: document.getElementById("name"),
            validator: val => val.length >= 2,
            message: "Name must be at least 2 characters."
        },
        {
            el: document.getElementById("phone"),
            validator: val => /^\+?\d{6,15}$/.test(val),
            message: "Phone must be digits only (6–15), optionally starting with +."
        },
        {
            el: document.getElementById("email"),
            validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            message: "Please enter a valid email address."
        }
    ];

    inputs.forEach(inputObj =>
        inputObj.el.addEventListener("input", () => validateField(inputObj))
    );

    function validateField({ el, validator, message }) {
        const errorEl = el.parentElement.querySelector(".error-msg");
        const valid = validator(el.value.trim());

        el.classList.toggle("invalid", !valid);
        errorEl.textContent = valid ? "" : message;

        validateForm();
    }

    function validateForm() {
        const isValid = inputs.every(i => i.validator(i.el.value.trim()));
        saveBtn.disabled = !isValid;
    }

    validateForm();

    /**
     * Submit Handler
     */
    form.onsubmit = e => {
        e.preventDefault();
        if (inputs.some(i => !i.validator(i.el.value.trim()))) return;

        const newContact = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim()
        };

        const contacts = getContacts();
        if (editIndex !== null) contacts[editIndex] = newContact;
        else contacts.push(newContact);

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
    const search = (document.getElementById("search-input")?.value || "").toLowerCase();

    let contacts = getContacts().filter(contact =>
        contact.name.toLowerCase().includes(search)
    );

    list.innerHTML = "";

    if (contacts.length === 0) {
        empty.style.display = "block";
        list.style.display = "none";
        document.getElementById("pagination").style.display = "none";
        return;
    } else {
        empty.style.display = "none";
        list.style.display = "";
    }

    /**
     * Pagination Logic
     */
    const totalItems = contacts.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = contacts.slice(start, start + ITEMS_PER_PAGE);

    /**
     * Render Contact Cards
     */
    pageItems.forEach((contact, i) => {
        const realIndex = start + i;

        const card = document.createElement("div");
        card.className = "contact-card";
        card.innerHTML = `
            <p id="contact-name"><strong>${contact.name}</strong></p>
            <div class="contact-card-actions">
                <button class="icon-btn" data-action="view"><i class="icon-eye"></i></button>
                <button class="icon-btn" data-action="edit"><i class="icon-pencil"></i></button>
                <button class="icon-btn" data-action="delete"><i class="icon-trash"></i></button>
            </div>
        `;

        card.querySelector('[data-action="view"]').onclick = e => {
            e.stopPropagation();
            location.href = `view.html?id=${realIndex}`;
        };
        card.querySelector('[data-action="edit"]').onclick = e => {
            e.stopPropagation();
            location.href = `form.html?edit=${realIndex}`;
        };
        card.querySelector('[data-action="delete"]').onclick = e => {
            e.stopPropagation();
            deleteContact(realIndex);
        };

        list.appendChild(card);
    });

    renderPagination(totalItems);
}

function changePage(page) {
    currentPage = page;
    loadContactsList();
}


/**
 * DELETE CONTACT (Via Modal)
 */
function deleteContact(index) {
    const contacts = getContacts();
    if (!contacts[index]) return;

    showModal(`Are you sure you want to delete “${contacts[index].name}”?`, () => {
        contacts.splice(index, 1);
        saveContacts(contacts);
        loadContactsList();
    });
}


/**
 * MODAL UTILITIES
 */
let modalCallback = null;

function showModal(message, callback) {
    document.getElementById("modal-message").textContent = message;
    modalCallback = callback;
    document.getElementById("confirm-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("confirm-modal").style.display = "none";
    modalCallback = null;
}

/**
 * Attach modal button actions
 */
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
