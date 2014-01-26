buster.spec.expose();

var spec = describe("Radio Button", function () {
	beforeAll(function () {
		this.male = document.getElementById('male');
		this.female = document.getElementById('female');

		this.maleLabel = document.getElementsByTagName('label')[0];
		this.femaleLabel = document.getElementsByTagName('label')[1];

		this.instance = new RadioButton(male);
		this.$instance = jQuery('#female').radioButton();
		
		this.triggerClickEvent = (function() {
			var fn,
				clickEvent = document.createEvent('MouseEvents');

			if (typeof document.dispatchEvent != 'undefined') {
				fn = function (element) {
					clickEvent.initMouseEvent('click', true, false, window);
					element.dispatchEvent(clickEvent);
				};
			} else if (typeof document.body.click != 'undefined') {
				fn = function(element) {
					element.click();
				};
			} else {
				fn = function(element) {
					element.onclick();
				};
			}

			return fn;
		})();
	});


	// Creation
	it('can be instantiated', function () {
		buster.assert.equals('object', typeof this.instance);
	});

	it('can be run like a jQuery plugin', function () {
		buster.assert.equals(true, this.$instance instanceof jQuery);
	});

	it('creates a &lt;span /&gt; element representing the radio button', function () {
		var parent = this.male.parentNode,
			isSpan = parent.nodeName === 'SPAN' ? true : false,
			hasClass = parent.className.indexOf('fake-radio') != -1 ? true : false,
			result = isSpan && hasClass ? true : false;

		buster.assert.match(result, true);
	});


	// Fake representation click event
	it('adds the "active" class to fake representation when it is being clicked', function () {
		this.male.parentNode.className = 'fake-radio';
		this.triggerClickEvent(this.male.parentNode);
		buster.assert.match(this.male.parentNode.className.indexOf('active') != -1, true);
	});

	it('selects the radio button when the fake representation is clicked', function () {
		this.male.checked = false;
		this.triggerClickEvent(this.male.parentNode);
		buster.assert.equals(this.male.checked, true);
	});

	it('removes the "active" class from fake representation when other fake representation is being clicked', function () {
		this.female.parentNode.className = 'fake-radio active';
		this.triggerClickEvent(this.male.parentNode);
		buster.assert.match(this.female.parentNode.className.indexOf('active') == -1, true);
	});

	it('deselects radio button when a fake representation of other radio button is being clicked', function () {
		this.female.checked = true;
		this.triggerClickEvent(this.male.parentNode);
		buster.assert.equals(this.female.checked, false);
	});


	// Radio button click events
	it('adds the "active" class to fake representation when the related radio button is being clicked', function () {
		this.male.parentNode.className = 'fake-radio';
		this.triggerClickEvent(this.male);
		buster.assert.match(this.male.parentNode.className.indexOf('active') != -1, true);
	});

	it('removes the "active" class from fake representation when other not related radio button is being clicked', function () {
		this.male.parentNode.className = 'fake-radio active';
		this.triggerClickEvent(this.female);
		buster.assert.match(this.male.parentNode.className.indexOf('active') == -1, true);
	});


	// Errors
	describe('throws an error when the element passed as an argument', function () {
		beforeAll(function () {
			this.checkbox = document.createElement('input');
			this.checkbox.type = 'checkbox';
		});

		it('is not an &lt;input /&gt; element', function () {
			buster.assert.exception(function () {
				new RadioButton(document.body);
			});
		});

		it('is an &lt;input /&gt; element but not a radio button', function () {
			buster.assert.exception(function () {
				new RadioButton(this.checkbox);
			});
		});
	});
});