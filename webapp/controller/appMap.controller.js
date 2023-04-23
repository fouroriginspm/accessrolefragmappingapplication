sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    'sap/ui/export/library',
    'sap/ui/model/Sorter',
    "sap/m/Token"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, UIComponent, Filter, FilterOperator, Fragment, Spreadsheet, exportLibrary, Sorter, Token) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("accmap.controller.appMap", {
            onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                this.AccessMappingModel = this.getOwnerComponent().getModel("appModel");
                this.AccessMappingModel.setProperty("/bEdit",false)
                this._fnInitialSetModel();
                this._fnGetUsersList()
                this._fnAccMapGetData()
            },
            onSaveListItem: function(){
                this.AccessMappingModel.setProperty("/bEdit",false)
            },
            onResetListItem: function(){
                this.AccessMappingModel.setProperty("/bEdit",false)
            },
            onEditListItem: function (oEvent) {
                debugger;
                this.AccessMappingModel.setProperty("/bEdit",true)
                // var sPath = oEvent.getSource().getBindingContext("appModel").getPath();
                // var index = parseInt(sPath.split("/")[2]);
                // var _selectedListItem = this.byId("idProductsTable").getItems();
                // for (var i = 0; i < _selectedListItem.length; i++) {
                //     if (_selectedListItem[i] === _selectedListItem[index]) {
                //         for (var j = 4; j < _selectedListItem[i].getCells().length - 1; j++) {
                //             _selectedListItem[i].getCells()[j].setEnabled(true);
                //         }
                //     } else {
                //         _selectedListItem[i].getCells()[4].setEnabled(false);
                //         _selectedListItem[i].getCells()[5].setEnabled(false);
                //         _selectedListItem[i].getCells()[6].setEnabled(false);
                //         _selectedListItem[i].getCells()[7].setEnabled(false);
                //     }
                // }
                // this.oRouter.navTo("EditValue");
            },

            _fnGetUsersList: function () {
                debugger;
                var absolutePath = "https://spusermgmt-wstkn7335q-as.a.run.app";
                var relativePath = "/admin/application-role-frg-mapping";
                var sUrl = absolutePath + relativePath;

                $.ajax({
                    url: sUrl,
                    type: "GET",
                    success: function (oData) {
                        this.AccessMappingModel.setProperty("/items", oData);

                    }.bind(this),
                    error: function (oError) {

                    }
                });
            },

            _fnAccMapGetData: function () {
                var _URLForAppSeqID = "https://spusermgmt-wstkn7335q-as.a.run.app/admin/application-master";
                var _URLForRoleID = "https://spusermgmt-wstkn7335q-as.a.run.app/role";
                //var _URLForMassUpload = "https://spusermgmt-wstkn7335q-as.a.run.app/admin/application-role-frg-mapping/mass-upload" 

                var aUrl = [_URLForAppSeqID, _URLForRoleID];

                $.ajax({
                    url: _URLForAppSeqID,
                    type: "GET",
                    success: function (oData) {
                        this.AccessMappingModel.setProperty("/fitems", oData);

                    }.bind(this),
                    error: function (oError) {

                    }
                });

                $.ajax({
                    url: _URLForRoleID,
                    type: "GET",
                    success: function (oData) {
                        this.AccessMappingModel.setProperty("/ritems", oData);

                    }.bind(this),
                    error: function (oError) {

                    }
                });
            },

            _fnInitialSetModel: function () {
                debugger;
                var absolutePath = "https://spusermgmt-wstkn7335q-as.a.run.app";
                var relativePath = "/admin/application-role-frg-mapping/5";
                var eUrl = absolutePath + relativePath;

                $.ajax({
                    url: eUrl,
                    type: "PATCH",
                    success: function (oData) {
                        this.AccessMappingModel.setProperty("/editems", oData);

                    }.bind(this),
                    error: function (oError) {

                    }
                });
            },

            // onValueHelpAPPLNSEQID: function (oEvent) {
            //     if (!this._appSeqID) {
            //         this._appSeqID = sap.ui.xmlfragment("accmap.fragment.AppSeqIDValueHelp", this);
            //         this.getView().addDependent(this._appSeqID);

            //         this._appSeqID.open();
            //     } else {

            //         this._appSeqID.open();
            //     }
            // },


            // onSearch: function () {
            //     var aFilters = this._fnCreateFilters();
            //     this.getView().byId("idProductsTable").getBinding("items").filter(aFilters, "Application");
            // },
            // _fnCreateFilters: function () {
            //     var aFilters = [], aKey = []
            //     if (this.getView().getModel("oViewModel").getProperty("/oUserTokens").length !== 0) {
            //         aKey = this.getView().getModel("oViewModel").getProperty("/oUserTokens");
            //         this._fnCreateComboFilter(aFilters, aKey, "APPLNSEQID");
            //         aKey = [];
            //     }
            //     if (this.getView().getModel("oViewModel").getProperty("/oUserTokens").length !== 0) {
            //         aKey = this.getView().getModel("oViewModel").getProperty("/oUserTokens");
            //         this._fnCreateComboFilter(aFilters, aKey, "ROLE_ID");
            //         aKey = [];
            //     }
            //     return aFilters;
            // },
            // _fnCreateComboFilter: function (aFilters, aKeys, sOdataProp) {
            //     var aFilter = [];
            //     if (sOdataProp !== "APPLNSEQID") {
            //         jQuery.each(aKeys, function (i) {
            //             aFilter.push(new Filter(sOdataProp, FilterOperator.Contains, aKeys[i]));
            //         });
            //     } else {
            //         jQuery.each(aKeys, function (i) {
            //             aFilter.push(new Filter(sOdataProp, FilterOperator.EQ, aKeys[i].APPLNSEQID));
            //         });
            //     }
            //     aFilters.push(new Filter(aFilter, false));
            //     return aFilters;
            // },

            onSearch: function (oEvent) {
                debugger;
                var aFilter = [];
                var sQuery = oEvent.getParameter("_appSeqID");
                if (sQuery) {
                    aFilter.push(new Filter("APPLNSEQID", FilterOperator.Contains, sQuery));
                }

                // filter binding
                var oList = this.byId("idProductsTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);
            },

            onClear: function () {
                var aTokens = []
                var appSeqID_Inp = this.byId("InpFilBarAPPLNSEQID");
                var roleID_Inp = this.byId("InpFilBarROLE_ID");
                appSeqID_Inp.setTokens(aTokens);
                roleID_Inp.setTokens(aTokens);
            },

            onValueHelpAPPLNSEQID: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    that = this;
                if (!this._appSeqID) {
                    this._appSeqID = Fragment.load({
                        id: oView.getId(),
                        name: "accmap.fragment.AppSeqIDValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        that._appSeqID = oDialog;
                        oDialog.setRememberSelections(false);
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                } else {
                    this._appSeqID.open();
                }
                this._appSeqID.then(function (oDialog) {
                    // Create a filter for the binding
                    // oDialog.getBinding("items").filter([new Filter("APPLNSEQID", FilterOperator.EQ, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open();
                });
            },

            onAppSeqIDValueHelpRequest: function (oEvent) {
                debugger;
                var appSeqID_Inp = this.byId("InpFilBarAPPLNSEQID");
                var oSelectedItem = oEvent.getParameter("selectedItems");
                if (oSelectedItem && oSelectedItem.length > 0) {
                    for (var i = 0; i < oSelectedItem.length; i++) {
                        appSeqID_Inp.addToken(new Token({
                            text: oSelectedItem[i].getTitle()
                        }))
                    }
                }
                // var aSelectedItems = oEvent.getParameter("selectedItems"),
                //     aSelectedObject = [];
                // if (aSelectedItems && aSelectedItems.length > 0) {
                //     aSelectedObject = aSelectedItems.map(function (oItem) {
                //         return oItem.getBindingContext("appModel").getObject();
                //     });
                // }
                // this.getView().getModel("oViewModel").setProperty("/oUserTokens", aSelectedObject);
                // oEvent.getSource().getBinding("items").filter([]);

                // if (!aSelectedItems) {
                //     return;
                // }

                // this.getView().byId("userInput").setValue(aSelectedItems.getTitle());
            },

            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = [new Filter("APPLNSEQID", FilterOperator.EQ, sValue),
                new Filter("APP_NAME", FilterOperator.Contains, sValue)];
                oEvent.getSource().getBinding("items").filter(new Filter(oFilter, false), "Application");
            },

            onValueHelpROLE_ID: function (oEvent) {
                var rInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    that = this;
                if (!this._roleID) {
                    this._roleID = Fragment.load({
                        id: oView.getId(),
                        name: "accmap.fragment.RoleIDValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        that._roleID = oDialog;
                        oDialog.setRememberSelections(false);
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                } else {
                    this._roleID.open();
                }
                this._roleID.then(function (oDialog) {
                    // Create a filter for the binding
                    // oDialog.getBinding("items").filter([new Filter("APPLNSEQID", FilterOperator.EQ, sInputValue)]);
                    // Open ValueHelpDialog filtered by the input's value
                    oDialog.open();
                });
            },

            onRoleIDValueHelpRequest: function (oEvent) {
                debugger;
                var roleID_Inp = this.byId("InpFilBarROLE_ID");
                var oSelectedItem = oEvent.getParameter("selectedItems");
                if (oSelectedItem && oSelectedItem.length > 0) {
                    for (var i = 0; i < oSelectedItem.length; i++) {
                        roleID_Inp.addToken(new Token({
                            text: oSelectedItem[i].getTitle()
                        }))
                    }
                }

            },

            onValueHelpSearchforRoleID: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = [new Filter("ROLE_ID", FilterOperator.EQ, sValue),
                new Filter("ROLE_CODE", FilterOperator.Contains, sValue)];
                oEvent.getSource().getBinding("items").filter(new Filter(oFilter, false), "Application");
            },







            onDownload: function (oEvent) {

                var aCols, aUsers, oSettings, oSheet;
                aCols = this.createColumnConfig();
                aUsers = this.getView().getModel("appModel").getProperty('/items');

                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: aUsers,
                    fileName: "AccMapping"
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {
                        MessageToast.show('Spreadsheet export has finished');
                    })
                    .finally(oSheet.destroy);
            },

            createColumnConfig: function () {
                return [
                    {
                        label: 'APPLNSEQID',
                        property: 'APPLNSEQID',
                        type: EdmType.Number,
                        scale: 0
                    },
                    {
                        label: 'SEQ_ID',
                        property: 'SEQ_ID',
                        type: EdmType.Number,
                        scale: 0
                    },
                    {
                        label: 'ROLE_ID',
                        property: 'ROLE_ID',
                        type: EdmType.Number,
                        scale: 0
                    },
                    {
                        label: 'FRAGMENT_ID',
                        property: 'FRAGMENT_ID',
                        type: EdmType.String
                    },
                    {
                        label: 'PROPERTY',
                        property: 'PROPERTY',
                        type: EdmType.String
                    }];
            },


            onSort: function (oEvent) {
                var that = this;
                that.oMainKey = oEvent.getSource();
                if (!that._oSortF4) {
                    that._SortDialog = sap.ui.core.Fragment.load({
                        id: that.createId("_SortF4"),
                        name: "accmap.fragment.Sort",
                        controller: that
                    }).then(function (oDialog) {
                        that._oSortF4 = oDialog;
                        that.getView().addDependent(that._oSortF4);
                    });
                }
                that._SortDialog.then(function (oDialog) {
                    that._oSortF4.open();
                }.bind(this));
            },
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.getView().byId("idProductsTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },


        });
    });
