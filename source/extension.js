
const _main         = imports.ui.main;
const _me           = imports.misc.extensionUtils.getCurrentExtension();
const _convenience  = _me.imports.convenience;
const _debug        = _me.imports.convenience.DEBUG;
const _PanelManager = _me.imports.PanelManager;


(function() {

	let _manager  = null;
	let _settings = {};

	function init() {

	}

	function enable() {

		_debug('enable()');

		let data = _convenience.getSettings();
		if (data instanceof Object) {
			Object.assign(_settings, data);
		}

		if (_manager === null) {
			_manager = new PanelManager.PanelManager(_settings);
		}

	}

	function disable() {

		_debug('disable()');

		if (_manager !== null) {
			_manager.destroy();
		}

		_manager  = null;
		_settings = null;

	}

})();

