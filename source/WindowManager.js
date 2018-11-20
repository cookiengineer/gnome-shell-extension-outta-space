
// XXX: gjs is too stupid for ES6 Modules
var WindowManager;


(function(global) {

	const _            = imports.misc.extensionUtils.getCurrentExtension();
	const console      = _.imports.console.console;
	const EventEmitter = _.imports.EventEmitter.EventEmitter;
	const _GLib        = imports.gi.GLib;
	const _Meta        = imports.gi.Meta;
	const _main        = imports.ui.main;
	const _mainloop    = imports.mainloop;



	/*
	 * HELPERS
	 */

	const _get_window_id = function(window) {

		let id = window._outta_space_id || null;
		if (id !== null) {
			return id;
		}


		try {

			let tmp = ((window.get_description() || '').trim().split(' ')[0] || '').trim();
			if (/0x[0-9a-f]+/g.test(tmp) === true) {
				window._outta_space_id = tmp;
				return window._outta_space_id;
			}

		} catch (err) {
		}


		return null;

	};

	const _show_titlebar = function(window) {

		let id = _get_window_id(window);
		if (id !== null) {

			let [ success, pid ] = _GLib.spawn_async(null, [
				'xprop',
				'-id',  id,
				'-f',   '_GTK_HIDE_TITLEBAR_WHEN_MAXIMIZED', '32c',
				'-set', '_GTK_HIDE_TITLEBAR_WHEN_MAXIMIZED', '0x0'
			], null, _GLib.SpawnFlags.SEARCH_PATH | _GLib.SpawnFlags.DO_NOT_REAP_CHILD, null);

			_GLib.child_watch_add(_GLib.PRIORITY_DEFAULT, pid, _ => {

				let flags = _Meta.MaximizeFlags.BOTH;
				let state = window.get_maximized();
				if (state === flags) {
					window.unmaximize(flags);
					window.maximize(flags);
				}

			});

		}

	};

	const _hide_titlebar = function(window) {

		let id = _get_window_id(window);
		if (id !== null) {

			let [ success, pid ] = _GLib.spawn_async(null, [
				'xprop',
				'-id',  id,
				'-f',   '_GTK_HIDE_TITLEBAR_WHEN_MAXIMIZED', '32c',
				'-set', '_GTK_HIDE_TITLEBAR_WHEN_MAXIMIZED', '0x1'
			], null, _GLib.SpawnFlags.SEARCH_PATH | _GLib.SpawnFlags.DO_NOT_REAP_CHILD, null);

			_GLib.child_watch_add(_GLib.PRIORITY_DEFAULT, pid, _ => {

				let flags = _Meta.MaximizeFlags.BOTH;
				let state = window.get_maximized();
				if (state === flags) {
					window.unmaximize(flags);
					window.maximize(flags);
				}

			});

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const _WindowManager = class WindowManager extends EventEmitter {

		constructor() {

			super();


			_mainloop.timeout_add(100, _ => {

				let windows = global.get_window_actors().map(win => win.meta_window);
				if (windows.length > 0) {

					windows.forEach(window => {

						if (window.window_type !== _Meta.WindowType.DESKTOP) {
							_hide_titlebar(window);
						}

					});

				}

			});

		}

		destroy() {

			let windows = global.get_window_actors().map(win => win.meta_window);
			if (windows.length > 0) {

				windows.forEach(window => {

					if (window.window_type !== _Meta.WindowType.DESKTOP) {
						_show_titlebar(window);
					}

				});

			}

		}

	};


	/*
	 * EXPORTS
	 */

	WindowManager = _WindowManager;

})(typeof global !== 'undefined' ? global : this);

