# 📘 Contacts Management App — End User Documentation

## 1. Introduction

### 1.1 Product Overview
The **Contacts Management App** is a lightweight, web application that allows users to create, store, manage, and organize personal or professional contact information.  
The application uses the browser’s **localStorage** to securely store data on the user’s device without requiring a server or external database.

It is designed to be simple, intuitive, and accessible on both desktop and mobile devices.

---

### 1.2 Purpose of the Application
The purpose of this app is to provide users with an easy way to:

- Store important contacts  
- Add phone numbers, email addresses, and profile photos  
- View and edit contact details  
- Search and sort contacts  
- Mark favorites  
- Paginate through large contact lists  

This tool is ideal for users needing a quick, offline contact book accessible anywhere via a browser.

---

### 1.3 Intended Audience
This documentation is intended for:

- End users who want to manage their contacts  
- Beginners needing simple contact management software  
- Students and developers exploring localStorage-based applications  
- Non-technical users who prefer intuitive, user-friendly tools  

---

### 1.4 System Requirements

#### Supported Devices
- Desktop computers (Windows, macOS, Linux)  
- Smartphones (Android, iOS)  
- Tablets  

#### Supported Browsers  
Any modern browser supporting localStorage and ES6 JavaScript:

- Google Chrome (recommended)  
- Firefox  
- Safari  
- Edge  
- Opera  

#### Minimum Browser Requirements
- JavaScript enabled  
- localStorage enabled  
- Ability to load local files (if running offline)  

---

### 1.5 Installation & Setup

#### Option A – Open from Local Files
1. Download the project folder  
2. Open **index.html** in any modern browser  

#### Option B – Host on a Web Server (Recommended)
1. Upload the project folder to any hosting server or local server (XAMPP, WAMP, nginx, etc.)  
2. Access the app via your server’s URL  

---

### 1.6 Key Terms

| Term          | Meaning |
|---------------|---------|
| **Contact**   | A saved entry containing name, phone, email, avatar, and favorite flag |
| **Favorite**  | A contact manually marked with a star icon |
| **localStorage** | Browser storage system used to save contact data persistently |
| **Modal**     | Popup window for confirmations/alerts |
| **Pagination** | Navigation between pages of a long contact list |
| **A–Z Sorting** | Alphabetical ordering of contacts |

---

## 2. Getting Started

### 2.1 Launching the App
- Open **index.html** in your browser  
- You will immediately see the Contacts List page  

---

### 2.2 Initial Empty State
If no contacts exist, the app will display:

> “No contacts found!”

Click **Add New Contact** to begin.

---

### 2.3 Navigation Overview

| Page | Purpose |
|------|---------|
| **index.html** | View, search, sort, and manage contacts |
| **form.html** | Add or edit a contact |
| **view.html** | View a contact’s full details |

---

## 3. Features and Functionality

### 3.1 Contact List Page (index.html)

The main dashboard includes:

#### ✓ Search Contacts
- Type in the search bar  
- Results update instantly  
- Supports partial matches  

#### ✓ Sorting
Sort button toggles between:

- **A–Z ascending**  
- **Z–A descending**

Text updates accordingly:

- ⬇ Sort: A–Z  
- ⬆ Sort: Z–A  

#### ✓ Filter Favorites
- Checkbox allows display of starred contacts only  

#### ✓ Pagination
- Appears automatically when contacts exceed 5  
- Click page numbers to navigate  

#### ✓ Contact Actions

| Icon | Action |
|------|--------|
| 👁 (View) | Open full contact details |
| ✏ (Edit) | Edit the selected contact |
| 🗑 (Delete) | Opens confirmation modal |
| ⭐ (Favorite) | Toggle favorite status |

---

### 3.2 Adding or Editing Contacts (form.html)

#### ✓ Validation Rules

| Field | Requirements |
|-------|-------------|
| **Full Name** | Letters & spaces only, 2–50 chars |
| **Phone** | + optional, 6–15 digits |
| **Email** | Standard email format |
| **Profile Picture** | Image ≤ 1MB |

Invalid inputs show error messages instantly.

#### ✓ Duplicate Prevention
The app prevents saving if another contact uses the same:

- Phone number  
- Email address  

#### ✓ Edit Mode
If the form is opened with **?edit=ID**:

- Fields auto-fill  
- Delete button becomes visible  
- Title changes to **"Edit Contact"**  

---

### 3.3 Viewing a Contact (view.html)
Displays:

- Profile picture  
- Full name  
- Clickable phone number (tel:)  
- Clickable email (mailto:)  

Includes an **Edit Contact** button.

---

### 3.4 Data Storage
All contacts are saved as:

```
localStorage["contacts"]
```

Meaning:

- Data persists after refresh  
- No server needed  
- Data stays on the user’s device only  

---

### 3.5 Modal System
Used for:

- Delete confirmations  
- File-size warnings  
- Duplicate notifications  

Each modal includes:

- Message  
- Cancel button  
- Confirm button (hidden for notices)  

---

## 4. Step-by-Step Instructions

### 4.1 Adding a New Contact
1. Open **index.html**  
2. Click **Add New Contact**  
3. Fill all required fields  
4. Upload profile picture (optional)  
5. Click **Save**  
6. Contact appears in the list  

---

### 4.2 Editing an Existing Contact
1. Click the **Edit (✏)** icon  
   or open the contact and click **Edit Contact**  
2. Update fields  
3. Click **Save**  

---

### 4.3 Deleting a Contact
1. Click the **Delete (🗑)** icon  
2. Confirmation modal appears  
3. Click **Delete** to confirm  

---

### 4.4 Marking a Contact as Favorite
- Click ⭐ on the contact card  
- Filled star = favorite  
- Click again to unmark  

---

### 4.5 Viewing Full Contact Details
1. Click the **View (👁)** icon  
2. See:  
   - Name  
   - Phone  
   - Email  
   - Avatar  
3. Click **Back to Contacts**  

---

### 4.6 Searching Contacts
- Type in the search bar  
- Results update automatically  
- Searches all fields  

---

### 4.7 Sorting Contacts
- Click **Sort** button  
- Toggles between **A–Z** and **Z–A**  

---

### 4.8 Filtering Favorites
- Check **Show Favorites Only**  
- Only starred contacts appear  
- Uncheck to view all contacts  

---

### 4.9 Navigating Pages
- Pagination appears when contacts > 5  
- Click a page number  
- Contacts for that page load  

---
