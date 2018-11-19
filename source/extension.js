
const _            = imports.misc.extensionUtils.getCurrentExtension();
const console      = _.imports.console.console;
const PanelManager = _.imports.PanelManager.PanelManager;
let   _MANAGER     = null;



/*
 * EXPORTS
 */

function init() {

}

function enable() {

	console.clear();
	console.info('outta-space enabled.');

	if (_MANAGER === null) {
		_MANAGER = new PanelManager({});
	}

}

function disable() {

	console.warn('outta-space disabled.');

	if (_MANAGER !== null) {
		_MANAGER.destroy();
		_MANAGER = null;
	}

}

