document.addEventListener('DOMContentLoaded', function () {
	const filterBtn = document.getElementById('filterBtn');
	const noResultsMessage = document.getElementById('no-results');
  
	filterBtn.addEventListener('click', () => {
	  // Get the selected colour	
	  const selectedColour = document.querySelector('input[name="colour"]:checked').value;
  
	  // Get the selected category
	  const selectedCategory = document.querySelector('input[name="category"]:checked').value;
  
	  // Filter the cars by colour and category
	  const filteredCars = document.querySelectorAll(`[data-colour="${selectedColour}"][data-category="${selectedCategory}"]`);
  
	  // Hide all cars
	  const allCars = document.querySelectorAll('[data-colour]');
	  allCars.forEach(car => {
		car.style.display = 'none';
	  });
  
	  // If there are filtered cars, show them. Otherwise, show the no results message.
	  if (filteredCars.length > 0) {
		filteredCars.forEach(car => {
		  car.style.display = 'block';
		});
		noResultsMessage.style.display = 'none'; // Hide the no results message
	  } else {
		noResultsMessage.style.display = 'block'; // Show the no results message
	  }
	});
  });