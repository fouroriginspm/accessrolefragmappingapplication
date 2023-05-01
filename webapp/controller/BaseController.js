sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
], function (Controller, UIComponent, mobileLibrary, JSONModel) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return Controller.extend("vndrmgmt.listpage.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        onShareEmailPress: function () {
            var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        },
        createJsonModel: function () {
            return new JSONModel;
        },
        getCookie: function (cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        setAccessToken: function () {
            var oConfigModel = this.getModel("oConfigModel");
            if (!oConfigModel) {
                this.setModel(new JSONModel(), "oConfigModel");
                oConfigModel = this.getModel("oConfigModel");
                oConfigModel.setData({});
            }
            var accessToken = this.getCookie("accessToken");
         var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMDAxLCJlbWFpbElkIjoia2VlLnN1ZUBmb3Vyb3JpZ2luLmNvbSIsImZpcnN0TmFtZSI6ImtlZSIsImxhc3ROYW1lIjoic3VlIiwidXNlclR5cGUiOiJDdXN0b21lciIsImlhdCI6MTY4Mjk1NTE4NSwiZXhwIjoxNjgyOTU4Nzg1fQ.LTih-Fxt-FSf2FS3nrJDgfYPWenJZ_za1xIWczAajqI";
            //Uncomment before DEPLOYMENT
            oConfigModel.setProperty("/Authorization", accessToken);
        }
    });

});