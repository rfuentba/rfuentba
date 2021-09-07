sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	],
	function (Controller, History) {
		"use strict";

		return Controller.extend("zpmdocmedicio.controller.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			
			// Instanciamos un Busy Dialog a nivel de aplicación para controlar los stops y starts de la misma
			busyDialog: new sap.m.BusyDialog(),
			
			// Abrimos el busy dialog
			openBusyDialog: function() {
				this.busyDialog.setBusyIndicatorDelay(0);
				this.busyDialog.open();
			},
			
			// Cerramos el busy dialog
			closeBusyDialog: function() {
				this.busyDialog.close();
			},
			
			getRouter: function () {
				return this.getOwnerComponent().getRouter();
			},
			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel: function (sName) {
				return this.getView().getModel(sName);
			},
			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel: function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},
			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle: function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
		});
	});