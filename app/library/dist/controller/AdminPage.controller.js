sap.ui.define(["./BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/m/MessageBox","sap/m/Token","sap/m/MessageToast","sap/ui/core/Fragment","sap/ui/export/library","sap/ui/export/Spreadsheet"],function(e,t,i,o,s,a,n,l,r,g){"use strict";var u=r.EdmType;return e.extend("com.app.library.controller.AdminPage",{onInit:function(){this.oQuantity=null;this.oAq=null;const e=this.getOwnerComponent().getRouter();e.attachRoutePatternMatched(this.onUserDetailsLoad,this);const t=new o({ISBN:"",title:"",quantity:"",author:"",genre:"",availability:"",language:""});this.getView().setModel(t,"localModel");this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onBookListLoad,this)},createColumnConfig:function(){return[{label:"ISBN",property:"ISBN",type:u.String},{label:"Title",property:"title",type:u.String},{label:"Quantity",property:"quantity",type:u.Number,scale:0},{label:"Author",property:"author",type:u.String},{label:"Genre",property:"genre",type:u.String},{label:"Availability",property:"availability",type:u.Number,scale:0},{label:"Language",property:"language",type:u.String}]},onExport:function(){var e,t,i,o,s;s=this.byId("idBookTable");t=s.getBinding("items");e=this.createColumnConfig();i={workbook:{columns:e},dataSource:t,fileName:"Books.xlsx"};o=new g(i);o.build().then(function(){n.show("Spreadsheet export has finished")}).finally(function(){o.destroy()})},setHeaderContext:function(){var e=this.getView();e.byId("Bookstitle").setBindingContext(e.byId("_IDGenTable1").getBinding("items").getHeaderContext())},onBookListLoad:function(){this.getView().byId("idBookTable").getBinding("items").refresh()},onUserDetailsLoad:function(e){const{id:t}=e.getParameter("arguments");this.ID=t;const i=this.getView().byId("idBooksListPage");i.bindElement(`/Users(${t})`)},onProfilePress:function(){this.loadProfileDialog().then(function(e){var t=this.getView().getModel();e.setModel(t);e.bindElement(`/Users(${this.ID})`);e.open()}.bind(this))},loadProfileDialog:async function(){if(!this.oDialogProfile){this.oDialogProfile=await this.loadFragment("Admindetails")}return this.oDialogProfile},onCloseProfile:function(){if(this.oDialogProfile){this.oDialogProfile.close()}},formatPhoneNumber:function(e){if(typeof e==="string"){return e.replace(/,/g,"")}return e},onSearch:function(e){var t=e.getParameter("query");var i=[];if(t){if(!isNaN(t)){i.push(new sap.ui.model.Filter({filters:[new sap.ui.model.Filter("title",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("author",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("genre",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("quantity",sap.ui.model.FilterOperator.EQ,parseInt(t,10)),new sap.ui.model.Filter("availability",sap.ui.model.FilterOperator.EQ,parseInt(t,10))],and:false}))}else{i.push(new sap.ui.model.Filter({filters:[new sap.ui.model.Filter("ISBN",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("title",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("author",sap.ui.model.FilterOperator.Contains,t),new sap.ui.model.Filter("genre",sap.ui.model.FilterOperator.Contains,t)],and:false}))}}var o=this.byId("idBookTable");var s=o.getBinding("items");s.filter(i)},onCreateBtnPress:async function(){if(!this.createDialog){this.createDialog=await this.loadFragment("createBooks")}this.createDialog.open()},onCloseCreateDialog:function(){if(this.createDialog.isOpen()){this.createDialog.close()}},onDeleteBtnPress:async function(){var e=this.byId("idBookTable").getSelectedItems();if(e.length===0){n.show("Select a title to delete.");return}if(e.length>1){n.show("Please select only one title to delete at a time.");return}s.confirm("Are you sure you want to delete the selected book?",{actions:[s.Action.YES,s.Action.NO],onClose:function(t){if(t===s.Action.YES){var i=e[0].getBindingContext().getObject().ISBN;e[0].getBindingContext().delete("$auto",{success:function(){n.show("Successfully deleted");this.getView().byId("idBookTable").removeSelections(true);this.getView().byId("idBookTable").getBinding("items").refresh()}.bind(this),error:function(e){n.show("Deletion Error: "+e.message)}})}}.bind(this)})},onCreate:async function(){var e=this.getView().getModel("localModel").getProperty("/"),t=this.getView().getModel("ModelV2");e.availability=e.quantity;this.getView().getModel("localModel").setData(e);if(!(e.ISBN&&e.author&&e.availability&&e.genre&&e.language&&e.quantity&&e.title)){n.show("Enter all details");return}if(e.ISBN.length!==17){n.show("ISBN must be 17 characters long");return}try{const i=await this.checkTitle(t,e.title,e.ISBN);if(i){n.show("Book with the same Title and ISBN already exists");return}await this.createData(t,e,"/Books");this.createDialog.close();this.getView().byId("idBookTable").getBinding("items").refresh();n.show("New Title is added")}catch(e){this.createDialog.close();s.error("Some technical issue occurred")}},checkTitle:async function(e,o,s){return new Promise((a,n)=>{e.read("/Books",{filters:[new t("title",i.EQ,o),new t("ISBN",i.EQ,s)],success:function(e){a(e.results.length>0)},error:function(){n("An error occurred while checking book existence.")}})})},onCloseUpdateDialog:function(){if(this.updateDialog.isOpen()){this.updateDialog.close()}},onActiveLoansFilterPress:async function(){if(!this.activeloansDialog){this.activeloansDialog=await this.loadFragment("activeLoans")}this.activeloansDialog.open()},onIssueBooksFilterPress:async function(){if(!this.issueBooksDialog){this.issueBooksDialog=await this.loadFragment("issueBooks")}this.issueBooksDialog.open()},onissuebookscancelbtn:function(){if(this.issueBooksDialog.isOpen()){this.issueBooksDialog.close()}},onactiveloanscancelbtn:function(){if(this.activeloansDialog.isOpen()){this.activeloansDialog.close()}},onCloseloanpress:async function(){var e=this.byId("activeloansTable").getSelectedItems();var t=this.byId("activeloansTable").getSelectedItem().getBindingContext().getObject(),i=t.book.ID,o=t.book.availability+1;const s=new sap.ui.model.json.JSONModel({book:{availability:o}});this.getView().setModel(s,"userModel");const a=this.getView().getModel("userModel").getProperty("/"),l=this.getView().getModel("ModelV2");try{l.update("/Books("+i+")",a.book,{success:function(){this.getView().byId("idBooksTable").getBinding("items").refresh()},error:function(e){sap.m.MessageBox.error("Failed to update book: "+e.message)}.bind(this)})}catch(e){sap.m.MessageBox.error("Some technical Issue")}if(e.length>0){var r=[];e.forEach(function(e){var t=e.getBindingContext().getObject().isbn;r.push(t);e.getBindingContext().delete("$auto")});Promise.all(r.map(function(e){return new Promise(function(e,t){e("Loan closed successfully ")})})).then(function(e){e.forEach(function(e){n.show(e)})}).catch(function(e){n.show("Deletion Error: "+e)});this.getView().byId("activeloansTable").getBinding("items").refresh()}else{n.show("Please Select Rows to Delete")}},onUpdateBtnPress:async function(){var e=this.byId("idBookTable").getSelectedItems();if(e.length===0){n.show("Select a Title to Edit");return}if(e.length>1){n.show("Select only one Title to Edit");return}if(e){var t=e[0].getBindingContext().getProperty("ID");var i=e[0].getBindingContext().getProperty("ISBN");var o=e[0].getBindingContext().getProperty("title");var s=e[0].getBindingContext().getProperty("author");this.oQuantity=e[0].getBindingContext().getProperty("quantity");this.oAq=e[0].getBindingContext().getProperty("availability");var a=e[0].getBindingContext().getProperty("genre");var l=e[0].getBindingContext().getProperty("language");var r=new sap.ui.model.json.JSONModel({ID:t,ISBN:i,title:o,author:s,quantity:this.oQuantity,genre:a,availability:this.oAq,language:l});this.getView().setModel(r,"newBookModel");if(!this.updateDialog){this.updateDialog=await this.loadFragment("updateBooks")}this.updateDialog.open()}},onUpdate:function(){var e=parseInt(this.getView().byId("idQuantityInput").getValue());var t=parseInt(this.getView().byId("idavailabilityInput").getValue());if(t>e){sap.m.MessageToast.show("Availability cannot be greater than Quantity");return}var i=e-this.oQuantity;var o=this.oAq+i;var s=this.getView().getModel("newBookModel").getData();s.availability=o;try{var a=this.getOwnerComponent().getModel("ModelV2");a.update("/Books("+s.ID+")",s,{success:function(){this.getView().byId("idBookTable").getBinding("items").refresh();this.updateDialog.close();sap.m.MessageToast.show("Updated Successfully ")}.bind(this),error:function(e){this.updateDialog.close();sap.m.MessageBox.error("Failed to update book: "+e.message)}.bind(this)})}catch(e){this.updateDialog.close();sap.m.MessageBox.error("Some technical issue occurred")}},onReservebtnpress:async function(e){if(this.byId("issuebooksTable").getSelectedItems().length>1){n.show("Please Select only one Book");return}var t=this.byId("issuebooksTable").getSelectedItem().getBindingContext().getObject(),i=t.book.availability-1;var o=new Date;let s=new Date(o.getFullYear(),o.getMonth(),o.getDay()+19);const a=new sap.ui.model.json.JSONModel({book_ID:t.book.ID,user_ID:t.user.ID,issueDate:new Date,dueDate:s,notify:`${t.book.title} Title is issued by Admin`,book:{availability:i}});this.getView().setModel(a,"userModel");const l=this.getView().getModel("userModel").getProperty("/"),r=this.getView().getModel("ModelV2");try{await this.createData(r,l,"/ActiveLoans");sap.m.MessageBox.success("Title issued successfully.");this.byId("issuebooksTable").getSelectedItem().getBindingContext().delete("$auto");var g=this.byId("issuebooksTable");var u=g.getSelectedItem();g.removeItem(u);r.update("/Books("+t.book.ID+")",l.book,{success:function(){},error:function(e){sap.m.MessageBox.error("Failed to update book: "+e.message)}.bind(this)})}catch(e){sap.m.MessageBox.error("Some technical Issue")}},onLogoutPress:function(){var e=this.getOwnerComponent().getRouter();e.navTo("RouteHomePage",{},true)}})});