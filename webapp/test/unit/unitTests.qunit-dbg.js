/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zpm_doc_medicio/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
