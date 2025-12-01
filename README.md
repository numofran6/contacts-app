# Contacts Management App Documentation

## Overview
This project is a simple **Contacts Management App** that allows users to:
- View a list of contacts
- Add new contacts
- Edit existing contacts
- Delete contacts
- Search and paginate through contacts
- View detailed information for each contact

All data is stored in the browser's `localStorage`.

---

## File Structure

```
/project-root
│
├─ index.html         # Main page: displays contact list, search, and pagination
├─ form.html          # Add/Edit contact form
├─ view.html          # View single contact details
├─ styles.css         # Main stylesheet for the project
└─ main.js            # All JavaScript functionality
```

---

## HTML Files

### `index.html`
- Displays a list of contacts with **pagination**.
- Provides search input to filter contacts by name.
- Buttons for **Add**, **Edit**, **View**, and **Delete** actions.
- Includes a modal for confirmation of destructive actions.

### `form.html`
- Contains a form for **adding or editing a contact**.
- Includes **form validation** for name, phone, and email.
- Dynamically updates to "Edit Contact" if opened with `?edit=ID`.
- Includes a modal for confirming delete actions.

### `view.html`
- Displays detailed information of a single contact.
- Shows phone and email as **clickable links** (`tel:` and `mailto:`).
- Button to redirect to edit form.

---

## JavaScript (`main.js`)

### Storage Utilities
- `getContacts()`: Reads contacts from `localStorage`.
- `saveContacts(list)`: Saves contacts array to `localStorage`.

### Security
- `sanitize(text)`: Prevents HTML injection by escaping user input.

### Contact Management
- `setupForm(editIndex)`: Initializes the Add/Edit form and sets up validation and form submission.
- `loadContactDetails(index)`: Loads a single contact's information into the view page.
- `loadContactsList()`: Loads all contacts into the main list with pagination.
- `deleteContact(index)`: Deletes a contact after confirmation.

### Validation
- Validates name, phone, and email on input.
- Disables save button if validation fails.
- Prevents duplicates (same phone or email).

### Modals
- `showModal(message, callback)`: Opens a modal with a message and optional callback for confirm.
- `closeModal()`: Closes modal and clears callback.

### Pagination
- `renderPagination(totalItems)`: Dynamically renders pagination buttons.
- `changePage(page)`: Updates current page and reloads the contact list.

---

## Key Features
1. **Persistent storage** using `localStorage`.
2. **Input validation** and duplicate prevention.
3. **Dynamic search** on contact names.
4. **Pagination** for large lists.
5. **Click-to-call and click-to-email** links.
6. **Reusable modal** for delete confirmations.
7. **Responsive design** with mobile-first layout.

---

## Usage
1. Open `index.html` in a browser.
2. Add new contacts via "Add New Contact" button.
3. Edit or view a contact by clicking the respective icon.
4. Delete a contact via the trash icon with confirmation.
5. Use the search input to filter contacts.
6. Pagination is automatically generated if contacts exceed 5 per page.

