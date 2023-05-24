
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
});

