// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuI6mKzTwdYPzWoKvJU7ut2eMHaMKAZPg",
  authDomain: "expenses-tracker-34f9f.firebaseapp.com",
  projectId: "expenses-tracker-34f9f",
  storageBucket: "expenses-tracker-34f9f.appspot.com",
  messagingSenderId: "620436165165",
  appId: "1:620436165165:web:22afb4c85d5f47cf5a1ea4",
  measurementId: "G-CM7VK2HZQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const expenseList = document.getElementById('list');

  // Function to upload income, budget, and expenses
  document.getElementById('upload').addEventListener('click', async () => {
    const productTitle = document.getElementById('product-title').value.trim();
    const userAmount = parseFloat(document.getElementById('user-amount').value);
    const totalIncome = parseFloat(sessionStorage.getItem('totalIncome')) || 0;
    const totalBudget = parseFloat(sessionStorage.getItem('totalBudget')) || 0;
    const totalExpenditure = parseFloat(sessionStorage.getItem('totalExpenditure')) || 0;
    const expenses = JSON.parse(sessionStorage.getItem('expenses')) || [];
    const user = auth.currentUser;

    if (user) {
      try {
        const expenseData = {
          totalIncome: totalIncome,
          totalBudget: totalBudget,
          totalExpenditure: totalExpenditure,
          expenses: expenses,
          uid: user.uid,
          timestamp: new Date().toISOString()
        };

        // Store the expense data in the database
        await set(ref(database, `expenses/${user.uid}`), expenseData);
        alert("Data uploaded successfully!");

        // Clear input fields
        clearInputs();
      } catch (error) {
        console.error("Error uploading data: ", error);
        alert("Failed to upload data: " + error.message);
      }
    } else {
      alert("User not authenticated. Please log in.");
    }
  });

  // Function to load expenses
  function loadExpenses() {
    const user = auth.currentUser;
    if (!user) return; // Ensure the user is logged in

    const expensesRef = ref(database, `expenses/${user.uid}`);

    onValue(expensesRef, (snapshot) => {
      expenseList.innerHTML = ''; // Clear existing list
      snapshot.forEach((childSnapshot) => {
        const expense = childSnapshot.val();
        const expenseId = childSnapshot.key; // Get the unique ID for deletion

        const listItem = document.createElement('div');
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        listItem.style.alignItems = 'center';
        listItem.style.color="white";

        const expenseText = document.createElement('span');
        expenseText.textContent = `${expense.title}: $${expense.amount.toFixed(2)}`;
        listItem.appendChild(expenseText);

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
          deleteExpense(expenseId);
        };
        deleteButton.style.marginLeft = '10px';
        listItem.appendChild(deleteButton);

        expenseList.appendChild(listItem);
      });
    });
  }

  // Function to delete an expense
  function deleteExpense(expenseId) {
    const user = auth.currentUser;
    const expenseRef = ref(database, `expenses/${user.uid}/${expenseId}`);

    remove(expenseRef)
      .then(() => {
        alert("Expense deleted successfully!");
        loadExpenses(); // Refresh the list after deletion
      })
      .catch((error) => {
        console.error("Error deleting expense: ", error);
        alert("Failed to delete expense: " + error.message);
      });
  }

  // Clear input fields
  function clearInputs() {
    document.getElementById('product-title').value = '';
    document.getElementById('user-amount').value = '';
  }

  // Load expenses on page load
  loadExpenses();
});

// Sign In
document.getElementById('signin-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;

  try {
      await signInWithEmailAndPassword(auth, email, password);
      document.getElementById('signin-message').textContent = "Signed in successfully!";
      window.location.href = "/";
  } catch (error) {
      document.getElementById('signin-message').textContent = `Error: ${error.message}`;
  }
});

// Sign Up
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
      await createUserWithEmailAndPassword(auth, email, password);
      document.getElementById('signup-message').textContent = "Signed up successfully!";
      window.location.href = "/";
  } catch (error) {
      document.getElementById('signup-message').textContent = `Error: ${error.message}`;
  }
});

// Logout button
const logoutButton = document.getElementById('logout');
const loginbt = document.getElementById("login");
const signinbt = document.getElementById("signup");

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
      // User is signed in
      loginbt.style.display = 'none';
      signinbt.style.display = 'none';
      logoutButton.style.display = 'block'; // Show logout button
  } else {
      // User is signed out
      logoutButton.style.display = 'none'; // Hide logout button
      loginbt.style.display = 'block';
      signinbt.style.display = 'block';
  }
});

// Handle logout
logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
      alert("Logged out successfully!");
      window.location.href = 'signIn.html'; // Redirect to sign-in page
  }).catch((error) => {
      console.error("Error logging out: ", error);
  });
});
