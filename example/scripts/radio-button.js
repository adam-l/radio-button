/**
 * Radio Button
 *
 * Creates a <span /> element that represents the radio button.
 * After you have the fake radio element you can easily modify it's appearance with CSS.
 *
 * Browser support is IE6+ and all modern browsers.
 * Can be used with jQuery or as stand-alone script.
 *
 * Requires: Bind Event Handler (https://github.com/adam-l/bind-event-handler)
 *
 * Usage examples:
 *		1) jQuery(':radio').radioButton();
 *		2) new RadioButton(element);
 *
 * Licensed under the MIT license
 *
 * @author frontend.zorro@gmail.com
 * @requires bindEventHandler
 * @constructor
 * @param {Object} element The <input /> element for which the <span /> will be created
 * @return {RadioButton} The new RadioButton object
 */
function RadioButton(element) {

	if (!(this instanceof RadioButton)) {
		return new RadioButton(element);
	}

	this.validateElement(element);

	this.element = element;
	this.name = element.name;
	this.class_name = (element.className.length > 0) ? 'fake-radio ' + element.className : 'fake-radio';
	this.fake = this.createFake();
	this.form = this.getClosestForm(element);

	var self = this,
		handler = function() {self.update.call(self)};

	if (element.checked) {
		this.fake.className = this.class_name + ' active';
	}

	// Binding the event handlers
	bindEventHandler(this.element, 'click', handler);
	bindEventHandler(this.fake, 'click', handler);

	return {
		'element': this.element,
		'fake': this.fake
	};
}

RadioButton.prototype = {

	/**
	 * Verify whether the provided element is a valid one
	 *
	 * @param {object} element The element
	 */
	validateElement: function(element) {
		if (element.nodeName != "INPUT") {
			throw new Error('Expected element name is <input />.');
		} if (element.getAttribute('type') != 'radio') {
			throw new Error('Expected value for "type" attribute is "radio" or "checkbox"');
		}
	},

	/**
	 * Creates a <span /> element representing the radio button
	 * 
	 * @returns {object} element The newly created <span />
	 */
	createFake: function() {
		var element = this.element
						.parentNode
						.insertBefore(document.createElement('span'), this.element);

		element
			.appendChild(this.element) // Hide the real <input /> element by appending it to the fake one
			.parentNode
			.className = this.class_name;

		return element;
	},

	/**
	 * Recursively search up the DOM tree for the nearest <form /> element
	 *
	 * @param {object} element The given <input /> element
	 * @returns {object} element Closest <form /> element
	 */
	getClosestForm: function(element) {
		if (element.nodeName === "FORM") {
			return element;
		} else {
			return this.getClosestForm(element.parentNode);
		}
	},

	/**
	 * Looks at the closest form element and searchs for
	 * all radio buttons with the specific name attribute
	 * 
	 * @returns {array} elements Array containg the radio buttons
	 */
	getRadioByName: function() {
		var elements = [],
			input = this.form.getElementsByTagName('input'),
			i = input.length;

		while (i--) {
			var input_type = input[i].getAttribute('type').toLowerCase(),
				name_attribute = input[i].getAttribute('name');

			if (input_type === 'radio' && name_attribute === this.name) {
				elements.push(input[i]);
			}
		}

		return elements;
	},

	/**
	 * Triggered by the click event on the fake radio element
	 * and by the change event of the real radio element.
	 * Iterates through all the radio buttons and deactivates them if
	 * they are not associated with the one that triggered the event
	 */
	update: function() {
		var radio = this.getRadioByName(),
			i = radio.length;

		// Remove the 'active' class from all the fake radio elements except
		// the one representing the new active radio button
		while (i--) {

			// Skip the iteration - there is no need to remove the
			// 'active' class from the fake element that represents
			// the selected radio button
			if (radio[i] === this.element) {
				continue;
			}

			radio[i].parentNode.checked = false;
			radio[i].parentNode.className = 'fake-radio ' + radio[i].className;
		}

		this.element.checked = true;
		this.fake.className = this.class_name + ' active';
	}
};

if (typeof jQuery != 'undefined') {
	jQuery.fn.radioButton = function() {
		this.each(function() {
			return new RadioButton(this);
		});

		return this;
	};
}