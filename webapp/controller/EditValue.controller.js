sap.ui.define([
	"./BaseController"
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("accmap.controller.EditValue", {
        /**
         * @override
         */
        onInit: function() {
            this.setAccessToken();
            this.oRouter = this.getOwnerComponent().getRouter();
            this.AccessMappingModel = this.getOwnerComponent().getModel("appModel");
            this._fnInitialSetModel();
        
        },
        onAfterRendering: function() {
        
        },

        _fnInitialSetModel: function () {
            var absolutePath = "https://spusermgmt-wstkn7335q-as.a.run.app";
            var relativePath = "/admin/application-role-frg-mapping/5";
            var eUrl = absolutePath + relativePath;

            $.ajax({
                url: eUrl,
                type: "PATCH",
                success: function (oData) {
                    this.AccessMappingModel.setProperty("/editems",oData);
                  
                }.bind(this),
                error: function (oError) {

                }
            });
        },



        onCancel: function(){
            this.oRouter.navTo("RouteappMap")
        },
        onSubmit: function(){
            var result = confirm("Do you want to Submit");
            if(result == true){
                alert("Submitted");
            }else{
                alert("Not Submitted");
            }
        }
	});
});