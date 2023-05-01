sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet",
    'sap/ui/export/library',
    'sap/ui/model/Sorter',
    "sap/m/Token",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/m/MessageBox",
    "../enums/xlsx.core.min",
    "../utils/configuration",
    "../utils/services"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, UIComponent, Filter, FilterOperator, Fragment, Spreadsheet, exportLibrary, Sorter, Token, Export, exportCSV, MessageBox, XLSXLib, Configuration, Services) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return BaseController.extend("accmap.controller.appMap", {
            onInit: function () {
                this.setAccessToken();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.AccessMappingModel = this.getOwnerComponent().getModel("appModel");
                this.AccessMappingModel.setProperty("/bEdit", false)
                this._fnGetAccessMap();
                this._fnGetAppDetails();

                var filterValueHelp = {
                    busy: false,
                    oUserTokens_appSeqID: [],
                    oUserTokens_roleID: [],
                    oUserTokens_FRAGMENTID: []
                    // aStatus: []
                }
               
                this.AccessMappingModel.setData(filterValueHelp);
            },

            _fnGetAccessMap: function () {
                var sUrl = Configuration.fnAppRoleFragAccMapp + Configuration.dbOperations.fetchURL;
                // Services._fnRead(sUrl, "GET", {}, function (response) {
                //     this.AccessMappingModel.setProperty("/items", response);

                // }.bind(this));

                var oConfigModel = this.getModel("oConfigModel");
                var headerRequest = {
                    "Authorization": oConfigModel.getProperty("/Authorization")
                }
                Services._fnRead(sUrl, "GET", {}, headerRequest, function (response, textStatus, xhr) {
                    debugger;
                    if (xhr.status === 200) {
                        this.AccessMappingModel.setProperty("/items", response);
                    } else {
                        MessageBox.error("");
                    }

                }.bind(this), function (response) {
                    // if(response.status === 403){
                    MessageBox.error(response.responseJSON.message);
                    // }
                });

            },

            _fnGetAppDetails: function () {
                var _URLForAppSeqID = "https://spusermgmt-wstkn7335q-as.a.run.app/admin/application-master";
                var _URLForRoleID = "https://spusermgmt-wstkn7335q-as.a.run.app/role";
                var _URLForFragmentID = "https://spusermgmt-zwjymjbxva-as.a.run.app/master/app-role-fragment";

                var aUrl = [_URLForAppSeqID, _URLForRoleID, _URLForFragmentID];

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

                $.ajax({
                    url: _URLForFragmentID,
                    type: "GET",
                    success: function (oData) {
                        this.AccessMappingModel.setProperty("/kitems", oData);

                    }.bind(this),
                    error: function (oError) {

                    }
                });
            },

            onSaveListItem: function (oEvent) {
                this.AccessMappingModel.setProperty("/bEdit", false);
                var sPath = oEvent.getSource().getBindingContext("appModel").getPath();
                var index = parseInt(sPath.split("/")[2]);
                var oSelectedObj = oEvent.getSource().getBindingContext("appModel").getObject();
                var seqID = oSelectedObj.SEQ_ID;

                var oTableItems = this.byId("idProductsTable").getItems();
                for (var i = 0; i < oTableItems.length; i++) {
                    if (oTableItems[i] === oTableItems[index]) {
                        var _isRequired = oTableItems[index].getCells()[4].getSelected().toString();
                        var _isEditable = oTableItems[index].getCells()[5].getSelected().toString();
                        var _isPicklist = oTableItems[index].getCells()[6].getSelected().toString();
                        var _isVisible = oTableItems[index].getCells()[7].getSelected().toString();
                        break;
                    }
                }
                var oPayload = {
                    "SEQ_ID": parseInt(oSelectedObj.SEQ_ID),
                    "APPLNSEQID": oSelectedObj.APPLNSEQID,
                    "ROLE_ID": oSelectedObj.ROLE_ID,
                    "FRAGMENT_ID": oSelectedObj.FRAGMENT_ID,
                    "PROPERTY": oSelectedObj.PROPERTY,
                    "REQUIRED": _isRequired,
                    "EDITABLE": _isEditable,
                    "PICKLIST": _isPicklist,
                    "VISIBLE": _isVisible
                };
                var sUrl = Configuration.fnAppRoleFragAccMapp + Configuration.dbOperations.editURL + `/${seqID}`;
                $.ajax({
                    url: sUrl,
                    type: "PATCH",
                    contentType: 'application/json',
                    dataType: "json",
                    data: JSON.stringify(oPayload),
                    success: function (result) {

                    }.bind(this),
                    error: function (error) {
                    }
                });

            },
            onResetListItem: function () {
                this.AccessMappingModel.setProperty("/bEdit", false);
                this.getView().byId("idProductsTable").getModel("appModel").refresh(true);
            },
            onEditListItem: function (oEvent) {
                this.AccessMappingModel.setProperty("/bEdit", true);
            },

            onDeleteListItem: function (oEvent) {
                var that = this;
                var oSelectedItem = oEvent.getSource().getBindingContext("appModel").getObject();
                var _SEQID = oSelectedItem.SEQ_ID;
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.show("Are you sure? This action is irreverisble", {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Warning",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            try {
                                var sUrl = Configuration.fnAppRoleFragAccMapp + Configuration.dbOperations.deleteURL + `/${_SEQID}`;
                                $.ajax({
                                    url: sUrl,
                                    type: "DELETE",
                                    success: function (oData) {
                                        that._fnGetAccessMap();
                                    },
                                    error: function (oError) {
                                    }
                                });

                            } catch (e) {
                            }
                        }
                    }
                });

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
                        label: 'ROLE_ID',
                        property: 'ROLE_ID',
                        type: EdmType.String
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
                    },
                    {
                        label: 'REQUIRED',
                        property: 'REQUIRED',
                        type: EdmType.String
                    },
                    {
                        label: 'EDITABLE',
                        property: 'EDITABLE',
                        type: EdmType.String
                    },
                    {
                        label: 'PICKLIST',
                        property: 'PICKLIST',
                        type: EdmType.String
                    },
                    {
                        label: 'VISIBLE',
                        property: 'VISIBLE',
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

                oBinding.sort(aSorters);
            },

            onUpload: function (oEvent) {
                var that = this;
                if (!that._oUploadDialog) {
                    that._pDialog = Fragment.load({
                        id: "dialogUpload",
                        name: "accmap.fragment.UploadFile",
                        controller: that
                    }).then(function (oDialog) {
                        that._oUploadDialog = oDialog;
                        that.getView().addDependent(that._oUploadDialog);
                    });
                } else {
                    that._oUploadDialog.open();
                }
                that._pDialog.then(function (oDialog) {
                    that._oUploadDialog.open();
                }.bind(that));
            },

            onCancelUpload: function (oEvent) {
                this._oUploadDialog.close();
            },

            OnSubmitUpload: function (oEvent) {
                var requestPayload = this.AccessMappingModel.getProperty("/uploadAccessFile");
                var sData = { "item": requestPayload };

                var sUrl = Configuration.fnAppRoleFragAccMapp + Configuration.dbOperations.massuploadURL;
                Services._fnPost(sUrl, "POST", sData, function (response, data) {
                    if (data == "success") {
                        this._oUploadDialog.close();
                        this._fnGetAccessMap();

                        var sMessage = "Data uploded successfully";
                        sap.m.MessageBox.success(sMessage, {
                            title: "Success",
                            styleClass: "",
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: sap.m.MessageBox.Action.OK,
                            initialFocus: null,
                            onClose: function (sAction) {
                                if (sAction === "OK") {

                                }

                            }
                        });
                    }
                }.bind(this));

            },

            handleUploadPress: function () {
                var oFileUploader = this.getView().byId("fileUploader"),
                    file = oFileUploader.oFileUpload.files[0];

                if (!oFileUploader.getValue()) {
                    MessageToast.show("Choose a file first");
                    return;
                }
                this.handleMassUpload(file);
            },

            handleTypeMissmatch: function (oEvent) {
                var aFileTypes = oEvent.getSource().getFileType();
                aFileTypes.map(function (sType) {
                    return "*." + sType;
                });
                MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                    " is not supported. Choose one of the following types: " +
                    aFileTypes.join(", "));
            },

            handleValueChange: function (oEvent) {
                MessageToast.show("Press 'Upload File' to upload file '" +
                    oEvent.getParameter("newValue") + "'");
            },
            onDeleteBtnClk: function (oEvent) {
                var that = this;
                var sPath = oEvent.getSource().getBindingContext("appModel").getPath().split("/")[2];
                var oTable = this.getView().getModel("appModel").getProperty("/items");
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.show("Are you sure? This action is irreverisble", {
                    icon: sap.m.MessageBox.Icon.WARNING,
                    title: "Warning",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            try {
                                oTable.splice(sPath, 1);
                                that.getView().getModel("appModel").refresh(true);

                            } catch (e) {
                                Log.error("Exception in Delete function");
                            }
                        }
                    }
                });

            },

            handleMassUpload: function (file, isVariant) {
                if (file && window.FileReader) {
                    var that = this;
                    var excelReader = (XLSX) ? XLSX : "";
                    // var bundle = this.localizationBundle;
                    var reader = new FileReader();
                    //handler for the load event
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var binary = "";
                        var bytes = new Uint8Array(data);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        var workbook = excelReader.read(binary, {
                            type: "binary",
                            cellDates: true,
                            cellStyles: true
                        });

                        try {
                            // that.showBusyIndicator();
                            if (workbook.SheetNames instanceof Array && workbook.SheetNames.length >= 1) {
                                var sheetName = "";
                                var excelData = {};
                                for (var s = 0; s < workbook.SheetNames.length; s++) {
                                    sheetName = workbook.SheetNames[s];
                                    sheetName = workbook.SheetNames[s];
                                    excelData = excelReader.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    break;
                                }
                                that.isMassUpload = false;
                                for (var a = 0; a < excelData.length; a++) {
                                    excelData[a].EDITABLE = excelData[a].EDITABLE.toLowerCase() === "true" ? true : false;
                                    excelData[a].PICKLIST = excelData[a].PICKLIST.toLowerCase() === "true" ? true : false;
                                    excelData[a].REQUIRED = excelData[a].REQUIRED.toLowerCase() === "true" ? true : false;
                                    excelData[a].VISIBLE = excelData[a].VISIBLE.toLowerCase() === "true" ? true : false;
                                }
                                that.getOwnerComponent().getModel("appModel").setProperty("/uploadAccessFile", excelData);
                                that.onUpload();
                            }
                        } catch (exc) {
                        }
                    };
                    reader.onerror = function (ex) {
                    };
                    reader.readAsArrayBuffer(file);
                }
            },
            //------------------------------------------value help for App Seq Id-----------------------------------------//
            onValueHelpRequestForAppSeqId: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    that = this;
                if (!this._appSeqIdDialog) {
                    this._appSeqIdDialog = Fragment.load({
                        id: oView.getId(),
                        name: "accmap.fragment.appSeqIdValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        that._appSeqIdDialog = oDialog;
                        // oDialog.setRememberSelections(true);
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                } else {
                    this._appSeqIdDialog.open();
                }
                this._appSeqIdDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },

            onValueHelpConfirmForAppSeqId: function (oEvent) {
                // var APPLNSEQID_Inp = this.byId("valueHelpFilterApplnseqId");
                // var aSelectedItems = oEvent.getParameter("selectedItems"),
                //     aSelectedObject = [];
                // if (aSelectedItems && aSelectedItems.length > 0) {
                //     aSelectedObject = aSelectedItems.map(function (oItem) {
                //         return oItem.getBindingContext("appModel").getObject();
                //     });
                // }
                // this.getView().getModel("appModel").setProperty("/oUserTokens", aSelectedObject);
                // oEvent.getSource().getBinding("items").filter([]);

                // if (!aSelectedItems) {
                //     return;
                // }

                var aSelectedItemsForAppSeqId = oEvent.getParameter("selectedItems");
                var aTokens = this.AccessMappingModel.getProperty("/oUserTokens_appSeqID");
                if (aSelectedItemsForAppSeqId && aSelectedItemsForAppSeqId.length > 0) {
                    for (var i = 0; i < aSelectedItemsForAppSeqId.length; i++) {
                        var _selectedObjForAppSeqId = aSelectedItemsForAppSeqId[i].getBindingContext("appModel").getObject();
                        aTokens.push(_selectedObjForAppSeqId);
                    }
                }
                this.AccessMappingModel.setProperty("/oUserTokens_appSeqID", aTokens);
            },

            //-----------------------------------------Valuehelp for ROLE_ID---------------------------------------------------//
            onValueHelpRequestForRoleId: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    that = this;
                if (!this._roleIdDialog) {
                    this._roleIdDialog = Fragment.load({
                        id: oView.getId(),
                        name: "accmap.fragment.roleIdValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        that._roleIdDialog = oDialog;
                        // oDialog.setRememberSelections(true);
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                } else {
                    this._roleIdDialog.open();
                }
                this._roleIdDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },

            onValueHelpConfirmForRoleId: function (oEvent) {
                // var aSelectedItems = oEvent.getParameter("selectedItems"),
                //     aSelectedObject = [];
                // if (aSelectedItems && aSelectedItems.length > 0) {
                //     aSelectedObject = aSelectedItems.map(function (oItem) {
                //         return oItem.getBindingContext("appModel").getObject();
                //     });
                // }
                // this.getView().getModel("appModel").setProperty("/oUserTokens", aSelectedObject);
                // oEvent.getSource().getBinding("items").filter([]);

                // if (!aSelectedItems) {
                //     return;
                // }

                var aSelectedItemsForRoleId = oEvent.getParameter("selectedItems");
                var aTokens = this.AccessMappingModel.getProperty("/oUserTokens_roleID");
                if (aSelectedItemsForRoleId && aSelectedItemsForRoleId.length > 0) {
                    for (var i = 0; i < aSelectedItemsForRoleId.length; i++) {
                        var _selectedObjForRoleId = aSelectedItemsForRoleId[i].getBindingContext("appModel").getObject();
                        aTokens.push(_selectedObjForRoleId);
                    }
                }
                this.AccessMappingModel.setProperty("/oUserTokens_roleID", aTokens);
            },
            //------------------------------------------Valuehelp for Fragment ID------------------------------------------------//

            onValueHelpRequestForFragmentId: function (oEvent) {

                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    that = this;
                if (!this._fragmentIdDialog) {
                    this._fragmentIdDialog = Fragment.load({
                        id: oView.getId(),
                        name: "accmap.fragment.fragmentIdValueHelp",
                        controller: this
                    }).then(function (oDialog) {
                        that._fragmentIdDialog = oDialog;
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                } else {
                    this._fragmentIdDialog.open();
                }
                this._fragmentIdDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },

            onValueHelpConfirmForFragmentId: function (oEvent) {
                var aSelectedItemsForFragmentId = oEvent.getParameter("selectedItems");
                var aTokens = this.AccessMappingModel.getProperty("/oUserTokens_FRAGMENTID");
                if (aSelectedItemsForFragmentId && aSelectedItemsForFragmentId.length > 0) {
                    for (var i = 0; i < aSelectedItemsForFragmentId.length; i++) {
                        var _selectedObjForFragmentId = aSelectedItemsForFragmentId[i].getBindingContext("appModel").getObject();
                        aTokens.push(_selectedObjForFragmentId);
                    }
                }
                this.AccessMappingModel.setProperty("/oUserTokens_FRAGMENTID", aTokens);
            },

            //------------------------------------------Search for all value help----------------------------------------------//

            onSearch: function () {
                var aFilter = [];
                var _confirmedItemAppSeqID = this.byId("valueHelpFilterApplnseqId").getTokens();
                var _confirmedItemRoleID = this.byId("valueHelpFilterRoleId").getTokens();
                var _confirmedItemFragmentID = this.byId("valueHelpFilterFragmentId").getTokens();

                if (_confirmedItemAppSeqID.length > 0) {
                    for (var i = 0; i < _confirmedItemAppSeqID.length; i++) {
                        var sQueryAppSeqID = _confirmedItemAppSeqID[i].getText();
                        if (sQueryAppSeqID) {
                            aFilter.push(new Filter("APPLNSEQID", FilterOperator.EQ, sQueryAppSeqID));
                        }
                    }
                }

                if (_confirmedItemRoleID.length > 0) {
                    for (var j = 0; j < _confirmedItemRoleID.length; j++) {
                        var sQueryRoleID = _confirmedItemRoleID[j].getText();
                        if (sQueryRoleID) {
                            aFilter.push(new Filter("ROLE_CODE", FilterOperator.EQ, sQueryRoleID));

                        }
                    }
                }

                if (_confirmedItemFragmentID.length > 0) {
                    for (var f = 0; f < _confirmedItemFragmentID.length; f++) {
                        var sQueryFragmentID = _confirmedItemFragmentID[f].getText();
                        if (sQueryFragmentID) {
                            aFilter.push(new Filter("FRAGMENT_ID", FilterOperator.EQ, sQueryFragmentID));

                        }
                    }
                }

                var oList = this.byId("idProductsTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);
            },

            // _fnCreateFilters: function () {
            //     var aFilters = [], aKey = [],
            //         oViewoverview = this.getView().getModel("appModel");
            //     if (this.getView().getModel("appModel").getProperty("/oUserTokens_appSeqID").length !== 0) {
            //         aKey = this.getView().getModel("appModel").getProperty("/oUserTokens_appSeqID");
            //         this._fnCreateComboFilter(aFilters, aKey, "APPLNSEQID");
            //         aKey = [];
            //     }

            //     if (this.getView().getModel("appModel").getProperty("/oUserTokens_roleID").length !== 0) {
            //         aKey = this.getView().getModel("appModel").getProperty("/oUserTokens_roleID");
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
            //     }
            //     else if (sOdataProp !== "ROLE_ID") {
            //         jQuery.each(aKeys, function (i) {
            //             aFilter.push(new Filter(sOdataProp, FilterOperator.Contains, aKeys[i]));
            //         });
            //     }
            //     else {
            //         jQuery.each(aKeys, function (i) {
            //             aFilter.push(new Filter(sOdataProp, FilterOperator.EQ, aKeys[i].APPLNSEQID));
            //             aFilter.push(new Filter(sOdataProp, FilterOperator.EQ, aKeys[i].ROLE_ID));
            //         });
            //     }
            //     aFilters.push(new Filter(aFilter, false));
            //     return aFilters;
            // },

            onClear: function (oEvent) {
                this.byId("valueHelpFilterApplnseqId").setValue("");
                this.byId("valueHelpFilterRoleId").setValue("");
                this.byId("valueHelpFilterFragmentId").setValue("");

                this.AccessMappingModel.setProperty("/oUserTokens_appSeqID", []);
                this.AccessMappingModel.setProperty("/oUserTokens_roleID", []);
                this.AccessMappingModel.setProperty("/oUserTokens_FRAGMENTID", []);
                
                this.onSearch();
            },

        });
    });
