
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
