// Select DOM elements
const incomeInput = document.getElementById('total-income');
const incomeTitleInput = document.getElementById('income-title');
const totalIncomeButton = document.getElementById('total-income-button');
const budgetInput = document.getElementById('total-amount');
const totalAmountButton = document.getElementById('total-amount-button');
const productTitleInput = document.getElementById('product-title');
const userAmountInput = document.getElementById('user-amount');
const checkAmountButton = document.getElementById('check-amount');
const incomeDisplay = document.getElementById('income');
const budgetDisplay = document.getElementById('amount');
const expenditureDisplay = document.getElementById('expenditure-value');
const balanceDisplay = document.getElementById('balance-amount');
const expenseList = document.getElementById('list');
const notification = document.createElement('div');

let totalIncome = 0;
let totalBudget = 0;
let totalExpenditure = 0;
let expenses = [];

// Load data from sessionStorage
function loadData() {
    totalIncome = parseFloat(sessionStorage.getItem('totalIncome')) || 0;
    totalBudget = parseFloat(sessionStorage.getItem('totalBudget')) || 0;
    totalExpenditure = parseFloat(sessionStorage.getItem('totalExpenditure')) || 0;
    expenses = JSON.parse(sessionStorage.getItem('expenses')) || [];

    // Update the displayed values
    updateDisplays();
    loadExpenses(); // Load expenses on page load
}

// Save data to sessionStorage
function saveData() {
    sessionStorage.setItem('totalIncome', totalIncome);
    sessionStorage.setItem('totalBudget', totalBudget);
    sessionStorage.setItem('totalExpenditure', totalExpenditure);
    sessionStorage.setItem('expenses', JSON.stringify(expenses)); // Save expenses
}

// Update displayed values
function updateDisplays() {
    incomeDisplay.textContent = totalIncome.toFixed(2);
    budgetDisplay.textContent = totalBudget.toFixed(2);
    expenditureDisplay.textContent = totalExpenditure.toFixed(2);
    updateBalance(); // Update balance display
}

// Load and display expenses
function loadExpenses() {
    expenseList.innerHTML = ''; // Clear existing list
    expenses.forEach((expense, index) => {
        const listItem = document.createElement('div');
        listItem.style.display = 'flex'; // Use flexbox for layout
        listItem.style.justifyContent = 'space-between'; // Space between title and button
        listItem.style.alignItems = 'center'; // Center align items
        listItem.style.color="white";
        
        // Expense text
        const expenseText = document.createElement('span');
        expenseText.textContent = `${expense.title}: $${expense.amount.toFixed(2)}`;
        listItem.appendChild(expenseText);
        
        // Add delete button to the right
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            removeExpense(index); // Pass index to removeExpense
            expenseList.removeChild(listItem);
        };
        
        // Style the delete button
        deleteButton.style.marginLeft = '10px'; // Space between text and button
        listItem.appendChild(deleteButton);
        
        expenseList.appendChild(listItem); // Append the list item
    });
}

// Remove expense and update totals
function removeExpense(index) {
    const amount = expenses[index].amount; // Get the amount to remove
    totalExpenditure -= amount; // Deduct the amount from total expenditure
    expenses.splice(index, 1); // Remove the expense from the array
    expenditureDisplay.textContent = totalExpenditure.toFixed(2);
    updateBalance();
    saveData(); // Update session storage
}

// Set Income
totalIncomeButton.addEventListener('click', () => {
    const incomeValue = parseFloat(incomeInput.value);
    const incomeTitle = incomeTitleInput.value.trim();

    if (incomeValue > 0 && incomeTitle) {
        totalIncome += incomeValue;
        clearInputs([incomeInput, incomeTitleInput]);
        updateDisplays(); // Update displayed values
        saveData();
    } else {
        showError('income-error');
    }
});

// Set Budget
totalAmountButton.addEventListener('click', () => {
    const budgetValue = parseFloat(budgetInput.value);

    // Check if budget is positive and does not exceed total income
    if (budgetValue > 0 && budgetValue <= totalIncome) {
        totalBudget = budgetValue;
        clearInputs([budgetInput]);
        updateDisplays(); // Update displayed values
        saveData();
    } else {
        showNotification("Error: Budget must be positive and cannot exceed total income!");
        showError('budget-error');
    }
});

// Add Expense
checkAmountButton.addEventListener('click', () => {
    const expenseValue = parseFloat(userAmountInput.value);
    const expenseTitle = productTitleInput.value.trim();

    if (expenseValue > 0 && expenseTitle) {
        totalExpenditure += expenseValue;
        expenses.push({ title: expenseTitle, amount: expenseValue });
        clearInputs([userAmountInput, productTitleInput]);
        updateDisplays(); // Update displayed values
        loadExpenses(); // Refresh expense list
        saveData(); // Update session storage
    } else {
        showError('product-title-error');
    }
});

// Update balance display
function updateBalance() {
    const balance = totalBudget - totalExpenditure;
    balanceDisplay.textContent = balance.toFixed(2);
    
    // Check balance and show notification if needed
    if (balance < 0) {
        showNotification("Warning: Your balance is negative!");
    } else {
        clearNotification(); // Clear notification if balance is okay
    }
}

// Clear input fields
function clearInputs(inputs) {
    inputs.forEach(input => input.value = '');
}

// Show error message
function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.classList.remove('hide');
    errorElement.textContent = "Please correct the input.";
    setTimeout(() => {
        errorElement.classList.add('hide');
    }, 3000);
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'; // Red background
    notification.style.color = '#fff'; // White text
    notification.style.padding = '10px';
    notification.style.marginTop = '10px';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);

    // Automatically clear notification after 3 seconds
    setTimeout(clearNotification, 3000);
}

// Clear notification
function clearNotification() {
    if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
    }
}

// Toggle Dark Mode
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Load data on page load
window.onload = loadData;
