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

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    return serverQuotes.map(quote => ({
      text: quote.title,
      category: 'Server' // Default category for server quotes
    }));
  } catch (error) {
    console.error('Failed to fetch quotes from server:', error);
    return [];
  }
}

// Function to post quotes to the server
async function postQuotesToServer(quotes) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(quotes),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    console.log('Quotes posted to server:', data);
  } catch (error) {
    console.error('Failed to post quotes to server:', error);
  }
}

// Function to sync quotes with the server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;
  populateCategories();
  filterQuotes();

  await postQuotesToServer(mergedQuotes);

  notifyUser('Data synced with server successfully!');
}

// Function to merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
  const mergedQuotes = [...localQuotes];
  serverQuotes.forEach(serverQuote => {
    const existingQuote = localQuotes.find(localQuote => localQuote.text === serverQuote.text);
    if (!existingQuote) {
      mergedQuotes.push(serverQuote); // Add new server quotes
    }
  });
  return mergedQuotes;
}

// Function to notify users of updates
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.borderRadius = '5px';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong> <em>(${randomQuote.category})</em>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please fill in both the quote and category fields.');
  }
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
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
  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Function to display quotes
function displayQuotes(quotesToDisplay) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = quotesToDisplay.length > 0
    ? quotesToDisplay.map(quote => `<p><strong>${quote.text}</strong> <em>(${quote.category})</em></p>`).join('')
    : 'No quotes found for this category.';
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
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Load the last selected category from local storage
function loadLastSelectedCategory() {
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  document.getElementById('categoryFilter').value = lastSelectedCategory;
  filterQuotes();
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial setup
populateCategories();
loadLastSelectedCategory();
showRandomQuote();

// Periodic syncing (every 5 minutes)
setInterval(syncQuotes, 5 * 60 * 1000);
