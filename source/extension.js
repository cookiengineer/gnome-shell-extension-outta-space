
const _             = imports.misc.extensionUtils.getCurrentExtension();
const _main         = imports.ui.main;
const _convenience  = _.imports.convenience;
const _debug        = _convenience.debug;
const _PanelManager = _.imports.PanelManager.PanelManager;


let _manager  = null;
let _settings = {};


function init() {

}

function enable() {

	_debug('enable()');

	if (_manager === null) {
		_manager = new _PanelManager({});
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

