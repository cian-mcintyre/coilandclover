
$(document).ready(function() {
	// Validate first name field on blur (i.e., when focus leaves the field)
	$('#firstName').blur(function() {
		var firstName = $(this).val();
		if (firstName.length === 0) {
			// Show error if field is empty
			$(this).addClass('error'); // CSS class to highlight the field
			$('#firstNameError').text('First name is required').addClass('error-message'); // Display error message
		} else {
			$(this).removeClass('error'); // Remove error highlighting
			$('#firstNameError').text(''); // Clear error message
		}
	});
	$('#lastName').blur(function() {
		var firstName = $(this).val();
		if (firstName.length === 0) {
			// Show error if field is empty
			$(this).addClass('error'); // CSS class to highlight the field
			$('#lastNameError').text('Last name is required').addClass('error-message'); // Display error message
		} else {
			$(this).removeClass('error'); // Remove error highlighting
			$('#lastNameError').text(''); // Clear error message
		}
	});
	$('#number').blur(function() {
		var number = $(this).val();
		var pattern = /^\d{3}-\d{3}-\d{4}$/;
		if (!pattern.test(number)) {
			$(this).addClass('error');
			$('#numberError').text(' Phone number is invalid').addClass('error-message');
		} else {
			$(this).removeClass('error');
			$('#numberError').text('');
		}
	});
	
	$('#email').blur(function() {
	var email = $(this).val();
	var pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
	if (!pattern.test(email)) {
	$(this).addClass('error');
	$('#emailError').text('Email is invalid').addClass('error-message');
	} else {
	$(this).removeClass('error');
	$('#emailError').text('');
	}
	});

	$('#add1').blur(function() {
	var add1 = $(this).val();
	if (add1.length === 0) {
	$(this).addClass('error');
	$('#add1Error').text('Address is required').addClass('error-message');
	} else {
	$(this).removeClass('error');
	$('#add1Error').text('');
	}
	});

	$('#city').blur(function() {
	var city = $(this).val();
	if (city.length === 0) {
	$(this).addClass('error');
	$('#cityError').text('City is required').addClass('error-message');
	} else {
	$(this).removeClass('error');
	$('#cityError').text('');
	}
	});

	$('#zip').blur(function() {
	var zip = $(this).val();
	var pattern = /[A-Z0-9]{7}/;
	if (!pattern.test(zip)) {
	$(this).addClass('error');
	$('#zipError').text('Eircode is invalid').addClass('error-message');
	} else {
	$(this).removeClass('error');
	$('#zipError').text('');
	}
	});

});

