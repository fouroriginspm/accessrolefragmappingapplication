sap.ui.define([
	"sap/base/Log"
], function(Log) {
	"use strict";
	return {
		fnAppRoleFragAccMapp: "https://spusermgmt-zwjymjbxva-as.a.run.app",
		dbOperations:{
            "fetchURL": "/admin/application-role-frg-mapping",
			"massuploadURL": "/admin/application-role-frg-mapping/mass-upload",
		    "editURL":"/admin/application-role-frg-mapping",
			"deleteURL":"/admin/application-role-frg-mapping"
			
        }
		
	};
}, true);