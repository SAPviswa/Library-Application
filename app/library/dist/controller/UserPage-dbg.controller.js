
sap.ui.define([
    "./BaseController",

], function(Controller) {
    "use strict";

    return Controller.extend("com.app.library.controller.UserPage", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onUserDetailsLoad, this);
        },

        onUserDetailsLoad: function(oEvent) {
            const { id } = oEvent.getParameter("arguments");
            this.ID = id;
            const oObjectPage = this.getView().byId("idUserPage");

            if (oObjectPage) {
                oObjectPage.bindElement(`/Users(${id})`);
            } else {
                console.error("Object page not found");
            }
        },

        onProfilePress: function () {
            this.loadProfileDialog().then(function (oDialog) {
                var oViewModel = this.getView().getModel();
                oDialog.setModel(oViewModel);
                oDialog.bindElement(`/Users(${this.ID})`);
                oDialog.open();
            }.bind(this));
        },

        loadProfileDialog: async function () {
            if (!this.oDialogProfile) {
                this.oDialogProfile = await this.loadFragment("Userdetails");
            }
            return this.oDialogProfile;
        },

        onCloseProfile: function () {
            if (this.oDialogProfile) {
                this.oDialogProfile.close();
            }
        },

        // Formatter function for phone number formatting
        formatPhoneNumber: function(phoneNumber) {
            // Remove commas from the phone number string
            if (typeof phoneNumber === "string") {
                return phoneNumber.replace(/,/g, "");
            }
            return phoneNumber;
        },

        onAllBooksFilterPress: function(oEvent) {
            var userId = oEvent.getSource().getParent().getBindingContext().getObject().ID;
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteallBooksPage", {
                id: userId
            });
        },

        onNotificationFilterPress: async function() {
            if (!this.notificationDialog) {
                this.notificationDialog = await this.loadFragment("notifications");
            }
            this.notificationDialog.open();
            const oObjectPage = this.getView().byId("idnotifyDialog");
            if (oObjectPage) {
                oObjectPage.bindElement(`/Users(${this.ID})`);
            } else {
            }
        },
        
        onCloseDialog: function() {
            if (this.notificationDialog.isOpen()) {
                this.notificationDialog.close();
            }
        },

        onLogoutPress: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteHomePage", {}, true);
        }
    });
});
