sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, ODataModel, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("com.app.library.controller.HomePage", {
            onInit: function () {
                var oModel = new ODataModel("/v2/BooksSrv/");
                this.getView().setModel(oModel);
                const oLocalModel = new JSONModel({
                    userName: "",
                    password: "",
                    email: "",
                    phoneNumber:"",
                    Address: "",
                    userType: "user",

                });
                this.getView().setModel(oLocalModel, "localModel");
            },

            onPressLogin: async function () {
                if (!this.loginDialog) {
                    this.loginDialog = await this.loadFragment("authenticate")
                }
                this.loginDialog.open();
            },
            oncancelbtn: function () {
                if (this.loginDialog.isOpen()) {
                    this.loginDialog.close()
                }
            },

           

            loginBtnClick: function () {

                var oView = this.getView();

                var sUsername = oView.byId("user").getValue();  //get input value data in oUser variable
                var sPassword = oView.byId("pswd").getValue();    //get input value data in oPwd variable

                if (!sUsername || !sPassword) {
                    MessageToast.show("please enter username and password.");
                    return
                }

                var oModel = this.getView().getModel();
                oModel.read("/Users", {
                    filters: [
                        new Filter("email", FilterOperator.EQ, sUsername),
                        new Filter("password", FilterOperator.EQ, sPassword)

                    ],
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            var userId = oData.results[0].ID;
                            var usertype = oData.results[0].userType;
                            MessageToast.show("Login Successful");
                            if (usertype === "user") {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteUserPage", { id: userId })
                            }
                            else {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteAdminPage", { id: userId })
                            }
                        } else {
                            MessageToast.show("Invalid username or password.")
                        }
                    }.bind(this),
                    error: function () {
                        MessageToast.show("An error occured during login.");
                    }
                })
            },
            onBtnSignup: async function () {
                if (!this.signupDialog) {
                    this.signupDialog = await this.loadFragment("signup")
                }
                this.signupDialog.open();
            },
            onsignupcancelbtn: function () {
                if (this.signupDialog.isOpen()) {
                    this.signupDialog.close()
                }
            },
            onClearFilterPress: function () {
                this.byId("user").setValue("");
                this.byId("pswd").setValue("");
              },
            AvailableBooksBtn: async function () {
                if (!this.libraryinfo) {
                    this.libraryinfo = await this.loadFragment("libraryinfo")
                }
                this.libraryinfo.open();
            },

            signupBtnClick: async function () {

                debugger
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                var phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
                if (!(emailRegex.test(oPayload.email) && phoneRegex.test(oPayload.phoneNumber))) {
                    MessageToast.show("please enter valid Email and PhoneNumber")
                    return
                }
                try {
                    await this.createData(oModel, oPayload, "/Users");
                    // this.getView().byId("idEmployeeTable").getBinding("items").refresh();
                    this.signupDialog.close();
                    MessageToast.show("SignUp Successful");
                } catch (error) {
                    MessageToast.show("User already exists.please enter the valid details")
                    // this.signupDialog.close();
                }
            },
            // Emali condition Check
            onEmailLiveChange: async function (oEvent) {
                var oEmail = oEvent.getSource();
                var oVal = oEmail.getValue();
                // Regular expression for validating email
                var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (oVal.trim() === '') {
                    oEmail.setValueState("None"); // Clear any previous state
                } else if (oVal.match(regexp)) {
                    oEmail.setValueState("Success");
                } else {
                    oEmail.setValueState("Error");
                    // Check if MessageToast is available before showing message
                    if (sap.m.MessageToast) {
                        sap.m.MessageToast.show("Invalid Email format");
                    } else {
                        console.error("MessageToast is not available.");
                    }
                }
            },
            onMobileVal: async function (oEvent) {
                var oPhone = oEvent.getSource();
                var oVal1 = oPhone.getValue();

                // regular expression for validating the phone
                var regexpMobile = /^[0-9]{10}$/;
                if (oVal1.trim() === '') {
                    oPhone.setValueState("None"); // Clear any previous state
                } else if (oVal1.match(regexpMobile)) {
                    oPhone.setValueState("Success");
                } else {
                    oPhone.setValueState("Error");
                    // Check if MessageToast is available before showing message
                    if (sap.m.MessageToast) {
                        sap.m.MessageToast.show("Invalid Phone format");
                    } 
                    else {
                    }
                }
            },
            clearInputs: function () {
                var oView = this.getView();
                oView.byId("user1").setValue("");
                oView.byId("password1").setValue("");
                oView.byId("email").setValue("");
                oView.byId("phoneNumber").setValue("");
                oView.byId("Address").setValue("");
            },
        });
    });
