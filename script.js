// Load quotes from local storage or initialize with default data
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes(); // Save to localStorage
      alert("New quote added successfully!");
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showQuotesInList(); // Update displayed list
    } else {
      alert("Please enter both the quote text and category.");
    }
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      quoteDisplay.textContent = `${quotes[randomIndex].text} (${quotes[randomIndex].category})`;
      sessionStorage.setItem('lastViewedQuote', JSON.stringify(quotes[randomIndex]));
    } else {
      quoteDisplay.textContent = "No quotes available!";
    }
  }
  
  // Display last viewed quote from session storage
  function showLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
      document.getElementById('quoteDisplay').textContent = JSON.parse(lastQuote).text;
    }
  }
  
  // Export quotes to JSON file
  function exportToJson() {
    const jsonData = JSON.stringify(quotes);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
          showQuotesInList(); // Update list after import
        } else {
          alert('Invalid JSON format.');
        }
      } catch (error) {
        alert('Error parsing the JSON file.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Display all quotes in a list format
  function showQuotesInList() {
    const listContainer = document.getElementById('quoteList');
    listContainer.innerHTML = '';
    quotes.forEach((quote, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${quote.text} (${quote.category})`;
      listContainer.appendChild(listItem);
    });
  }
  
  // Event listeners for buttons
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('exportQuotes').addEventListener('click', exportToJson);
  
  // Display the last viewed quote and initialize the list
  window.addEventListener('DOMContentLoaded', () => {
    showLastViewedQuote();
    showQuotesInList();
  });
  