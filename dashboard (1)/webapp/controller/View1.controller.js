function uploadToGoogleDrive(file) {
    debugger;
    gapi.load('client:auth2', function() {
        debugger;
      //  window.open('https://drive.google.com/drive/my-drive')
      gapi.auth2.init({
        client_id: '403459982587-1aiq8nnjbkeearr25inltul3bgm7oav7.apps.googleusercontent.com',
        scopes: [],
      }).then(function() {
        var file = new google.drive.files.File({
          name: 'myDrive.csv'
        });
  
        var reader = new FileReader();
        reader.onload = function() {
          var base64Data = reader.result.substring(reader.result.indexOf(',') + 1);
          var content = base64Data.replace(/\+/g, '-').replace(/\//g, '_');
  
          file.setContent(content);
  
          google.drive.files.create({
            resource: file,
            fields: 'id'
          }).then(function(response) {
            debugger
            console.log('File uploaded:', response.id);
          }).catch(function(error) {
            console.error('Error uploading file:', error);
          });
        };
  
        reader.readAsDataURL(file);
      }).catch(function(error) {
        console.error('Error initializing Google Drive API:', error);
      });
    });
  }
  
  // Trigger export and upload
  //var csvFile = this.getView().byId('PlantWiseTable_Id').files[0];
  var csvFile={
    "name":"ahmed",
    "age":20
  }
  uploadToGoogleDrive(csvFile);





sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, DateFormat, exportLibrary, Spreadsheet,ODataModel) {
        "use strict";
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("dashboard.controller.View1", {
            onInit: function () {
            
                var model = new sap.ui.model.json.JSONModel("model/data.json");
                this.getView().setModel(model, "list")
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd.MM.yyyy"
                });
                var xx = oDateFormat.format(new Date());
                this.getView().byId("date2").setNumber(xx);
                var vizframe1 = this.getView().byId("Vizframe1");
                var vizframe2 = this.getView().byId("Vizframe2");
                var vizframe3 = this.getView().byId("Vizframe3");
                var vizframe4 = this.getView().byId("Vizframe4");
                vizframe1.setVizProperties({
                    title: {
                        text: "Project Wise Collection"
                    },
                    plotArea: {
                        colorPalette: ["#F99417"],
                        drawingEffect: "glossy"
                    },
                    legendGroup: {
                        layout: {
                            position: "auto"
                        }
                    }
                })
                vizframe2.setVizProperties({
                    title: {
                        text: "Customer Wise Collection"
                    },
                    plotArea: {
                        colorPalette: ["#279EFF"],
                        drawingEffect: "glossy"
                    },
                    legendGroup: {
                        layout: {
                            position: "auto"
                        }
                    }
                })
                vizframe3.setVizProperties({
                    title: {
                        text: "Plant Wise Collection"
                    },
                    plotArea: {
                        colorPalette: ["#9400FF"],
                        drawingEffect: "glossy"
                    },
                    legendGroup: {
                        layout: {
                            position: "auto"
                        }
                    }
                })
                vizframe4.setVizProperties({
                    title: {
                        text: "Sales Wise Collection"
                    },
                    plotArea: {
                        colorPalette: ["#F94C10"],
                        drawingEffect: "glossy"
                    },
                    legendGroup: {
                        layout: {
                            position: "auto"
                        }
                    }
                })

            },
            firstContainerCPress: function (oEvent) {
                debugger;
                
                if (oEvent.getParameters().selectedItemId.split("container-dashboard---View1--").join("").includes("PlantWiseTable_Id")) {
                    this.getView().byId("PlantWise_excel0").setVisible(true);
                } else {
                    if (oEvent.getParameters().selectedItemId.split("container-dashboard---View1--").join("").includes("CustomerWiseTable_Id")) {
                        this.getView().byId("CustomerWise_excel").setVisible(true);
                    } else {
                        if (oEvent.getParameters().selectedItemId.split("container-dashboard---View1--").join("").includes("TableProject_Id")) {
                            this.getView().byId("ProjectWise_excel").setVisible(true);
                        } else {
                            if (oEvent.getParameters().selectedItemId.split("container-dashboard---View1--").join("").includes("TableSales_Id")) {
                                this.getView().byId("SalesWise_excel").setVisible(true);
                            } else {
                                this.getView().byId("SalesWise_excel").setVisible(false);
                            }

                            this.getView().byId("ProjectWise_excel").setVisible(false);
                        }
                        this.getView().byId("CustomerWise_excel").setVisible(false);
                    }
                    this.getView().byId("PlantWise_excel0").setVisible(false);
                }



            },
            SelectProjectPress: function (oEvent) {
                debugger;
                var ProjectValue = oEvent.getSource().getSelectedKey();
                var data = this.getView().byId("Vizframe3").getDataset();
                var table = this.getView().byId("TableProject_Id");
                var olist = table.getBinding("items")
                var ofilter = new sap.ui.model.Filter("Proj", sap.ui.model.FilterOperator.EQ, ProjectValue);
                var plist = data.getBinding("data");
                plist.filter(ofilter);
            },
            SelectSalesPress: function (oEvent) {
                debugger;
                var ProjectValue = oEvent.getSource().getSelectedKey();
                var data = this.getView().byId("Vizframe4").getDataset();
                var table = this.getView().byId("TableSales_Id");
                var olist = table.getBinding("items");
                var ofilter = new sap.ui.model.Filter("Sal", sap.ui.model.FilterOperator.EQ, ProjectValue);
                var plist = data.getBinding("data");
                plist.filter(ofilter);
                olist.filter(ofilter);

            },
            onExportPress: function (oEvent) {
                debugger;
                var fileContent = 'sample text'; // As a sample, upload a text file.
                var file = new Blob([fileContent], {type: 'text/plain'});
                var metadata = {
                    'name': 'sampleName', // Filename at Google Drive
                    'mimeType': 'text/plain', // mimeType at Google Drive
                    'parents': ["methodical-ace-405812"], // Folder ID at Google Drive
                };
                
                var accessToken = gapi.auth.getToken("https://oauth2.googleapis.com/token").access_token; // Here gapi is used for retrieving the access token.
                var form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                form.append('file', file);
                
                var xhr = new XMLHttpRequest();
                xhr.open('POST' ,'https://www.googleapis.com/upload/drive/v3/files');
                xhr.setRequestHeader('Authorization', 'Bearer ',accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    debugger
                    console.log(xhr.response.id); // Retrieve uploaded file ID.
                };
                xhr.send(form);


                var s = oEvent.getParameter("id").split("container-dashboard---View1--").join("");
                var arr = [{
                    la: "Plant Name",
                    pr: "palantName",
                    la2: "Collection Amount",
                    pr2: "Coll_Amount",
                    id: "PlantWiseTable_Id"
                }, {
                    la: "Customer Name",
                    pr: "customerName",
                    la2: "Collection Amount",
                    pr2: "CollAmount",
                    id:"CustomerWiseTable_Id"
                }, {
                    la: "Project Name",
                    pr: "ProjName",
                    la2: "Collection Amount",
                    pr2: "CollAmt",
                    id:"TableProject_Id"
                },{
                    la: "Project Name",
                    pr: "ProjName",
                    la2: "Collection Amount",
                    pr2: "CollAmt",
                    id:"TableSales_Id"
                }];
    
                var newarr=[]
               arr.forEach(function(ele){
                debugger;
                if(s==="PlantWise_excel0" && ele.la ==="Plant Name"){
                    newarr.push(ele)
                }else if(s==="CustomerWise_excel" && ele.la ==="Customer Name"){
                    newarr.push(ele);
                }else if(s ==="ProjectWise_excel" && ele.la ==="Project Name"){
                    newarr.push(ele);
                }else if(s ==="SalesWise_excel" && ele.la ==="Project Name"){
                    newarr.push(ele);
                }
               })

               this.CreateExcel(newarr[0]);

                // if (s === "PlantWise_excel0") {
                //     var data = {
                //         la: "Plant Name",
                //         pr: "palantName",
                //         la2: "Collection Amount",
                //         pr2: "Coll_Amount"
                //     }
                //     var 
                //    
                // }
                // if (s === "CustomerWise_excel") {
                //     var data = {
                //         la: "Customer Name",
                //         pr: "customerName",
                //         la2: "Collection Amount",
                //         pr2: "CollAmount"
                //     }
                //     var p = 
                //     this.CreateExcel(data, p)
                // }
                // if (s === "ProjectWise_excel") {
                //     var data = {
                //         la: "Project Name",
                //         pr: "ProjName",
                //         la2: "Collection Amount",
                //         pr2: "CollAmt"
                //     }
                //     var p = 
                //     this.CreateExcel(data, p)
                // }
                // if (s === "SalesWise_excel") {
                //     var data = {
                //         la: "Sales Name",
                //         pr: "SalName",
                //         la2: "Collection Amount",
                //         pr2: "CollAmt"
                //     }
                //     var p = 
                //     this.CreateExcel(data, p)
                // }


            },
            CreateExcel: function (odata) {
                debugger;
                var oRowBinding, oSettings, oSheet;
                var data = odata;
            
               var aCols = [];
                aCols.push({
                    label: data.la,
                    property: data.pr,
                    type: EdmType.String
                });
                aCols.push({
                    label: data.la2,
                    property: data.pr2,
                    type: EdmType.Number,
                    scale: 2,
                    delimiter: true
                });

                var otable = this.byId(data.id);

                oRowBinding = otable.getBinding('items');
                oSettings = {
                    workbook: {
                        columns: aCols
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export sample.xlsx',
                    worker: false
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function (odata) {
                    debugger;
                    oSheet.destroy();
                });
            }
        });
    });
