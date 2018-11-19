
// XXX: gjs is too stupid for ES6 Modules
var PanelManager;


(function(global) {

	const _            = imports.misc.extensionUtils.getCurrentExtension();
	const console      = _.imports.console.console;
	const EventEmitter = _.imports.EventEmitter.EventEmitter;
	const _main        = imports.ui.main;
	const _mainloop    = imports.mainloop;
	const _tweener     = imports.ui.tweener;
	const _MESSAGETRAY = _main.messageTray;
	const _PANELBOX    = _main.layoutManager.panelBox;



	/*
	 * HELPERS
	 */

	const _bind_ui = function() {

		let manager = null;
		if (typeof global.screen !== 'undefined') {
			manager = global.screen;
		} else {
			manager = _main.layoutManager;
		}


		this._signals = new EventEmitter();

		this._signals.add(_main.overview, 'showing', _ => {
			this.show('overview');
		});

		this._signals.add(_main.overview, 'hiding', _ => {
			this.hide('overview');
		});

		this._signals.add(manager, 'monitors-changed', _ => {
			this.__base_y = _PANELBOX.y;
		});

	};



	/*
	 * IMPLEMENTATION
	 */

	const _PanelManager = class PanelManager {

		constructor(settings) {

			settings = settings instanceof Object ? settings : {};

			this._settings   = Object.assign({}, settings);
			this._signals    = null;
			this.__base_y    = _PANELBOX.y;
			this.__old_tween = null;
			this.__tweening  = false;

			_main.layoutManager.removeChrome(_PANELBOX);
			_main.layoutManager.addChrome(_PANELBOX, {
				affectsStruts:   false,
				trackFullscreen: true
			});


			this.__old_tween = _MESSAGETRAY._tween;

			_MESSAGETRAY._tween = (actor, statevar, value, params) => {
				params.y += (_PANELBOX.y < 0 ? 0 : _PANELBOX.height);
				this.__old_tween.apply(_MESSAGETRAY, arguments);
			};


			this.hide('init');

			_mainloop.timeout_add(100, _ => {
				_bind_ui.call(this);
			});

		}

		destroy() {

			let signals = this._signals || null;
			if (signals !== null) {
				signals.destroy();
			}

			let old_tween = this.__old_tween || null;
			if (old_tween !== null) {
				_MESSAGETRAY._tween = old_tween;
				this.__old_tween    = null;
			}

			this.show('destroy');

			_main.layoutManager.removeChrome(_PANELBOX);
			_main.layoutManager.addChrome(_PANELBOX, {
				affectsStruts:   true,
				trackFullscreen: true
			});

		}

		show(trigger) {

			console.log('show(' + trigger + ')');

			if (this.__tweening === true) {
				_tweener.removeTweens(_PANELBOX, 'y');
				this.__tweening = false;
			}

			_PANELBOX.show();

			if (trigger === 'destroy') {

				_PANELBOX.y = this.__base_y;

			} else {

				this.__tweening = true;

				_tweener.addTween(_PANELBOX, {
					y:    this.__base_y,
					time: 0.5,
					transition: 'easeOutQuad',
					onComplete: () => {
						this.__tweening = false;
					}
				});

			}

		}

		hide(trigger) {

			console.log('hide(' + trigger + ')');


			let delta_y  = -1 * _PANELBOX.height;
			let anchor_y = _PANELBOX.get_anchor_point()[1];
			if (anchor_y < 0) {
				delta_y = -1 * delta_y;
			}

			if (this.__tweening === true) {
				_tweener.removeTweens(_PANELBOX, 'y');
				this.__tweening = false;
			}


			this.__tweening = true;

			_tweener.addTween(_PANELBOX, {
				y:    this.__base_y + delta_y,
				time: 0.5,
				transition: 'easeOutQuad',
				onComplete: _ => {

					this.__tweening = false;
					_PANELBOX.hide();

					let right_box = _main.panel._rightBox || null;
					if (right_box !== null) {
						right_box.emit('allocation-changed', right_box.get_allocation_box(), null);
					}

				}
			});

		}

	};



	/*
	 * EXPORTS
	 */

	PanelManager = _PanelManager;

})(typeof global !== 'undefined' ? global : this);

