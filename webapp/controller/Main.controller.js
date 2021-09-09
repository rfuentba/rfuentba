sap.ui.define(
	[
		"zpmdocmedicio/controller/BaseController",
		"sap/ui/Device",
		"sap/ui/model/json/JSONModel",
		"zpmdocmedicio/model/Formatter",
		"sap/m/MessageBox",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator", 
		"sap/viz/ui5/format/ChartFormatter",
		'sap/m/MessageToast' 
	],
	function (BaseController, Device, JSONModel, Formatter, MessageBox, Filter, FilterOperator, ChartFormatter, MessageToast) {
		"use strict";

		return BaseController.extend("zpmdocmedicio.controller.Main", {
			/*------------------------------------------------------- 
				/*	Declarations
				-------------------------------------------------------*/
			oFormatter: Formatter,

			/* =========================================================== */
			/* lifecycle methods */
			/* =========================================================== */

			/**
			 * Called when the Main controller is instantiated. It sets up the
			 * event handling for the Main/detail communication and other
			 * lifecycle tasks.
			 * 
			 * @public
			 */
			
			onInit: function () {
				this.oView = this.getView();
				this.oBundle = this.getResourceBundle();
				
//				Seteamos los grafos en el contexto del controlador
				// this.graphBV = this.oView.byId("graphBV");
				// this.graphLA = this.oView.byId("graphLA");
				
//				Inicializacion de modelos auxiliares
				this.initialOModelParameters(this);
				
//				Llamadas a metodos Read
				// this.readGraficsSet();
				// this.readEstacions();

				// this.readTotalAvisosLinia();
				
//				this.readTotalAvisos();
//				this.readAvisos();
			},
			
			// Inicializamos un modelo auxiliar donde guardaremos los parametros locales
			initialOModelParameters: function(oContext){
				var data;
				data = {Data: new Date(),
						isGraphBVVisible: true,
						isGraphLAVisible: false,
						isGraphBVButtonPressed: true,
						isGraphLAButtonPressed: false,
						selectedFilterAvisosGraphBV: "",
						selectedFilterAvisosGraphLA: ""
						};
				this.setAuxModel(this, "oModelParameters", data);
			},
			
			onInitialise_SmartFilterBar: function (oEvent) {

				var oGlobalFilter = this.getView().byId("iSmartFilterAvanReal");
//				var oGlobalFilter = oEvent.getSource();
				var oVariantManagement = oGlobalFilter.getVariantManagement();
//				var oSmartVariant = oGlobalFilter.getSmartVariant()
//				Recuperamos las diferentes variantes del filterBar
//                var oSmartVariantItems = oSmartVariant.getVariantItems();
				var oVariantItems = oVariantManagement.getVariantItems();
				var oVariantText;
//				Diferenciamos las variantes por Linea
				for(var i=0 ; i<oVariantItems.length ; i++){
					oVariantText = oVariantItems[i].getProperty("text");
					if(oVariantText.lastIndexOf("BV") !== -1){
						this.smartFilterVariantDependenciaBV = oVariantItems[i];
					}else if(oVariantText.lastIndexOf("LA") !== -1){
						this.smartFilterVariantDependenciaLA = oVariantItems[i];
					}
				}
//				Seteamos como inicianl la variante de Linea BV
				if(this.smartFilterVariantDependenciaBV){
//					oSmartVariant._selectVariant(this.smartFilterVariantDependenciaBV);
					oVariantManagement._setSelectedItem(this.smartFilterVariantDependenciaBV);
				}
//				Lanzamos la busqueda
				oGlobalFilter.triggerSearch();
//				oGlobalFilter.search();
		},
			
			// Inicializamos un modelo auxiliar donde tendremos las distintas prioridades
//			initialOModelPrioridades: function(oContext){
//				var data;
//				data = [
//					{PrioridadID:"1", Desc:"Alta", Array:"AltaArray"},
//					{PrioridadID:"2", Desc:"Mitjana", Array:"MitjanaArray"},
//					{PrioridadID:"3", Desc:"Baixa", Array:"BaixaArray"},
//					{PrioridadID:"4", Desc:"Trimestral", Array:"TrimestralArray"},
//					{PrioridadID:"5", Desc:"Semestral", Array:"SemestralArray"},
//					{PrioridadID:"A", Desc:"AltaAscensors", Array:"AltaAscensorsArray"},
//					{PrioridadID:"B", Desc:"MitjanaAsc", Array:"MitjanaAscArray"},
//					{PrioridadID:"G", Desc:"Imatge", Array:"ImatgeArray"},
//					{PrioridadID:"I", Desc:"Ciclica", Array:"CiclicaArray"},
//					{PrioridadID:"P", Desc:"Gran_Mantenimiento", Array:"Gran_MantenimientoArray"},
//					{PrioridadID:"U", Desc:"Urgent", Array:"UrgentArray"}
//			 	];
//				oContext.setAuxModel(oContext, "oModelPrioridades", data);
//			},
			
//			Botones para ver el grafo 1 o el grafo 2
			onPressButtonLiniaBV: function(oEvent){
				var oModelParameters = this.getModel("oModelParameters");
				if(oModelParameters){
					oModelParameters.setProperty("/isGraphLAVisible", false);
					oModelParameters.setProperty("/isGraphLAButtonPressed", false);
					oModelParameters.setProperty("/isGraphBVVisible", true);
					oModelParameters.setProperty("/isGraphBVButtonPressed", true);
				}

//				Seteamos la variante de linea BV para la smart table
				var oSmartFilterBar = this.getView().byId("iSmartFilterAvanReal");
				if(oSmartFilterBar){
					var oVariantManagement = oSmartFilterBar.getVariantManagement();
//					Seteamos como inicianl la variante de Linea BV y lanzamos el evento de select de la misma
					if(this.smartFilterVariantDependenciaBV){
						oVariantManagement._setSelectedItem(this.smartFilterVariantDependenciaBV);
						oVariantManagement.fireSelect({key:this.smartFilterVariantDependenciaBV.getKey()});
					}
				}
//				Lanzamos la busqueda
				oSmartFilterBar.triggerSearch();
			},
			
			onPressButtonLiniaLA: function(oEvent){
				var oModelParameters = this.getModel("oModelParameters");
				if(oModelParameters){
					oModelParameters.setProperty("/isGraphBVVisible", false);
					oModelParameters.setProperty("/isGraphBVButtonPressed", false);
					oModelParameters.setProperty("/isGraphLAVisible", true);
					oModelParameters.setProperty("/isGraphLAButtonPressed", true);
				}
				
//				Seteamos la variante de linea LA para la smart table
				var oSmartFilterBar = this.getView().byId("iSmartFilterAvanReal");
				if(oSmartFilterBar){
					var oVariantManagement = oSmartFilterBar.getVariantManagement();
//					Seteamos como inicianl la variante de Linea BV y lanzamos el evento de select de la misma
					if(this.smartFilterVariantDependenciaLA){
						oVariantManagement._setSelectedItem(this.smartFilterVariantDependenciaLA);
						oVariantManagement.fireSelect({key:this.smartFilterVariantDependenciaLA.getKey()});
					}
				}
//				Lanzamos la busqueda
				oSmartFilterBar.triggerSearch();
			},
			
			
// 			Metodos del get de Estaciones    	 //
			readEstacions: function(){
				var sPath = "/EstacionsSet";
				var oModel = this.getOwnerComponent().getModel();
				var successFunction =  this.onSuccessReadEstacions;
				var errorFunction = this.genericErrorCallback;
				var expands = "";

				this.readGenericCall(sPath, oModel, successFunction, errorFunction, expands);
			},
			
			onSuccessReadEstacions: function(oContext, oRet){
				if(oRet && oRet.results && oRet.results.length > 0){
					// Formateamos los datos de las estaciones para poder usarlos en el grafo
					var oFormattedData = oContext.formatDataEstacionsReturn(oRet.results);

					oContext.setAuxModel(oContext, "oModelEstacions", oFormattedData);
				}
			},
			
			// Funcion que setea el modelo en el grafo y la estructura de nodos y lineas
			setModelForGraphBV: function(oContext, oFormattedData){
				var oModelEstacions = oContext.getModel("oModelEstacions");
				if(oModelEstacions && oContext.graphBV){
					var graphBV = oContext.graphBV;

//					Refrescamos los modelos para que recoja los atributos
					graphBV.getBinding("nodes").getModel().refresh(true);
					graphBV.getModel().refresh(true);
					
//					Recuperamos el toolbar y añadimos los botones de visualizacion y el seleccionable para filtrar
					var oToolbar = graphBV.getToolbar();
//					Eliminamos el campo de buscar
					oToolbar.removeContent(oToolbar.getContent()[1].sId);
					
					var oSelectAvisosFilter = new sap.m.Select({
						selectedKey: "{oModelParameters>/selectedFilterAvisosGraphBV}",
						forceSelection: false,
						tooltip: "{i18n>Tooltip.SelectFilterGraph}",
						change: this.onChangeFilterAvisosGraphBV,
						items : {
					           path : "oModelClaseEquip>/",
					           template : new sap.ui.core.Item({
									             text : "{oModelClaseEquip>Columna1}",
									             key : "{oModelClaseEquip>Columna}"
					           })
						}
					});
					oToolbar.insertContent(oSelectAvisosFilter, 0);	
					
//					oToolbar.insertContent(new sap.m.ToggleButton({
//						text: "{i18n>Label.LiniaLA}",
//						press: this.onPressButtonLiniaLA,
//						pressed: "{oModelParameters>/isGraphLAButtonPressed}"
//					}), 0);
//					
//					oToolbar.insertContent(new sap.m.ToggleButton({
//						text: "{i18n>Label.LiniaBV}",
//						press: this.onPressButtonLiniaBV,
//						pressed: "{oModelParameters>/isGraphBVButtonPressed}"
//					}), 0);
//					Seteamos el zoom un 50% mas lejos de inicio
//					graphBV._fZoomRatio = 0.5;
//					graphBV.setCurrentZoomLevel(0.5);
				}
			},
			

			// Funcion que setea el modelo en el SEGUNDO grafo y la estructura de nodos y
			// lineas
			setModelForGraphLA: function(oContext, oFormattedData){
				var oModelEstacions = oContext.getModel("oModelEstacions");
				if(oModelEstacions && oContext.graphLA){
					var graphLA = oContext.graphLA;
//					Refrescamos los modelos para que recoja los atributos
					graphLA.getBinding("nodes").getModel().refresh(true);
					graphLA.getModel().refresh(true);

//					Recuperamos el toolbar y añadimos los botones de visualizacion y el seleccionable para filtrar
					var oToolbar = graphLA.getToolbar();
//					Eliminamos el campo de buscar
					oToolbar.removeContent(oToolbar.getContent()[1].sId);
					
					var oSelectAvisosFilter = new sap.m.Select({
						selectedKey: "{oModelParameters>/selectedFilterAvisosGraphLA}",
						forceSelection: false,
						tooltip: "{i18n>Tooltip.SelectFilterGraph}",
						change: this.onChangeFilterAvisosGraphBV,
						items : {
					           path : "oModelClaseEquip>/",
					           template : new sap.ui.core.Item({
									             text : "{oModelClaseEquip>Columna1}",
									             key : "{oModelClaseEquip>Columna}"
					           })
						}
					});
					oToolbar.insertContent(oSelectAvisosFilter, 0);	
					
//					oToolbar.insertContent(new sap.m.ToggleButton({
//						text: "{i18n>Label.LiniaLA}",
//						press: this.onPressButtonLiniaLA,
//						pressed: "{oModelParameters>/isGraphLAButtonPressed}"
//					}), 0);
//					
//					oToolbar.insertContent(new sap.m.ToggleButton({
//						text: "{i18n>Label.LiniaBV}",
//						press: this.onPressButtonLiniaBV,
//						pressed: "{oModelParameters>/isGraphBVButtonPressed}"
//					}), 0);
//					Seteamos el zoom un 50% mas lejos de inicio
//					graphLA._fZoomRatio = 0.5
//					graphLA.setCurrentZoomLevel(0.5);
				}
			},
			
			onGraphIsReady: function(oEvent){
				var oSource = oEvent.getSource();
				if(oSource){
//					Seteamos el zzom del grafo
					oSource.zoom({zoomLevel:0.5});
					if(this.getView().byId("oDependenciaBVBulletChartPanelId")) this.getView().byId("oDependenciaBVBulletChartPanelId").setHeight("100%");
					if(this.getView().byId("oDependenciaLABulletChartPanelId")) this.getView().byId("oDependenciaLABulletChartPanelId").setHeight("100%");
					
//					Añadimos la opcion tots al select de filtros
					var oTooltbarContent = oEvent.getSource().getToolbar().getContent();
					for(var i=0 ; i<oTooltbarContent.length; i++){
						if(oTooltbarContent[i].getMetadata()._sClassName === "sap.m.Select"){
							if(!oTooltbarContent[i].getItemByKey("")){
								oTooltbarContent[i].addItem(new sap.ui.core.Item({
								    text: "Tots",
								    key: "",
								}));
							}
						}
					}
					
				}
			},
			
			
			onChangeFilterAvisosGraphBV: function(oEvent){
				var oSelect = oEvent.getSource();
				if(oSelect){
//					Comprobamos que haya un elemento nulo para tener la opcion de no seleccionar nada y si no existe lo añadimos
					if(!oSelect.getItemByKey("")){
						oEvent.getSource().addItem(new sap.ui.core.Item({
						    text: "Tots",
						    key: "",
						}));
					}
//					Recuperamos la Key del item seleccionado y el modelo del grafo al que afectara el change
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if(oSelectedItem){
						var oSelectedKey = oSelectedItem.getKey();
//						Recuperamos el grafo y el modelo con los datos
						var oGraph = oSelect.getParent().getParent();
//						Recuperamos el ID del grafo para separar los dos casos
						var sGraphID = oGraph.getId();
						var sNodesPath;
						if(sGraphID.lastIndexOf("graphBV") !== -1){
							sNodesPath = "/BVNodes";
						}else if(sGraphID.lastIndexOf("graphLA") !== -1){
							sNodesPath = "/LANodes";
						}
						var oModelEstacions = oGraph.getModel("oModelEstacions");
						if(oModelEstacions){
//							Recuperamos los nodos y modificamos los atributos que no sean el seleccionado para ocultarlos
							var oNodes = oModelEstacions.getProperty(sNodesPath);
							if(oNodes && oNodes.length > 0){
								var oActualNodeAttributes;
//								Comprobamos si hemos seleccionado el valor vacio para poner todos los atributos a visibles o solo los seleccionados
								if(oSelectedKey !== ""){
									for(var i=0 ; i<oNodes.length ; i++){
										oActualNodeAttributes = oNodes[i].attributes;
										if(oActualNodeAttributes && oActualNodeAttributes.length > 0){
											for(var j=0 ; j<oActualNodeAttributes.length ; j++){
												if(oActualNodeAttributes[j].ClaseEquip === oSelectedKey){
													oActualNodeAttributes[j].visible = true;
												}else{
													oActualNodeAttributes[j].visible = false;
												}
											}
										}
									}
								}else{
									for(var i=0 ; i<oNodes.length ; i++){
										oActualNodeAttributes = oNodes[i].attributes;
										if(oActualNodeAttributes.length > 0){
											for(var j=0 ; j<oActualNodeAttributes.length ; j++){
												oActualNodeAttributes[j].visible = true;
											}
										}
									}
								}
//								Una vez modificados el campo "visible" de los atributos procedemos a refrescar el modelo y los nodos
								oGraph.getBinding("nodes").getModel().refresh(true);
								oGraph.getModel().refresh(true);
							}
						}
						
					}
				}
			},
			
			

// 			Metodos del get de las dimensiones de los graficos    	 //
			readGraficsSet: function(){
				var sPath = "/GraficsSet";
				var oModel = this.getOwnerComponent().getModel();
				var successFunction =  this.onSuccessReadGraficsSet;
				var errorFunction = this.genericErrorCallback;
				var expands = "";

				this.readGenericCall(sPath, oModel, successFunction, errorFunction, expands);
			},
			
			onSuccessReadGraficsSet: function(oContext, oRet){
				if(oRet && oRet.results && oRet.results.length > 0){
					var oFormattedGraficsSet = oContext.formatDataGraficsSet(oContext, oRet.results);
					oContext._setChartPrioritatsData(oContext);
				}
			},
			
			formatDataGraficsSet: function(oContext, oGrafics){
				var oPrioritats = [], oClaseEquip = [];
				for(var i=0 ; i<oGrafics.length ; i++){
					oGrafics[i].Valors = oGrafics[i].Valors.split(";");
					if(oGrafics[i].Grafic === "PRIORITAT"){
						oPrioritats.push(oGrafics[i]);
					}else if(oGrafics[i].Grafic === "CLASE_EQUIP"){
						oClaseEquip.push(oGrafics[i]);
					}
				}
				oContext.setAuxModel(oContext, "oModelPrioritats", oPrioritats);
				oContext.setAuxModel(oContext, "oModelClaseEquip", oClaseEquip);
				

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setSizeLimit("9999");
				oModel.setData(oPrioritats);
				sap.ui.getCore().setModel(oModel, "oModelPrioritats");
				
				oModel = new sap.ui.model.json.JSONModel();
				oModel.setSizeLimit("9999");
				oModel.setData(oClaseEquip);
				sap.ui.getCore().setModel(oModel, "oModelClaseEquip");
				
			},
			
			
// 			Metodos del get de Avisos		//
			readAvisos: function(){
				var sPath = "/AvisosSet";
				var oModel = this.getOwnerComponent().getModel();
				var successFunction =  this.onSuccessReadAvisos;
				var errorFunction = this.genericErrorCallback;
				var expands = "";

				this.readGenericCall(sPath, oModel, successFunction, errorFunction, expands);
			},
			
//			Funcion llamada en caso de que el get de avisos vaya OK
			onSuccessReadAvisos: function(oContext, oRet){
				
				if(oRet && oRet.results && oRet.results.length > 0){
					var oFormattedAvisos = oContext.formatDataAvisosReturn(oContext, oRet.results);
//					oContext.setAuxModel(oContext, "oModelAvisos", oFormattedAvisos);
					oContext._setChartData(oContext);
					oContext._setChartEquipsData(oContext);
				}
			},
			
			formatDataAvisosReturn: function(oContext, oAvisos){
				var oFormattedAvisos = [];
				var oModelPrioritats = oContext.getView().getModel("oModelPrioritats");
				// Creamos un array para cada una de las prioridades
				if(oModelPrioritats){
					var oModelPrioritatsData = oModelPrioritats.getData();
					var i, j, actualValor, oMatchingOrdres;
					for( i=0 ; i<oModelPrioritatsData.length ; i++){
						for( j=0 ; j<oModelPrioritatsData[i].Valors.length ; j++){
							actualValor = oModelPrioritatsData[i].Valors[j];
							
							oMatchingOrdres = [];
							oMatchingOrdres = oAvisos.filter(function(value){
	                            if(value.Prioritat === oModelPrioritatsData[i].Valors[j]){
	                            	return value;
	                            }
	                            else return "";
							});
							if(oMatchingOrdres.length > 0){
								oModelPrioritatsData[i][actualValor] = oMatchingOrdres;
								oModelPrioritatsData[i][actualValor].AvisosQty = oMatchingOrdres.length;
							}else{
								oModelPrioritatsData[i][actualValor] = [];
								oModelPrioritatsData[i][actualValor].AvisosQty = 0;
							}
						}
					}
				}
				
				oFormattedAvisos = [];
				var oModelClaseEquip = oContext.getView().getModel("oModelClaseEquip");
				var oModelTotalAvisos = oContext.getView().getModel("oModelTotalAvisos");
				// Creamos un array para cada una de las prioridades
				if(oModelClaseEquip && oModelTotalAvisos){
					var oModelClaseEquipsData = oModelClaseEquip.getData();
					var oModelTotalAvisosData = oModelTotalAvisos.getData();
					for( i=0 ; i<oModelClaseEquipsData.length ; i++){
						oMatchingOrdres = [];
						oModelClaseEquipsData[i].AvisosQty = 0;
						oMatchingOrdres = oModelTotalAvisosData.filter(function(value){
                            if(value.ClaseEquip === oModelClaseEquipsData[i].Columna && value.Numavis > 0){
                            	oModelClaseEquipsData[i].AvisosQty += parseInt(value.Numavis);
                            	return value;
                            }
                            else return "";
						});
//							if(oMatchingOrdres.length > 0){
//								oModelClaseEquipsData[i][actualValor] = oMatchingOrdres;
//								oModelClaseEquipsData[i][actualValor].AvisosQty = oMatchingOrdres.length;
//							}else{
//								oModelClaseEquipsData[i][actualValor] = [];
//								oModelClaseEquipsData[i][actualValor].AvisosQty = 0;
//							}
					}
				}
			},
			
//			Reglas de Colores para el Chart
			createChartAvisosRuleRed: function(oContext){
				var oRule = function(callback){
					var oModelPrioritats = sap.ui.getCore().getModel("oModelPrioritats");
					if(oModelPrioritats){
						var oModelPrioritatsData = oModelPrioritats.getData();
						var oActualPrioritat = callback.Prioritat;
						var oMatchingPrioritat = oModelPrioritatsData.filter(function(value){
                            if(value.Columna === oActualPrioritat){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingPrioritat.length > 0 && oMatchingPrioritat[0].Color === "ERROR") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			createChartAvisosRuleOrange: function(oContext){
				var oRule = function(callback){		
					var oModelPrioritats = sap.ui.getCore().getModel("oModelPrioritats");
					if(oModelPrioritats){
						var oModelPrioritatsData = oModelPrioritats.getData();
						var oActualPrioritat = callback.Prioritat;
						var oMatchingPrioritat = oModelPrioritatsData.filter(function(value){
                            if(value.Columna === oActualPrioritat){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingPrioritat.length > 0 && oMatchingPrioritat[0].Color === "WARNING") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			createChartAvisosRuleBlue: function(oContext){
				var oRule = function(callback){		
					var oModelPrioritats = sap.ui.getCore().getModel("oModelPrioritats");
					if(oModelPrioritats){
						var oModelPrioritatsData = oModelPrioritats.getData();
						var oActualPrioritat = callback.Prioritat;
						var oMatchingPrioritat = oModelPrioritatsData.filter(function(value){
                            if(value.Columna === oActualPrioritat){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingPrioritat.length > 0 && oMatchingPrioritat[0].Color === "INFORMATION") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			createChartAvisosRuleGreen: function(oContext){
				var oRule = function(callback){
					var oModelPrioritats = sap.ui.getCore().getModel("oModelPrioritats");
					if(oModelPrioritats){
						var oModelPrioritatsData = oModelPrioritats.getData();
						var oActualPrioritat = callback.Prioritat;
						var oMatchingPrioritat = oModelPrioritatsData.filter(function(value){
                            if(value.Columna === oActualPrioritat){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingPrioritat.length > 0 && oMatchingPrioritat[0].Color === "SUCCESS") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			

//			Preparamos el formato del Chart por clases de equipo y seteamos los datos
			_setChartEquipsData: function(oContext, oVizChart, oVizPopover, oDependenciaName){
//				Recuperamos el modelo de avisos donde tenemos todos los avisos
				var oModelTotalAvisosLinia = oContext.getView().getModel("oModelTotalAvisosLinia");
				var oResourceBundle = oContext.oBundle;
				if(oModelTotalAvisosLinia && oVizChart){
//					Generamos los formatters necesarios para el vizFrame
					var formatPattern = ChartFormatter.DefaultPattern;
//			        this.oVizFrame = this.getView().byId("idBulletChartEquipsVizFrame");
//			        var oVizFrame = this.oVizFrame
			        
//			        Seteamos las propiedades basicas de titulo y plotArea
			        var oRuleRed = oContext.createChartAvisosRuleRedEquips(oContext);
			        var oRuleOrange = oContext.createChartAvisosRuleOrangeEquips(oContext);
			        var oRuleBlue = oContext.createChartAvisosRuleBlueEquips(oContext);
			        var oRuleGreen = oContext.createChartAvisosRuleGreenEquips(oContext);
			        
			        oVizChart.setVizProperties({
		                plotArea: {
		                    dataLabel: {
		                        visible: true
		                    },
		                    dataPointStyle: {
	                    		rules: [{
                                   callback    : oRuleRed,
                                   properties  : {
                                                   color : "red"
                                                 },
	                    		},{
                                   callback    : oRuleOrange,
                                   properties  : {
                                                   color : "orange"
                                                 },
	                    		},{
                                   callback    : oRuleBlue,
                                   properties  : {
                                                   color : "blue"
                                                 },
	                    		},{
                                   callback    : oRuleGreen,
                                   properties  : {
                                                   color : "green"
                                                 },
	                    		}
	                    		],
	                    		others :{
	                    			properties : {
                                                	color : "green"
                                                  },
	                    		}
                            }
		                },
                		legend: {
                			visible: false
                		},
		                title: {
		                    visible: true,
		                    text: 'Avisos per equip'
		                }
		        });
//			        var oPopOver = this.getView().byId("idBulletChartEquipsPopOver");
			        oVizPopover.connect(oVizChart.getVizUid());
//			        oPopOver.setFormatString(formatPattern.STANDARDINTEGER);
			        
//			        Creamos la estructura de datos para el grafico de barras
//			        var oModelClaseEquipData = oModelClaseEquip.getData();
//			        var oChartData = oContext.createChartEquipDataStructure(oModelClaseEquipData);
//			        oModelClaseEquip.setProperty("/ChartData", oChartData);
			        oVizChart.setModel(oModelTotalAvisosLinia, "oModelTotalAvisosLinia");
				}
			},
			
//			Reglas de Colores para el Chart de equipos Comparamos contra el Columna1 ya que aqui los colores van por equipo y no por prioridad
			createChartAvisosRuleRedEquips: function(oContext){
				var oRule = function(callback){
					var oModelClaseEquip = sap.ui.getCore().getModel("oModelClaseEquip");
					if(oModelClaseEquip){
						var oModelClaseEquipData = oModelClaseEquip.getData();
						var oActualClaseEquip = callback.Equip;
						var oMatchingClaseEquip = oModelClaseEquipData.filter(function(value){
                            if(value.Columna1 === oActualClaseEquip){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingClaseEquip.length > 0 && oMatchingClaseEquip[0].Color === "ERROR") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			createChartAvisosRuleOrangeEquips: function(oContext){
				var oRule = function(callback){		
					var oModelClaseEquip = sap.ui.getCore().getModel("oModelClaseEquip");
					if(oModelClaseEquip){
						var oModelClaseEquipData = oModelClaseEquip.getData();
						var oActualClaseEquip = callback.Equip;
						var oMatchingClaseEquip = oModelClaseEquipData.filter(function(value){
                            if(value.Columna1 === oActualClaseEquip){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingClaseEquip.length > 0 && oMatchingClaseEquip[0].Color === "WARNING") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			createChartAvisosRuleBlueEquips: function(oContext){
				var oRule = function(callback){		
					var oModelClaseEquip = sap.ui.getCore().getModel("oModelClaseEquip");
					if(oModelClaseEquip){
						var oModelClaseEquipData = oModelClaseEquip.getData();
						var oActualClaseEquip = callback.Equip;
						var oMatchingClaseEquip = oModelClaseEquipData.filter(function(value){
                            if(value.Columna1 === oActualClaseEquip){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingClaseEquip.length > 0 && oMatchingClaseEquip[0].Color === "INFORMATION") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
			createChartAvisosRuleGreenEquips: function(oContext){
				var oRule = function(callback){
					var oModelClaseEquip = sap.ui.getCore().getModel("oModelClaseEquip");
					if(oModelClaseEquip){
						var oModelClaseEquipData = oModelClaseEquip.getData();
						var oActualClaseEquip = callback.Equip;
						var oMatchingClaseEquip = oModelClaseEquipData.filter(function(value){
                            if(value.Columna1 === oActualClaseEquip){
                            	return value;
                            }
                            else return "";
						});
						
						if(oMatchingClaseEquip.length > 0 && oMatchingClaseEquip[0].Color === "SUCCESS") {
			              return true;
			          }
					}
			    };
			    return oRule;
			},
			
//			Creacion de la estructura de "dimension" del chart
			createChartDataStructure: function(oModelPrioritatsData){
				var i, j, chartData = [], AvisosQty, actualValor;
				for( i=0 ; i<oModelPrioritatsData.length ; i++){
					AvisosQty = 0;
					for( j=0 ; j<oModelPrioritatsData[i].Valors.length ; j++){
						actualValor = oModelPrioritatsData[i].Valors[j];
						AvisosQty += oModelPrioritatsData[i][actualValor].AvisosQty;
					}
					chartData.push({
						Prioritat: oModelPrioritatsData[i].Columna,
						Color: oModelPrioritatsData[i].Color,
				        AvisosQty: AvisosQty
					});
				}
				return chartData;
			},
			
			createChartEquipDataStructure: function(oModelClaseEquipData){
				var i, j, chartData = [], AvisosQty, actualValor;
				for( i=0 ; i<oModelClaseEquipData.length ; i++){
					AvisosQty = 0;
					actualValor = oModelClaseEquipData[i].Columna1;
					AvisosQty = oModelClaseEquipData[i].AvisosQty;
					chartData.push({
						Prioritat: actualValor,
						Color: oModelClaseEquipData[i].Color,
				        AvisosQty: AvisosQty
					});
				}
				return chartData;
			},
			
			
			readTotalAvisosLinia: function(){
				var sPath = "/TotalAvisosLiniaSet";
				var oModel = this.getOwnerComponent().getModel();
				var successFunction =  this.onSuccessReadTotalAvisosLinia;
				var errorFunction = this.genericErrorCallback;
				var expands = "tot_avis_prioritat,tot_avis_equip";
				
				this.readGenericCall(sPath, oModel, successFunction, errorFunction, expands);
			},
			
			onSuccessReadTotalAvisosLinia: function(oContext, oRet){
				if(oRet && oRet.results && oRet.results.length > 0){
					var oData = oContext.formatDataTotalAvisosLiniaReturn(oContext,oRet.results);
					oContext.setAuxModel(oContext, "oModelTotalAvisosLinia", oData);
					
//					Preparamos los datos para los network graphs y seteamos los modelos
					oContext.fillEstacionsModelWithAvisos(oContext, oData);
					oContext.setModelForGraphBV(oContext);
					oContext.setModelForGraphLA(oContext);
					
//					Preparamos los datos para los charts y seteamos los modelos
					oContext.setChartsData(oContext);
			        
				}
			},

			
			formatDataTotalAvisosLiniaReturn: function(oContext, oData){
//				---------------------------------------------------------------------------------------
//				Primero de todo limpiamos los datos para no tener todas las subVariables de results etc
//				---------------------------------------------------------------------------------------
				
//				DEPENDENCIA BV
				for(var i=0 ; i<oData.length ; i++){
					if(oData[i].NomLinia === "DEPENDENCIA_BV"){
						oData.DEPENDENCIA_BV = oData[i];
					}else if(oData[i].NomLinia === "DEPENDENCIA_LA"){
						oData.DEPENDENCIA_LA = oData[i];
					}
				}
				
				if(oData.DEPENDENCIA_BV){
//					TOT AVIS EQUIP
					if(oData.DEPENDENCIA_BV.tot_avis_equip && oData.DEPENDENCIA_BV.tot_avis_equip.results && oData.DEPENDENCIA_BV.tot_avis_equip.results.length > 0){
						oData.DEPENDENCIA_BV.tot_avis_equip = oData.DEPENDENCIA_BV.tot_avis_equip.results;
					}else{
						oData.DEPENDENCIA_BV.tot_avis_equip = [];
					}
//					TOT AVIS PRIORITAT
					if(oData.DEPENDENCIA_BV.tot_avis_prioritat && oData.DEPENDENCIA_BV.tot_avis_prioritat.results && oData.DEPENDENCIA_BV.tot_avis_prioritat.results.length > 0){
						oData.DEPENDENCIA_BV.tot_avis_prioritat = oData.DEPENDENCIA_BV.tot_avis_prioritat.results;
					}else{
						oData.DEPENDENCIA_BV.tot_avis_prioritat = [];
					}
//					Funcion para formatear los avisos por equipo
					oContext.formatDataAvisosPerEquipDependencia(oContext, oData.DEPENDENCIA_BV, "Dependencia_BV");
				}

//				DEPENDENCIA LA
				if(oData.DEPENDENCIA_LA){
//					TOT AVIS EQUIP
					if(oData.DEPENDENCIA_LA.tot_avis_equip && oData.DEPENDENCIA_LA.tot_avis_equip.results && oData.DEPENDENCIA_LA.tot_avis_equip.results.length > 0){
						oData.DEPENDENCIA_LA.tot_avis_equip = oData.DEPENDENCIA_LA.tot_avis_equip.results;
					}else{
						oData.DEPENDENCIA_LA.tot_avis_equip = [];
					}
//					TOT AVIS PRIORITAT
					if(oData.DEPENDENCIA_LA.tot_avis_prioritat && oData.DEPENDENCIA_LA.tot_avis_prioritat.results && oData.DEPENDENCIA_LA.tot_avis_prioritat.results.length > 0){
						oData.DEPENDENCIA_LA.tot_avis_prioritat = oData.DEPENDENCIA_LA.tot_avis_prioritat.results;
					}else{
						oData.DEPENDENCIA_LA.tot_avis_prioritat = [];
					}
//					Funcion para formatear los avisos por equipo
					oContext.formatDataAvisosPerEquipDependencia(oContext, oData.DEPENDENCIA_LA, "Dependencia_LA");
				}
				
				return oData;
			},
			
			formatDataAvisosPerEquipDependencia: function(oContext, oData, oDependenciaName){
				var oAvisos = oData.tot_avis_equip;
				var oModelClaseEquip = oContext.getView().getModel("oModelClaseEquip");
				// Creamos un array para cada una de las prioridades
				if(oModelClaseEquip){
					oData.ChartEquips = [];
					var oModelClaseEquipsData = oModelClaseEquip.getData();
					oModelClaseEquipsData = JSON.parse(JSON.stringify(oModelClaseEquipsData));
					
					var oFormattedAvisos = [];
					var i, j, actualValor, oMatchingAvisos, oNumAvisos = 0;
					for( i=0 ; i<oModelClaseEquipsData.length ; i++){
						actualValor = oModelClaseEquipsData[i];
						
						oMatchingAvisos = [];
						oMatchingAvisos = oAvisos.filter(function(value){
                            if(value.ClaseEquip === actualValor.Columna && value.Numavis > 0){
                            	oNumAvisos += parseInt(value.Numavis);
	                        	return value;
                            }
                            else return "";
						});
						if(actualValor.Columna1 !== "Altres"){
							
						if(oMatchingAvisos.length > 0){
							oData.ChartEquips.push({
								"Equip": actualValor.Columna1,
								"Avisos": oMatchingAvisos,
								"AvisosQty": oNumAvisos,
								"Color": actualValor.Color,
								"Valors": actualValor.Valors
							});
//								oModelPrioritatsData[i][actualValor] = oMatchingAvisos;
//								oModelPrioritatsData[i][actualValor].AvisosQty = oMatchingAvisos.length;
						}else{
							oData.ChartEquips.push({
								"Equip": actualValor.Columna1,
								"Avisos": [],
								"AvisosQty": 0,
								"Color": actualValor.Color,
								"Valors": actualValor.Valors
							});
//								oModelPrioritatsData[i][actualValor] = [];
//								oModelPrioritatsData[i][actualValor].AvisosQty = 0;
						}
						
						}else{
							oData.tot_avis_Altres = oNumAvisos;
						}
						oNumAvisos = 0;
					}
				}
			},
			
			setChartsData: function(oContext){
//				DEPENDENCIA BV
				var oDependenciaBV = "DEPENDENCIA_BV";
				
				var oVizFramePrioritatsBV = oContext.getView().byId("idBulletChartPrioritatsBVVizFrame");
		        var oVizFramePrioritatsBVPopover = oContext.getView().byId("idBulletChartPrioritatsBVPopOver");
				oContext._setChartPrioritatsData(oContext, oVizFramePrioritatsBV, oVizFramePrioritatsBVPopover, oDependenciaBV);

				var oVizFrameEquipsBV = oContext.getView().byId("idBulletChartEquipsBVVizFrame");
		        var oVizFrameEquipsBVPopover = oContext.getView().byId("idBulletChartEquipsBVPopOver");
				oContext._setChartEquipsData(oContext, oVizFrameEquipsBV, oVizFrameEquipsBVPopover, oDependenciaBV);
				
//				DEPENDENCIA LA
				var oDependenciaLA = "DEPENDENCIA_LA";
				
		        var oVizFramePrioritatsLA = oContext.getView().byId("idBulletChartPrioritatsLAVizFrame");
		        var oVizFramePrioritatsLAPopover = oContext.getView().byId("idBulletChartPrioritatsLAPopOver");
				oContext._setChartPrioritatsData(oContext, oVizFramePrioritatsLA, oVizFramePrioritatsLAPopover, oDependenciaLA);

		        var oVizFrameEquipsLA = oContext.getView().byId("idBulletChartEquipsLAVizFrame");
		        var oVizFrameEquipsLAPopover = oContext.getView().byId("idBulletChartEquipsLAPopOver");
				oContext._setChartEquipsData(oContext, oVizFrameEquipsLA, oVizFrameEquipsLAPopover, oDependenciaLA);
			},

//			Preparamos el formato del Chart por prioridades y seteamos los datos
			_setChartPrioritatsData: function(oContext, oVizChart, oVizPopover, oDependenciaName){
//				Recuperamos el modelo de avisos donde tenemos todos los avisos
				var oModelTotalAvisosLinia = oContext.getView().getModel("oModelTotalAvisosLinia");
				var oResourceBundle = oContext.oBundle;
				if(oModelTotalAvisosLinia && oVizChart){
//					Generamos los formatters necesarios para el vizFrame
					var formatPattern = ChartFormatter.DefaultPattern;
					
//					Recuperamos los charts de dependencia BV y LA
//			        var oVizFramePrioritatsBV = this.getView().byId("idBulletChartPrioritatsBVVizFrame");
//			        var oVizFramePrioritatsLA = this.getView().byId("idBulletChartPrioritatsLAVizFrame");
			        
//			        Seteamos las propiedades basicas de titulo y plotArea
			        var oRuleRed = oContext.createChartAvisosRuleRed(oContext);
			        var oRuleOrange = oContext.createChartAvisosRuleOrange(oContext);
			        var oRuleBlue = oContext.createChartAvisosRuleBlue(oContext);
			        var oRuleGreen = oContext.createChartAvisosRuleGreen(oContext);
			        
			        oVizChart.setVizProperties({
		                plotArea: {
		                    dataLabel: {
		                        visible: true
		                    },
		                    dataPointStyle: {
	                    		rules: [{
                                   callback    : oRuleRed,
                                   properties  : {
                                                   color : "red"
                                                 },
	                    		},{
                                   callback    : oRuleOrange,
                                   properties  : {
                                                   color : "orange"
                                                 },
	                    		},{
                                   callback    : oRuleBlue,
                                   properties  : {
                                                   color : "blue"
                                                 },
	                    		},{
                                   callback    : oRuleGreen,
                                   properties  : {
                                                   color : "green"
                                                 },
	                    		}
	                    		],
	                    		others :{
	                    			properties : {
                                                	color : "green"
                                                  },
	                    		}
                            }
		                },
                		legend: {
                			visible: false
                		},
		                title: {
		                    visible: true,
		                    text: 'Avisos per prioritat'
		                }
			        });
			        oVizPopover.connect(oVizChart.getVizUid());
			        
//			        Creamos la estructura de datos para el grafico de barras
//			        var oChartData = oModelTotalAvisosLinia.getData()[oDependenciaName];
//			        var oChartData = oContext.createChartDataStructure(oModelChartData);
//			        oModelPrioritats.setProperty("/ChartData", oChartData);
			        oVizChart.setModel(oModelTotalAvisosLinia, "oModelTotalAvisosLinia");
				}
			},
			
			

// 			Metodos del get de TotalAvisos		//
			readTotalAvisos: function(){
				var sPath = "/TotalAvisosSet";
				var oModel = this.getOwnerComponent().getModel();
				var successFunction =  this.onSuccessReadTotalAvisos;
				var errorFunction = this.genericErrorCallback;
				var expands = "";

				this.readGenericCall(sPath, oModel, successFunction, errorFunction, expands);
			},
			
			onSuccessReadTotalAvisos: function(oContext, oRet){
				if(oRet && oRet.results && oRet.results.length > 0){
					oContext.setAuxModel(oContext, "oModelTotalAvisos", oRet.results);
					oContext.fillEstacionsModelWithAvisos(oContext);
					oContext.setModelForGraphBV(oContext);
					oContext.setModelForGraphLA(oContext);
				}
			},


//			Funcion para rellenar el modelo de estaciones con los avisos de la entidad total avisos
			fillEstacionsModelWithAvisos: function(oContext, oData){
//				Primero de todo recuperamos los modelos de estaciones y de TotalAvisos y comprobamos que estan OK
				var oModelEstacions = oContext.getModel("oModelEstacions");
//				var oModelTotalAvisos = oContext.getModel("oModelTotalAvisos");
				if(oModelEstacions){
					var oDataEstacions = oModelEstacions.getData();
//					var oDataTotalAvisos = oModelTotalAvisos.getData();
					
//					Primero Haremos los nodos de la linea BV
//					var auxDataTotalAvisos = JSON.parse(JSON.stringify(oDataTotalAvisos));
					var i, oMatchingAvisos;
					for( i=0 ; i<oDataEstacions.BVNodes.length ; i++){
						oMatchingAvisos = [];
						oMatchingAvisos = oData.DEPENDENCIA_BV.tot_avis_equip.filter(function(value){
                            if(value.EstacioUbicacio === oDataEstacions.BVNodes[i].Codiest){
                            	value.visible = true;
                            	return value;
                            }
                            else return "";
						});
						if(oMatchingAvisos.length > 0){
							oDataEstacions.BVNodes[i].attributes = oMatchingAvisos;
//							oDataEstacions.BVNodes[i].Prioritat = oMatchingAvisos[0].Prioritat;
						}
					}
					
//					Ahora hacemos lo mismo con los nodos de la linea LA
					for( i=0 ; i<oDataEstacions.LANodes.length ; i++){
						oMatchingAvisos = [];
						oMatchingAvisos = oData.DEPENDENCIA_LA.tot_avis_equip.filter(function(value){
                            if(value.EstacioUbicacio === oDataEstacions.LANodes[i].Codiest){
                            	value.visible = true;
                            	return value;
                            }
                            else return "";
						});
						oDataEstacions.LANodes[i].attributes = oMatchingAvisos;
					}
				}
			},
			
			// Llamada get Generica
			readGenericCall: function(sPath, oModel, successFunction, errorFunction, aExpands){
				if(oModel){
		            var oUrlparameters = {};
		            if(aExpands){
		                oUrlparameters['$expand'] = aExpands;
		            }
					oModel.read(sPath, {
							urlParameters: oUrlparameters,
							success: jQuery.proxy(function(oRet){
								successFunction(this, oRet);
							},this),
							error: jQuery.proxy(function(oRet){
								errorFunction(this, oRet);
							},this),
						});
				}
			},
			
//			readGenericCall: function(oContext, oService, sPath, sPathKeys, aExpands, aFilters, successFunction, errorFunction) {
//		        if (oService && oService !== "") {
//		            var oModel = oContext.getModel(oService)
//		        } else {
//		            var oModel = oContext.getModel();
//		        }
//		        if (oModel) {
//		            if (sPathKeys && sPathKeys !== "") {
//		                var sPath = oModel.createKey(sPath, sPathKeys);
//		            }
//		            var oUrlparameters = {};
//		            if (aExpands) {
//		                oUrlparameters['$expand'] = aExpands;
//		            }
//		            oContext.openBusyDialog();
//		            oModel.read(sPath, {
//		                urlParameters: oUrlparameters,
//		                filters: aFilters,
//		                success: jQuery.proxy(function(oRet) {
//		                    this.closeBusyDialog();
//		                    successFunction(oRet, oContext);
//		                }, oContext),
//		                error: jQuery.proxy(function(oRet) {
//		                    this.closeBusyDialog();
//		                    errorFunction(oRet, oContext);
//		                }, oContext)
//		            });
//		        }
//		    },
//		    
//		    createGenericCall: function(oContext, oService, sPath, dataPayload, successFunction, errorFunction) {
//		        if (oService && oService !== "") {
//		            var oModel = oContext.getModel(oService)
//		        } else {
//		            var oModel = oContext.getModel();
//		        }
//		        if (oModel) {
//		            oContext.openBusyDialog();
//		            oModel.create(sPath, dataPayload, {
//		                async: true,
//		                success: jQuery.proxy(function(oRet) {
//		                    this.closeBusyDialog();
//		                    successFunction(oRet, this);
//		                }, oContext),
//		                error: jQuery.proxy(function(oRet) {
//		                    this.closeBusyDialog();
//		                    errorFunction(oRet, this);
//		                }, oContext),
//		            });
//		        }
//		    },
//		    
			 genericErrorCallback: function(oRet, oContext) {
		        if (oRet.responseText && oRet.responseText !== "") {
		            jsonResponse = JSON.parse(oRet.responseText);
		            if (jsonResponse.error && jsonResponse.error.message && jsonResponse.error.message.value) {
		                var sTitle = oContext._oResourceBundle.getText("advertencia");
		                var sText = jsonResponse.error.message.value;
		                ofertas.util.utils.onShowMessageDialog(sTitle, "None", sText, true, false, "", oContext);
		            } else {
		                var sTitle = oContext._oResourceBundle.getText("advertencia");
		                var sText = oContext._oResourceBundle.getText("genericComunicationError");
		                ofertas.util.utils.onShowMessageDialog(sTitle, "None", sText, true, false, "", oContext);
		            }
		        }
		    },
			
			
			// Funcion para formatear los datos de las estaciones y bindearlos al grafo
			formatDataEstacionsReturn: function(oData){
				var oFormattedData = {
										BVNodes:[], 
										BVLines:[], 
										LANodes:[], 
										LALines:[]
									};
				var i, j, NivellX, NivellY, childrensLength;
				
				for( i=0 ; i<oData.length ; i++){
					// Primero formateamos las conexiones para tener un array en vez de un string
					oData[i].Estacioseguent = oData[i].Estacioseguent.split(";");
					childrensLength = oData[i].Estacioseguent.length;
					// Separamos los niveles en ejes X e Y
					oData[i].Nivell = oData[i].Nivell.split(";");
					NivellX = oData[i].Nivell[0];
					NivellY = oData[i].Nivell[1];
//					DEVNOTES: Proporciones X e Y
					oData[i].laneId = parseFloat(NivellX)*125;
					oData[i].Nivell = parseFloat(NivellY)*125;
					
//					Añadimos el action button custom
					oData[i].actionButtons = [ {icon: "sap-icon://display"} ];
					
					// Comprobamos a que linea pertenece la estacion
					if(oData[i].Linia === "DEPENDENCIA_BV"){
						// Separamos en dos tipos de estructuras, los nodos (eje Y para saber la altura
						// de cada nodo)
						// Y las lineas son el componente Columna (eje X)
												
						// Montamos la estructura del Nodo y pusheamos al array con los datos
						// formateados
						oFormattedData.BVNodes.push(oData[i]);
						
						// Montamos la estructura de las Lineas y pusheamos al array con los datos
						// formateados
						for( j=0 ; j<childrensLength ; j++){
							if( oData[i].Estacioseguent[j] !== "" ){
								oFormattedData.BVLines.push({
									from: oData[i].Codiest,
									to: oData[i].Estacioseguent[j]
								});
							}
						}
					}else if(oData[i].Linia === "DEPENDENCIA_LA"){
						// Montamos la estructura del Nodo y pusheamos al array con los datos
						// formateados
						oFormattedData.LANodes.push(oData[i]);
						
						// Montamos la estructura de las Lineas y pusheamos al array con los datos
						// formateados
						for( j=0 ; j<childrensLength ; j++){
							if( oData[i].Estacioseguent[j] !== "" ){
								oFormattedData.LALines.push({
									from: oData[i].Codiest,
									to: oData[i].Estacioseguent[j]
								});
							}
						}
					}
				}
				return oFormattedData;
			},
			
			
//			Boton custom para ver el detalle de las estaciones en el graph
			customButtonGraphPress: function(oEvent){
				if(oEvent.getSource()){
					var oNode = oEvent.getSource();
					if(oNode.getBindingContext("oModelEstacions")){
						var oNodeObject = oNode.getBindingContext("oModelEstacions").getObject();
						this.setAuxModel(this, "oModelNodeDetail", oNodeObject);
						
						this._getPopoverNodeDetailCustom("zpmdocmedicio.view.Fragments.NodeDetailCustom").openBy(oNode);
					}
				}
			},
			
			
			_getPopoverNodeDetailCustom: function (sDialogFragmentName) {
				var oPopover = this._oPopoverNodeDetail;
				// Comprobamos que no tenga nada dentro el popover y si es asi lo rellenamos, si no lo devolvemos tal cual
				if (!oPopover) {
					oPopover = sap.ui.xmlfragment(sDialogFragmentName, this);
					this.getView().addDependent(oPopover);
					this._oPopoverNodeDetail = oPopover;
				}
//				this.colorNodeDetailList();
				return oPopover;
			},
			
			colorNodeDetailList: function(){
				var oDetailList = sap.ui.getCore().byId("nodeDetailList");
				if(oDetailList){
					var oItems = oDetailList.getItems();
					if(oItems.length > 0){
						var oActualItem, actualItemObject, newStyleClass;
						for(var i=0 ; i<oItems.length ; i++){
//							Primero eliminamos la clase y recuperamos los datos de la linea
							oActualItem = oItems[i];
							oActualItem.removeStyleClass();
							actualItemObject = oActualItem.getBindingContext("oModelNodeDetail").getObject();
							newStyleClass = "";
							switch (actualItemObject.Prioritat){
							  case "ALTA":
								  newStyleClass = "customItemRed";
								  break;
							    
							  case "MEDIA":
								  newStyleClass = "customItemOrange";
								  break;
							    
							  case "TRIMESTRAL":
								  newStyleClass = "customItemOrange";
								  break;
							    
							  case "BAJA":
								  newStyleClass = "customItemGreen";
							    	break;
							    
							  default:
							    	break;
							}
							if(newStyleClass !== "") oActualItem.addStyleClass(newStyleClass);
						}
					}
				}
			},
			
			
			// Metodo generico para remover duplicados de un array por un campo key (por
			// ejemplo eliminar duplicados por el campo key "Nombre" de un array )
			getUniqueListBy: function(arr, key){
				var uniqueArray = [...new Map(arr.map(item => [item[key], item])).values()]
			    return uniqueArray;
			},
			
			// Metodo generico para setear un modelo con datos en la vista
			setAuxModel: function(oContext, modelName, modelData){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setSizeLimit("9999");
				oModel.setData(modelData);
				oContext.getView().setModel(oModel, modelName);
			},
			
			onPressDataPointChartPrioritats: function(oEvent){
				var oID = oEvent.getParameter("id");
				var oDependencia;
				var oModelPrioritats = sap.ui.getCore().getModel("oModelPrioritats");
				if(oModelPrioritats){
					var oModelPrioritatsData = oModelPrioritats.getData();
//					Recuperamos la dependencia en la que estamos ahora mismo
					if(oID.lastIndexOf("idBulletChartPrioritatsBVVizFrame") !== -1){
						oDependencia = "DEPENDENCIA_BV";
					}else{
						oDependencia = "DEPENDENCIA_LA";
					}
					if(oEvent.getParameter("data") && oEvent.getParameter("data").length > 0){
						var oData = oEvent.getParameter("data")[0].data;
						var oPrioritat = oData.Prioritat
//						Recuperamos las prioridades seleccionadas
						var oMatchingPrioritat = oModelPrioritatsData.filter(function(value){
                            if(value.Columna === oPrioritat){
                            	return value;
                            }
                            else return "";
						});
						if(oMatchingPrioritat.length > 0){
							var oPrioritatsFilters = oMatchingPrioritat[0].Valors;
//							Navegamos a la app llistat avisos con los filtros correspondientes
							var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
							var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
								target:{
									semanticObject: "ZPM_FIORI",
									action: "Llistat_Avisos"
								},
								params:{
									"ID": "BarPrioritatsNavigation",
									"Dependencia": oDependencia,
									"Prioritats": oPrioritatsFilters
								}
							})) || ""; 
							var url = window.location.href.split('#')[0] + hash;

							sap.m.URLHelper.redirect(url, true);
							
						}
						
					}
				}
			},
			
			onPressDataPointChartEquips: function(oEvent){
				var oID = oEvent.getParameter("id");
				var oDependencia;
				var oModelClaseEquip = sap.ui.getCore().getModel("oModelClaseEquip");
				if(oModelClaseEquip){
					var oModelClaseEquipData = oModelClaseEquip.getData();
//					Recuperamos la dependencia en la que estamos ahora mismo
					if(oID.lastIndexOf("idBulletChartEquipsBVVizFrame") !== -1){
						oDependencia = "DEPENDENCIA_BV";
					}else{
						oDependencia = "DEPENDENCIA_LA";
					}
					if(oEvent.getParameter("data") && oEvent.getParameter("data").length > 0){
						var oData = oEvent.getParameter("data")[0].data;
						var oEquip = oData.Equip
						if(oEquip !== "Altres"){
//							Recuperamos las prioridades seleccionadas
							var oMatchingEquip = oModelClaseEquipData.filter(function(value){
	                            if(value.Columna1 === oEquip){
	                            	return value;
	                            }
	                            else return "";
							});
							if(oMatchingEquip.length > 0){
								var oEquipsFilters = oMatchingEquip[0].Valors;
//								Navegamos a la app llistat avisos con los filtros correspondientes
								var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
								var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
									target:{
										semanticObject: "ZPM_FIORI",
										action: "Llistat_Avisos"
									},
									params:{
										"ID": "BarEquipsNavigation",
										"Dependencia": oDependencia,
										"Equips": oEquipsFilters
									}
								})) || ""; 
								var url = window.location.href.split('#')[0] + hash;

								sap.m.URLHelper.redirect(url, true);
								
							}
						}
						
					}
				}
			},
			
			
			onPressNodeGraphBV: function (oEvent) {
//				var Numdoc = oEvent.getSource().getBindingContext().getObject().Ordre;
				var oEstacio = oEvent.getSource().getTitle();
				var oGraphBV = this.getView().byId("graphBV");
				var oSelectedEquipFilter = "";
				if(oGraphBV){
					var oGraphToolbar = oGraphBV.getToolbar();
					var oGraphFilterSelect = oGraphToolbar.getContent()[0];
					var oSelectedItem = oGraphFilterSelect.getSelectedItem();
					if(oSelectedItem){
						oSelectedEquipFilter = this.recuperarGrupoPlanificadorDelEquipo(oSelectedItem.getKey());
					}
				}
				
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target:{
						semanticObject: "ZPM_FIORI",
						action: "Llistat_Avisos"
					},
					params:{
						"ID": "GraphNavigation",
						"Dependencia": "DEPENDENCIA_BV",
						"Estacio": oEstacio,
						"Equips": oSelectedEquipFilter
					}
				})) || ""; 
				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			},
			
			onPressNodeGraphLA: function (oEvent) {
//				var Numdoc = oEvent.getSource().getBindingContext().getObject().Ordre;
				var oEstacio = oEvent.getSource().getTitle();
				var oGraphBV = this.getView().byId("graphBV");
				var oSelectedEquipFilter = "";
				if(oGraphBV){
					var oGraphToolbar = oGraphBV.getToolbar();
					var oGraphFilterSelect = oGraphToolbar.getContent()[0];
					var oSelectedItem = oGraphFilterSelect.getSelectedItem();
					if(oSelectedItem){
						oSelectedEquipFilter = this.recuperarGrupoPlanificadorDelEquipo(oSelectedItem.getKey());
					}
				}
				
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target:{
						semanticObject: "ZPM_FIORI",
						action: "Llistat_Avisos"
					},
					params:{
						"ID": "GraphNavigation",
						"Dependencia": "DEPENDENCIA_LA",
						"Estacio": oEstacio,
						"Equips": oSelectedEquipFilter
					}
				})) || ""; 
				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
			},
			
			recuperarGrupoPlanificadorDelEquipo: function(oEquip){
				var oModelClaseEquip = sap.ui.getCore().getModel("oModelClaseEquip");
				if(oModelClaseEquip){
					var oModelClaseEquipData = oModelClaseEquip.getData();
					if(oEquip !== "Altres" && oEquip !== ""){
//						Recuperamos las prioridades seleccionadas
						var oMatchingEquip = oModelClaseEquipData.filter(function(value){
                            if(value.Columna === oEquip){
                            	return value;
                            }
                            else return "";
						});
						if(oMatchingEquip.length > 0){
							var oEquipsFilters = oMatchingEquip[0].Valors;
							return oEquipsFilters;
						}else return "";
					}else return "";
				}
			},
			
			onPressNavList: function (oEvent) {
				var Numdoc = oEvent.getSource().getBindingContext().getObject().Ordre; 
//				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); 
//				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
//					target: {
//						semanticObject: "ZPM_FIORI",
//						action: "Llistat_Avisos&/"+Numdoc
//					}
//				})) || ""; // generate the Hash to display a Supplier
//				oCrossAppNavigator.toExternal({
//					target: {
//						shellHash: hash
//					}
//				}); // navigate to Supplier application
//				var Numdoc = oEvent.getSource().getBindingContext().getObject().Numdoc; // read SupplierID from OData path Product/SupplierID
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
				var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
					target:{
						semanticObject: "ZPM_FIORI",
						action: "Gest_Map"
					},
					params:{
						"ID": Numdoc
					}
				})) || ""; // generate the Hash to display a Supplier
//				oCrossAppNavigator.toExternal({
//					target: {
//						shellHash: hash
//					}
//				}); // navigate to Supplier application
				
				var url = window.location.href.split('#')[0] + hash;

				sap.m.URLHelper.redirect(url, true);
				
//				oCrossAppNavigator.toExternal({
//						target:{
//							semanticObject: "ZPM_FIORI",
//							action: "Gest_Map"
//						},
//						params:{
//							 "ID": Numdoc
//						 }
//				});
			}
			
		});
	});