sap.ui.define(["sap/ui/core/mvc/Controller","zpmdocmedicio/controller/BaseController","sap/ui/model/json/JSONModel"],function(e,t,o){"use strict";return t.extend("zpmdocmedicio.controller.App",{onInit:function(){this.iOriginalBusyDelay=this.getView().getBusyIndicatorDelay();this.oAppModel=new o({busy:true,delay:0});this.setModel(this.oAppModel,"JMApp ");this.getOwnerComponent().getModel().metadataLoaded().then(this.setAppNotBusy());this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())},setAppNotBusy:function(){this.oAppModel.setProperty("/busy",false);this.oAppModel.setProperty("/delay",this.iOriginalBusyDelay)}})});