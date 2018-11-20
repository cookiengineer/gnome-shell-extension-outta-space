
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
	const _WORKSPACES  = global.screen || global.workspace_manager;



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

		if (typeof window.set_hide_titlebar_when_maximized === 'function') {

			// Wayland Mutter API
			window.set_hide_titlebar_when_maximized(false);

			let flags = _Meta.MaximizeFlags.BOTH;
			let state = window.get_maximized();
			if (state === flags) {
				window.unmaximize(flags);
				window.maximize(flags);
			}

		} else {

			// X11 fallback
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

		}

	};

	const _hide_titlebar = function(window) {

		if (typeof window.set_hide_titlebar_when_maximized === 'function') {

			// Wayland Mutter API
			window.set_hide_titlebar_when_maximized(true);

			let flags = _Meta.MaximizeFlags.BOTH;
			let state = window.get_maximized();
			if (state === flags) {
				window.unmaximize(flags);
				window.maximize(flags);
			}

		} else {

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

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	const _WindowManager = class WindowManager extends EventEmitter {

		constructor() {

			super();


			let workspaces = _WORKSPACES || null;
			if (workspaces !== null) {

				for (let w = 0, wl = workspaces.n_workspaces; w < wl; w++) {

					let workspace = workspaces.get_workspace_by_index(w) || null;
					if (workspace !== null) {

						this.bind(workspace, 'window-added', (ws, window) => {
							_mainloop.idle_add(_ => this.hide(window));
						});

					}

				}

			}


			_mainloop.timeout_add(100, _ => {

				let windows = global.get_window_actors().map(win => win.meta_window);
				if (windows.length > 0) {
					windows.forEach(window => this.hide(window));
				}

			});

		}

		destroy() {

			this.unbind(null, null);


			let windows = global.get_window_actors().map(win => win.meta_window);
			if (windows.length > 0) {
				windows.forEach(window => this.show(window));
			}

		}

		show(window) {

			console.log('WindowManager.show("' + window.title.trim() + '")');

			if (window.window_type !== _Meta.WindowType.DESKTOP) {
				_show_titlebar(window);
			}

		}

		hide(window) {

			console.log('WindowManager.hide("' + window.title.trim() + '")');

			if (window.window_type !== _Meta.WindowType.DESKTOP) {
				_hide_titlebar(window);
			}

		}

	};


	/*
	 * EXPORTS
	 */

	WindowManager = _WindowManager;

})(typeof global !== 'undefined' ? global : this);

