
function showPopup() {
	var message = document.getElementById('popup').innerHTML.trim();
	if (message !== '') {
	  var popup = document.getElementById('popup');
	  popup.classList.add('show');
	  setTimeout(function () {
		popup.classList.remove('show');
	  }, 3000);
	}
  }
  
  window.addEventListener('load', showPopup);

