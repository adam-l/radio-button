/**
 * Bind event handler
 *
 * This snippet can be used to attach event handlers without
 * the need to check each time what sort of function for event
 * attaching is supported in the browser.
 *
 * @autor frontend.zorro@gmail.com
 * @param {Object} element The element that will be binded with the handler function
 * @param {string} event The event that will trigger the function
 * @param {handler} handler The function that will execute when the event happens
 */
var bindEventHandler = (function() {
	var binder = '';

	if (typeof addEventListener != 'undefined') {
		binder = 'element.addEventListener(event, handler, false)';
	} else if (typeof attachEvent !=  'undefined') {
		binder = 'element.attachEvent(event, handler)';
	} else {
		binder = 'element["on" + event] = handler';
	}

	return new Function(['element', 'event', 'handler'], binder);
})();