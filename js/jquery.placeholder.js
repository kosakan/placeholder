(function($) {

	/**
	 * Spoofs placeholders in browsers that don't support them (eg Firefox 3)
	 * 
	 * Copyright 2011 Dan Bentley
	 * Licensed under the Apache License 2.0
	 *
	 * Author: Dan Bentley [github.com/danbentley]
	 */

	// Return if native support is available.
	if ("placeholder" in document.createElement("input")) return;

	$(document).ready(function(){
		$(':input[placeholder]').not(':password').each(function() {
			setupPlaceholder($(this));
		});

		$(':password[placeholder]').each(function() {
			setupPasswords($(this));
		});
	   
		$('form').submit(function(e) {
			clearPlaceholdersBeforeSubmit($(this));
		});
	});

	function setupPlaceholder(input) {

		var placeholderText = input.attr('placeholder');

		setPlaceholderOrFlagChanged(input, placeholderText);
		input.bind({
			focus: function(e) {
				if (input.hasClass('populated') === true) return;
				if (input.val() === placeholderText) input.val('');
			},
			blur: function(e) {
				if (input.val() === '') input.val(placeholderText); 
			},
			change: function(e) {
				if (input.val() !== '') input.addClass('populated');
			}
		});
	}

	function setPlaceholderOrFlagChanged(input, text) {
		(input.val() === '') ? input.val(text) : input.addClass('populated');
	}

	function setupPasswords(input) {
		var passwordPlaceholder = createPasswordPlaceholder(input);
		input.after(passwordPlaceholder);

		(input.val() === '') ? input.hide() : passwordPlaceholder.hide();

		$(input).blur(function(e) {
			if (input.val() !== '') return;
			input.hide();
			passwordPlaceholder.show();
		});
			
		$(passwordPlaceholder).focus(function(e) {
			input.show().focus();
			passwordPlaceholder.hide();
		});
	}

	function createPasswordPlaceholder(input) {
		return $('<input>').attr({
			placeholder: input.attr('placeholder'),
			value: input.attr('placeholder'),
			id: input.attr('id'),
			readonly: true
		}).addClass(input.attr('class'));
	}

	function clearPlaceholdersBeforeSubmit(form) {
		form.find(':input[placeholder]').each(function() {
			if ($(this).hasClass('populated') === true) return;
			if ($(this).val() === $(this).attr('placeholder')) $(this).val('');
		});
	}
})(jQuery);
