sap.ui.define(
	[
		"sap/ui/base/Object",
		"sap/m/MessageBox"
	],
	function (UI5Object, MessageBox) {
		"use strict";

		return UI5Object.extend("zpmdocmedicio.controller.ErrorHandler", {

			/**
			 * Desde aqui nos encargaremos de mostrar todos los mensajes del BackEnd.
			 */
			constructor: function(oComponent) {
				this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
				this._oComponent = oComponent;
				this._oModel = oComponent.getModel();
				this._bMessageOpen = false;
				this._sErrorText = this._oResourceBundle.getText("Error.UnknownError");
				this._oModel.attachMetadataFailed(function(oEvent) {
					var oParams = oEvent.getParameters();
					this._showServiceError(oParams.response, oComponent);
				}, this);
				this._oModel.attachRequestFailed(function(oEvent) {
					var oParams = oEvent.getParameters();
					if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
							"Cannot POST") === 0)) {
						this._showServiceError(oParams.response, oComponent);
					}
				}, this);
			},
			/**
			 * Funcion para poder convertir un JSON a XML, y asi poder tratar todos los mensajes de error que lleguen desde el BackEnd.
			 */
			convertXmlToJSON: function(xml) {
				var obj = {};
				if (xml.nodeType === 1) {
					if (xml.attributes.length > 0) {
						obj["@attributes"] = {};
						for (var j = 0; j < xml.attributes.length; j++) {
							var attribute = xml.attributes.item(j);
							obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
						}
					}
				} else if (xml.nodeType === 3) {
					obj = xml.nodeValue;
				}
				if (xml.hasChildNodes()) {
					for (var i = 0; i < xml.childNodes.length; i++) {
						var item = xml.childNodes.item(i);
						var nodeName = item.nodeName;
						if (typeof(obj[nodeName]) === "undefined") {
							obj[nodeName] = this.convertXmlToJSON(item);
						} else {
							if (typeof(obj[nodeName].push) === "undefined") {
								var old = obj[nodeName];
								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(this.convertXmlToJSON(item));
						}
					}
				}
				return obj;
			},
			setServiceErrorFlag: function(fnCallback) {
				this._bServiceErrorOpen = true;
				this._fnCallback = fnCallback;
			},

			resetServiceErrorFlag: function() {

				this._bServiceErrorOpen = false;
				this._fnCallback = undefined;
			},
			/**
			 * Funcion que muestra los mensajes de error que llegan directamente del BackEnd, en caso de que hubiera algun error, 
			 * ya sea por conexion o campos del OData incorrectos e incluso las excepciones que se lanzan desde BackEnd.
			 */
			_showServiceError: function(sDetails) {
				// var vMen = new sap.ui.core.message.Message({code: "/IWBEP/CX_MGW_BUSI_EXCEPTION"});
				// sap.ui.getCore().getMessageManager().removeMessages(vMen);
				sap.ui.getCore().getMessageManager().removeAllMessages();
				if (this._bServiceErrorOpen) {
					this._fnCallback();
					return;
				}

				if (this._bMessageOpen) {
					return;
				}
				this._bMessageOpen = true;
				if (sDetails.responseText !== undefined) {
					var oError;
					try {
						oError = JSON.parse(sDetails.responseText);
					} catch (err) {
						var oParser = new DOMParser();
						var oXmlDoc = oParser.parseFromString(sDetails.responseText, "text/xml");
						var jsonText = JSON.stringify(this.convertXmlToJSON(oXmlDoc));
						oError = JSON.parse(jsonText);
					}
					var vMensaje;
					if (oError.error) {
						if (oError.error.message.value) {
							vMensaje = oError.error.message.value;
						} else {
							vMensaje = oError.error.message["#text"];
						}
					} else if (oError.html) {
						vMensaje = oError.html.body.h1["#text"];
					} else {
						vMensaje = "";
					}
				}
				if (!vMensaje) {
					vMensaje = this._sErrorText;
				}
				MessageBox.error(vMensaje, {
					id: "serviceErrorMessageBox",
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [this._oResourceBundle.getText("Login.Button.Close")],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				});
			}
		});
	});