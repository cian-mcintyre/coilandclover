// fetch stock data
function fetchStockData() {
  fetch('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DAI.DE&apikey=25I84JEQZ9141JPX')
    .then(response => response.json())
		.then(data => {
			// Access the stock price from the received data
			var stockPrice = data["Global Quote"]["05. price"];
			// Find the element to display the stock price
			var stockElement = document.getElementById('stock-price');
			// Set the text content of the element to the stock price
			stockElement.textContent = 'Mercedes stock price: ' + stockPrice;
			});
		}
						  
	// call the function to fetch the stock data
	fetchStockData();
						  