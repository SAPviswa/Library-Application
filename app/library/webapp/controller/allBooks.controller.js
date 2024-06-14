// sap.ui.define(
//     [
//         "./BaseController",
       
//         "sap/ui/model/json/JSONModel",
//         "sap/ui/model/Filter",
//         "sap/ui/model/FilterOperator",
//        "sap/m/MessageBox",
//        "sap/m/Token"
//     ],
//     function(Controller,JSONModel,Filter,FilterOperator,MessageBox,Token) {
//       "use strict";
  
//       return Controller.extend("com.app.library.controller.allBooks", {
//         onInit: function() {
//             const oRouter = this.getOwnerComponent().getRouter();
//           oRouter.attachRoutePatternMatched(this.onUserDetailsLoad,this);
     
//           const oView1 = this.getView();
//           const oMulti1 = oView1.byId("idTitleFilterValue");
//           const oMulti2 = oView1.byId("idAuthorFilterValue");
//           const oMulti3 = oView1.byId("idGenreFilterValue");
//           const oMulti4 = oView1.byId("idISBNFilterValue");

//           let validate = function (arg) {
//               if (true) {
//                   var text = arg.text;
//                   return new Token({ key: text, text: text });
//               }
//           };
//           oMulti1.addValidator(validate);
//           oMulti2.addValidator(validate);
//           oMulti3.addValidator(validate);
//           oMulti4.addValidator(validate);
//         },
//         onUserDetailsLoad:function(oEvent){
//             const{id}=oEvent.getParameter("arguments");
//             this.ID=id;
//             //const sRouterName=oEvent.getParameter("name");
//             const oObjectPage=this.getView().byId("idUserPage");
 
//             oObjectPage.bindElement(`/Users(${id})`);
//         },
//         onGoPress: function () {
//           const oView = this.getView(),

//               titleFilter = oView.byId("idTitleFilterValue"),
//               stitle = titleFilter.getTokens(),

//               authorFilter = oView.byId("idAuthorFilterValue"),
//               sauthor = authorFilter.getTokens(),

//               genreFilter = oView.byId("idGenreFilterValue"),
//               sgenre = genreFilter.getTokens(),

//               ISBNFilter = oView.byId("idISBNFilterValue"),
//               sISBN = ISBNFilter.getTokens(),

//               Table = oView.byId("idAllBookTable"),
//               aFilters = [];

//           sISBN.filter((ele) => {
//               ele ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey())) : "";
//           });

//           sgenre.filter((ele) => {
//               ele ? aFilters.push(new Filter("genre", FilterOperator.EQ, ele.getKey())) : "";
//           });
//           stitle.filter((ele) => {
//               ele ? aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey())) : "";
//           })
//           sauthor.filter((ele) => {
//               ele ? aFilters.push(new Filter("author", FilterOperator.EQ, ele.getKey())) : "";
//           })


//           Table.getBinding("items").filter(aFilters);

//       },
//       onClearFilterPress: function () {
//           const view = this.getView(),
//               clearTitle = view.byId("idTitleFilterValue"),
//               stitle = clearTitle.removeAllTokens(),
//           clearauthor = view.byId("idAuthorFilterValue"),
//               sAuthor = clearauthor.removeAllTokens(),
//           cleargenre = view.byId("idGenreFilterValue"),
//               sgenre = cleargenre.removeAllTokens(),
//           clearISBN = view.byId("idISBNFilterValue"),
//               sISBN = clearISBN.removeAllTokens()
//       },
//       setHeaderContext: function () {
//         var oView = this.getView();
//         oView.byId("Bookstitle").setBindingContext(
//             oView.byId("_IDGenTable1").getBinding("items").getHeaderContext());
//     },
//     onReservePress:async function(oEvent){
      
//             var oSelectedItem = oEvent.getSource();

//             // var oSelectedUser = oSelectedItem.getBindingContext().getObject();
//             console.log(oEvent.getSource().getParent())
//             var userId=this.ID
//             if(this.byId("idAllBookTable").getSelectedItems().length>1){
//                 MessageToast.show("Please Select only one Book");
//                 return
//             }
//             var oSelectedBook=this.byId("idAllBookTable").getSelectedItem().getBindingContext().getObject()
//             console.log(oSelectedBook)
            
//              var oQuantity=oSelectedBook.availability-1;
//                             console.log(oQuantity)
//             const userModel = new sap.ui.model.json.JSONModel({
//                 user_ID : userId,
//                 book_ID: oSelectedBook.ID,
//                 reservedDate: new Date(),
//                 book:{
//                     availability:oQuantity
//                 }
//             });
//             this.getView().setModel(userModel, "userModel");
        
//             const oPayload = this.getView().getModel("userModel").getProperty("/"),
//                 oModel = this.getView().getModel("ModelV2");
        
//             try {
//                 await this.createData(oModel, oPayload, "/IssueBooks");
//                 sap.m.MessageBox.success("Book Reserved");
//                 //this.getView().byId("idIssueBooks").getBinding("items").refresh();
//                 //this.oCreateBooksDialog.close();
//                 // oModel.update("/Books(" + oSelectedBook.ID + ")", oPayload.book, {
//                 //     success: function() {
//                 //         this.getView().byId("idBooksTable").getBinding("items").refresh();
//                 //         //this.oEditBooksDialog.close();
//                 //     }.bind(this),
//                 //     error: function(oError) {
//                 //         //this.oEditBooksDialog.close();
//                 //         sap.m.MessageBox.error("Failed to update book: " + oError.message);
//                 //     }.bind(this)
//                 // });

//             } catch (error) {
//                 //this.oCreateBooksDialog.close();
//                 sap.m.MessageBox.error("Some technical Issue");
//             }
           
//     },
//     // logout:function(){
//     //           var oRouter=this.getOwnerComponent().getRouter();
//     //           oRouter.navTo("RouteHomePage",{},true);
//     //   }
//       });
//     });
sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    function(Controller, JSONModel, MessageBox) {
        "use strict";
  
        return Controller.extend("com.app.library.controller.allBooks", {
            onInit: function() {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);
            },

            onUserDetailsLoad: function(oEvent) {
                const { id } = oEvent.getParameter("arguments");
                this.ID = id;
                const oObjectPage = this.getView().byId("idUserPage");
                oObjectPage.bindElement(`/Users(${id})`);
            },

            setHeaderContext: function() {
                var oView = this.getView();
                oView.byId("Bookstitle").setBindingContext(
                    oView.byId("_IDGenTable1").getBinding("items").getHeaderContext()
                );
            },
            onSearch: function (oEvent) {
                // Get the search query
                var sQuery = oEvent.getParameter("query");
        
                // Build filters based on the search query
                var aFilters = [];
                if (sQuery) {
                    aFilters.push(new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("author", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("genre", sap.ui.model.FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    }));
                }
                // Get the table and binding
                var oTable = this.byId("idAllBookTable");
                var oBinding = oTable.getBinding("items");
                // Apply the filters to the binding
                oBinding.filter(aFilters);
            },
            onReservePress: async function(oEvent) {
                var oSelectedItem = oEvent.getSource();
                var userId = this.ID;

                if (this.byId("idAllBookTable").getSelectedItems().length > 1) {
                    MessageToast.show("Please Select only one Book");
                    return;
                }

                var oSelectedBook = this.byId("idAllBookTable").getSelectedItem().getBindingContext().getObject();
                var oQuantity = oSelectedBook.availability - 1;

                const userModel = new sap.ui.model.json.JSONModel({
                    user_ID: userId,
                    book_ID: oSelectedBook.ID,
                    reservedDate: new Date(),
                    book: {
                        availability: oQuantity
                    }
                });
                this.getView().setModel(userModel, "userModel");

                const oPayload = this.getView().getModel("userModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");

                try {
                    await this.createData(oModel, oPayload, "/IssueBooks");
                    sap.m.MessageBox.success("You reserved a title.");
                } catch (error) {
                    sap.m.MessageBox.error("Some technical Issue");
                }
            }
        });
    }
);
