
						// fetch stock data
						function fetchStockData() {
						  fetch('/stock-price')
							.then(response => response.json())
							.then(data => {
							  // Find the elements to display the stock price and change
							  var stockElement = document.getElementById('stock-price');
							  var changeElement = document.getElementById('stock-change');
							  // Set the text content of the elements to the stock price and change
							  stockElement.textContent = 'Mercedes stock price: ' + data.price;
							  changeElement.textContent = 'Change: ' + data.changePercent;
							  if (data.changePercent.startsWith('-')) {
								changeElement.innerHTML += ' <i class="fa fa-arrow-down" style="color:red;"></i>';
							  } else {
								changeElement.innerHTML += ' <i class="fa fa-arrow-up" style="color:green;"></i>';
							  }
							});
						}
					
						// call the function to fetch the stock data
						fetchStockData();
				