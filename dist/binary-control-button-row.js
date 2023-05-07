window.customCards = window.customCards || [];
window.customCards.push({
  type: "binary-control-button-row",
  name: "binary control button row",
  description: "A plugin to display your binary entity controls in a button row.",
  preview: false,
});

const LitElement = customElements.get("ha-panel-lovelace") ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace")) : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class CustomBinaryRow extends LitElement {

	constructor() {
		super();
		this._config = {
			customTheme: false,
			reverseButtons: false,
			width: '30px',
			height: '30px',
			isOnColor: '#43A047',
			isOffColor: '#f44c09',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customOnText: 'ON',

		};
	}

	static get properties() {
		return {
			hass: Object,
			_config: Object,
			_stateObj: Object,
			_width: String,
			_height: String,
			_leftColor: String,
			_leftText: String,
			_leftName: String,
			_leftState: Boolean,
			_rightColor: String,
			_rightText: String,
			_rightName: String,
			_rightState: Boolean,
		};
	}

	static get styles() {
		return css`
			:host {
				line-height: inherit;
			}
			.switch {
				margin-left: 2px;
				margin-right: 2px;
				background-color: #759aaa;
				border: 1px solid lightgrey; 
				border-radius: 4px;
				font-size: 10px !important;
				color: inherit;
				text-align: center;
				float: left !important;
				padding: 1px;
				cursor: pointer;
			}
		`;
	}

	render() {
		return html`
			<hui-generic-entity-row .hass="${this.hass}" .config="${this._config}">
				<div id='button-container' class='horizontal justified layout'>
					<button
						class='switch'
						style='${this._leftColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._leftName}"
						@click=${this.setState}
						.disabled=${this._leftState}>${this._leftText}</button>
					<button
						class='switch'
						style='${this._rightColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._rightName}"
						@click=${this.setState}
						.disabled=${this._rightState}>${this._rightText}</button>
				</div>
			</hui-generic-entity-row>
		`;
	}

	firstUpdated() {
		super.firstUpdated();
		this.shadowRoot.getElementById('button-container').addEventListener('click', (ev) => ev.stopPropagation());
	}

	setConfig(config) {
		this._config = { ...this._config, ...config };
	}

	updated(changedProperties) {
		if (changedProperties.has("hass")) {
			this.hassChanged();
		}
	}

	hassChanged(hass) {
		const config = this._config;
		const stateObj = this.hass.states[config.entity];
		const custTheme = config.customTheme;
		const revButtons = config.reverseButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const custOnClr = config.isOnColor;
		const custOffClr = config.isOffColor;
		const custInactiveClr = config.buttonInactiveColor;
		const custOffTxt = config.customOffText;
		const custOnTxt = config.customOnText;
			
		let state;
			if (stateObj) {
				state = stateObj.state;
			}
	
		let onstate;
		let offstate;
		
		if (stateObj) {
			if (stateObj.state == 'on') {
				onstate = 'on';
			} else {
				offstate = 'on';
			}
		}
	
		let oncolor;
		let offcolor;
			
		if (custTheme) {
			if (onstate == 'on') {
				oncolor = 'background-color:' + custOnClr;
			} else {
				oncolor = 'background-color:' + custInactiveClr;
			}

			if (offstate == 'on') {
				offcolor = 'background-color:'  + custOffClr;
			} else {
				offcolor = 'background-color:' + custInactiveClr;
			}
		} else {
			if (onstate == 'on') {
				oncolor = 'background-color: var(--primary-color)';
			} else {
				oncolor = 'background-color: var(--disabled-text-color)';
			}
	
			if (offstate == 'on') {
				offcolor = 'background-color: var(--primary-color)';
			} else {
				offcolor = 'background-color: var(--disabled-text-color)';
			}
		}
	
		let offtext = custOffTxt;
		let ontext = custOnTxt;
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
	
		let offname = 'off';
		let onname = 'on';
	
		if (revButtons) {
				this._stateObj = stateObj;
				this._rightState = stateObj.state === 'on';
				this._leftState = stateObj.state == 'off';
				this._width = buttonwidth;
				this._height = buttonheight;
				this._rightName = onname;
				this._leftName = offname;
				this._rightColor = oncolor;
				this._leftColor = offcolor;
				this._rightText = ontext;
				this._leftText = offtext;
		} else {
				this._stateObj = stateObj;
				this._leftState = stateObj.state === 'on';
				this._rightState = stateObj.state == 'off';
				this._width = buttonwidth;
				this._height = buttonheight;
				this._leftName = onname;
				this._rightName = offname;
				this._leftColor = oncolor;
				this._rightColor = offcolor;
				this._leftText = ontext;
				this._rightText = offtext;
		}
    }


	setState(e) {
		const state = e.currentTarget.getAttribute('name');
		if( state == 'off' ){
			this.hass.callService('homeassistant', 'turn_off', {entity_id: this._config.entity});
		} else {
			this.hass.callService('homeassistant', 'turn_on', {entity_id: this._config.entity});
		}
	}
}
	
customElements.define('binary-control-button-row', CustomBinaryRow);
