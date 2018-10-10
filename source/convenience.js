
(function(global) {

	const _lang                 = imports.lang;
	const _Gio                  = imports.gi.Gio;
	const _SettingsSchemaSource = _Gio.SettingsSchemaSource;
	const _DEBUG_FLAG           = false;



	/*
	 * IMPLEMENTATION
	 */

	const _SignalHandler = new _lang.Class({

		Name: 'outtaspace.SignalHandler',

		_init: function() {

			this.__signals = [];

		},

		destroy: function() {

			this.__signals.forEach(entry => {
				this.remove(entry.element, entry.event)
			});

		},

		add: function(element, event, callback) {

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

		},

		remove: function(element, event) {

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

	});



	/*
	 * EXPORTS
	 */

	Object.assign(global, {

		debug: function() {

			let debug = _DEBUG_FLAG;
			let data  = Array.from(arguments);
			if (debug === true && data.length > 0) {

				let now  = new Date();
				let time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();

				data.forEach(message => {
					global.log(time + ' [outtaspace]: ' + message);
				});

				return true;

			}


			return false;

		},

		SignalHandler: _SignalHandler,

		getSettings: function() {

			let extension = _ExtensionUtils.getCurrentExtension() || null;
			if (extension !== null) {

				let schema = extension.metadata['settings-schema'] || null;
				if (schema !== null) {

					let folder = extension.dir.get_child('schemas');
					let source = null;
					if (folder.query_exists(null)) {
						source = _SettingsSchemaSource.new_from_directory(
							folder.get_path(),
							_SettingsSchemaSource.get_default(),
							false
						);
					} else {
						source = _SettingsSchemaSource.get_default();
					}

					let reference = source.lookup(schema, true) || null;
					if (reference !== null) {

						return new _Gio.Settings({
							settings_schema: reference
						});

					}

				}

			}


			return null;

		}

	});

})(typeof global !== 'undefined' ? global : this);

