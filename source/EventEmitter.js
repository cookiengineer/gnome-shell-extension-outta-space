
// XXX: gjs is too stupid for ES6 Modules
var EventEmitter;


(function(global) {

	const _       = imports.misc.extensionUtils.getCurrentExtension();
	const console = _.imports.console.console;



	/*
	 * IMPLEMENTATION
	 */

	const _EventEmitter = class EventEmitter {

		constructor() {
			this.__signals = [];
		}

		destroy() {
			this.unbind(null, null);
		}

		bind(element, event, callback) {

			event    = typeof event === 'string'    ? event    : null;
			callback = callback instanceof Function ? callback : null;


			if (element !== null && event !== null && callback !== null) {

				this.__signals.push({
					element: element,
					event:   event,
					signal:  element.connect(event, callback)
				});

				return true;

			}


			return false;

		}

		unbind(element, event) {

			element = element !== undefined     ? element : null;
			event   = typeof event === 'string' ? event   : null;


			let result  = false;
			let signals = this.__signals;

			for (let s = 0, sl = signals.length; s < sl; s++) {

				let entry = signals[s];
				if (entry.element === element || element === null) {

					if (entry.event === event || event === null) {

						entry.element.disconnect(entry.signal);
						result = true;
						signals.splice(s, 1);
						sl--;
						s--;

					}

				}

			}


			return result;

		}

	};



	/*
	 * EXPORTS
	 */

	EventEmitter = _EventEmitter;

})(typeof global !== 'undefined' ? global : this);

