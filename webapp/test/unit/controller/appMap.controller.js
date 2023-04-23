/*global QUnit*/

sap.ui.define([
	"accmap/controller/appMap.controller"
], function (Controller) {
	"use strict";

	QUnit.module("appMap Controller");

	QUnit.test("I should test the appMap controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
