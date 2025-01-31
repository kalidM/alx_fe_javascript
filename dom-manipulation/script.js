// Load quotes from local storage when the page loads
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
  localStorage.setItem('lastSelectedCategory', selectedCategory); // Save selected category
}

// Function to display quotes
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = quotesToDisplay.length > 0
    ? quotesToDisplay.map(quote => `<p><strong>${quote.text}</strong> <em>(${quote.category})</em></p>`).join('')
    : 'No quotes found for this category.';
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save quotes to local storage
    populateCategories(); // Update the categories dropdown
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please fill in both the quote and category fields.');
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save updated quotes to local storage
    populateCategories(); // Update the categories dropdown
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Load the last selected category from local storage
function loadLastSelectedCategory() {
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  document.getElementById('categoryFilter').value = lastSelectedCategory;
  filterQuotes(); // Apply the filter
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', () => {
  filterQuotes(); // Apply the current filter
});

// Initial setup
populateCategories(); // Populate categories dropdown
loadLastSelectedCategory(); // Load the last selected category
filterQuotes(); // Apply the filter
