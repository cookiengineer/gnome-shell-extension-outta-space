
const _             = imports.misc.extensionUtils.getCurrentExtension();
const console       = _.imports.console.console;
const PanelManager  = _.imports.PanelManager.PanelManager;
const WindowManager = _.imports.WindowManager.WindowManager;
const MANAGER       = {
	panel:  null,
	window: null
};



/*
 * EXPORTS
 */

function init() {

}

function enable() {

	console.clear();
	console.info('outta-space enabled.');

	if (MANAGER.panel === null) {
		MANAGER.panel = new PanelManager({});
	}

	if (MANAGER.window === null) {
		MANAGER.window = new WindowManager({});
	}

}

function disable() {

	console.warn('outta-space disabled.');

	if (MANAGER.panel !== null) {
		MANAGER.panel.destroy();
		MANAGER.panel = null;
	}

	if (MANAGER.window !== null) {
		MANAGER.window.destroy();
		MANAGER.window = null;
	}

}

