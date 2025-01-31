document.addEventListener("DOMContentLoaded", function () {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const addQuoteButton = document.getElementById("addQuote");
    const categoryFilter = document.getElementById("categoryFilter");
  
    // Initial quotes array
    let quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "Success is not final, failure is not fatal.", category: "Success" }
    ];
  
    // Populate category dropdown initially
    updateCategoryOptions();
  
    // Event listener for displaying a new random quote
    newQuoteButton.addEventListener("click", showRandomQuote);
  
    // Event listener for adding a new quote
    addQuoteButton.addEventListener("click", addQuote);
  
    // Show a random quote from the selected category
    function showRandomQuote() {
      const selectedCategory = categoryFilter.value;
      const filteredQuotes = selectedCategory
        ? quotes.filter(quote => quote.category === selectedCategory)
        : quotes;
  
      if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for the selected category.";
        return;
      }
  
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
    }
  
    // Function to add a new quote
    function addQuote() {
      const newQuoteText = document.getElementById("newQuoteText").value.trim();
      const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
      if (!newQuoteText || !newQuoteCategory) {
        alert("Please enter both a quote and a category.");
        return;
      }
  
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      updateCategoryOptions();
      alert("New quote added successfully!");
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    }
  
    // Update category dropdown based on available categories
    function updateCategoryOptions() {
      const categories = [...new Set(quotes.map(quote => quote.category))];
      categoryFilter.innerHTML = `<option value="">All Categories</option>`;
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
    }
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" }
      ];
      
      function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
      
        if (newQuoteText && newQuoteCategory) {
          quotes.push({ text: newQuoteText, category: newQuoteCategory });
      
          alert("New quote added successfully!");
          document.getElementById('newQuoteText').value = '';
          document.getElementById('newQuoteCategory').value = '';
        } else {
          alert("Please enter both the quote text and category.");
        }
      }
      
      function showRandomQuote() {
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * quotes.length);
          quoteDisplay.textContent = quotes[randomIndex].text + " (" + quotes[randomIndex].category + ")";
        } else {
          quoteDisplay.textContent = "No quotes available!";
        }
      }
      
      document.getElementById('newQuote').addEventListener('click', showRandomQuote);
      
  });
  