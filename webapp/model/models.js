sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },

        _fnCreateAccessPayLoad: function(){
            return {
              "SEQ_ID": "",
              "APPLNSEQID": "",
              "ROLE_ID": "",
              "FRAGMENT_ID": "",
              "PROPERTY": "",
              "REQUIRED": "",
              "EDITABLE": "",
              "PICKLIST": "",
              "VISIBLE": ""
              }
          },
        _fnUpdateAccessPayLoad: function(){
          return{
                "SEQ_ID" : 5,
                "APPLNSEQID": "7",
                "ROLE_ID": "RETAILER_ADMIN_RL",
                "FRAGMENT_ID": "UserCreationFragFilterBar",
                "PROPERTY": "Mobile",
                "REQUIRED": "false",
                "EDITABLE": "true",
                "PICKLIST": "false",
                "VISIBLE": "true"
            }
          }
        }
});