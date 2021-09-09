sap.ui.define(
	[
		"zpmdocmedicio/controller/BaseController",
		"sap/ui/model/json/JSONModel"
	],
	function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("zpmdocmedicio.controller.App", {
			onInit: function () {

				this.iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.oAppModel = new JSONModel({
					busy: true,
					delay: 0
				});
				/*-------------------------------------------------------------------------*/

				this.setModel(this.oAppModel, "JMApp ");
				this.getOwnerComponent().getModel().metadataLoaded().then(this.setAppNotBusy());
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			},
			setAppNotBusy: function () {
				this.oAppModel.setProperty("/busy", false);
				this.oAppModel.setProperty("/delay", this.iOriginalBusyDelay);
			}
		});
	});