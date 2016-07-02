app.controller('ReviewCtrl', function($scope, $rootScope, $location, $http, $routeParams, $timeout, Review) {

	$scope.appendResult=function(){
		/*
		
		if($('#execdescription').val() == "" && obj.execDescription != ""){
			$('#execdescription').val(obj.execDescription);
		}
		
		if(obj.id_exec == descVersaoAtual || versaoAtual == 0){
			
			//Index
			tests.push(obj.metodo);
			atualizarTotais();
			
			//GC TestInfo
			var appendList = "#execucao";
			var rawObj = JSON.stringify(obj);
			if(obj.classificacao=='app_fail'){
				appendList = '#dlFailApp';
			}
			if(obj.classificacao=='test_fail'){
				appendList = '#dlFailTest';
			}
			
			//Título
			var comboAnaliseSuccess="<select id=\"analise "+obj.metodo+"\" name=\""+obj.metodo+"\" onChange=\"ajaxUpdateQuarantine(this);\" class=\"comboAnalise\"><option value=\"\">Move to quarantine</option><option value=\"app_fail\">App Failure</option><option value=\"test_fail\">Test Failure</option><option value=\"\">Remove from quarantine</option></select>";
			var comboAnaliseFailure="<select id=\"analise "+obj.metodo+"\" name=\""+obj.metodo+"\" onChange=\"ajaxUpdateQuarantine(this);\" class=\"comboAnalise\"><option value=\"\">Move to quarantine</option><option value=\"app_fail\">App Failure</option><option value=\"test_fail\">Test Failure</option><option value=\"\">Remove from quarantine</option></select>";
			var titulo = "<div class=\"containerTeste\" id=\"container "+obj.metodo+"\">";
			var label = "";
			if(obj.behavior != ""){
				label = obj.behavior;
			}else{
				label = obj.metodo;				
			}
			if(obj.status == "sucesso"){
				titulo+= "<dt class=\"containerPassou\"><img src=\"images/passed.gif\" class=\"itemUiTest itemPassou\" /> <a href=\"\" id=\"label "+obj.metodo+"\">"+label+" </a></dt>";
			}else{
				titulo+= "<dt class=\"containerFalhou\"><img src=\"images/failed.png\" class=\"itemUiTest itemFalhou\" /> <a href=\"\" id=\"label "+obj.metodo+"\">"+label+" </a></dt>";
			}
	
			var historicoStatus = "";
			var buildHistory = jQuery.parseJSON(obj.historico);
			for(var cont=0; cont<buildHistory.length; cont++){
				historicoStatus+=buildHistory[cont].id_exec+":";
				if(buildHistory[cont].status == "sucesso"){
					historicoStatus+="<img src=\"images/passed.gif\" class=\"imgstatus\" />";
				}else{
					historicoStatus+="<img src=\"images/failed.png\" class=\"imgstatus\" />";					
				}
				if(cont<buildHistory.length-1){
					historicoStatus+=", ";
				}
			}
			$(appendList).append(
				titulo  +
				"<dd style=\"display:none;\">" +
					"<input type=\"hidden\" id=\""+obj.metodo+"\" value='"+rawObj+"' />" +
					"<div class=\"infoUiTest\">" +
						"<div class=\"screenshot\"><h2>Screenshot:</h2>" +
							"<a href=\""+url+relativepath+"screenshots/"+obj.metodo+".png\" title=\""+obj.metodo+"\" class=\"linkScreenshot\">" +
								"<img src=\""+url+relativepath+"screenshots/"+obj.metodo+".png\" />" +
							"</a>" +
						"</div>" +
						"<div class=\"stackUiTest\"><h2>Stacktrace:</h2><pre class=\"stackUiTest\" id=\""+obj.metodo.replace(/\./g,"")+"\">"+obj.stacktrace+"</pre></div>" +
					"</div>" +
					"<div style=\"width: 100%; display: table; padding-right:90px; \">"+
						"<div class=\"observacoes\">" +
							"<h2>Result description:</h2>" +
							"<textarea  id=\"result "+obj.metodo+"\" class=\"todo\">"+obj.descricao+"</textarea>" +
							"<div class=\"description-commands\">" +
								"<span class=\"description-status\" id=\"result-status-"+obj.metodo.replace(/\./g,"")+"\"></span><input type=\"button\" value=\"Save\" onClick=\"javascript:ajaxUpdateQuarantineResult('"+obj.metodo+"');\" />" +
							"</div>" +
							"<div>" +
								"<h2>Result history:</h2> "+
								historicoStatus +		
							"</div>"+
						"</div>" +
						"<div class=\"observacoes\">" +
							"<h2>Test description:</h2>" +
							"<textarea  id=\"description "+obj.metodo+"\" class=\"todo\">"+obj.statusDescription+"</textarea>" +
							"<div class=\"description-commands\">" +
								"<span class=\"description-status\" id=\"description-status-"+obj.metodo.replace(/\./g,"")+"\"></span><input type=\"button\" value=\"Save\" onClick=\"javascript:ajaxUpdateQuarantineDescription('"+obj.metodo+"');\" />" +
							"</div>" +
							
							"<h2>Test behavior:</h2>" +
							"<input type=\"text\"  id=\"behavior "+obj.metodo+"\" class=\"behavior\" value=\""+obj.behavior+"\" />" +
							"<div class=\"description-commands\">" +
								"<span class=\"description-status\" id=\"behavior-status-"+obj.metodo.replace(/\./g,"")+"\"></span><input type=\"button\" value=\"Save\" onClick=\"javascript:ajaxUpdateQuarantineBehavior('"+obj.metodo+"');\" />" +
							"</div>" +
						"</div>"+
					"</div>"+
					"<br />"+
				
					((obj.status != "sucesso") ? 
						"<div class=\"comboAnalise\"><div><div class=\"analise\">"+comboAnaliseSuccess+"</div></div></div>":
						"<div class=\"comboAnalise\"><div><div class=\"analise\">"+comboAnaliseFailure+"</div></div></div>")+
				"</dd>" +
				"</div>"
			);
						
			$('.linkScreenshot').colorbox({retinaImage:true, retinaUrl:true});
			$('.accordion > div > dt > a').click(function() {
				$this = $(this);
				$target =  $this.parent().next();
				if(!$target.hasClass('active')){
					$('.active').removeClass('active').slideUp();
				     $target.addClass('active').slideDown();
				}
				return false;
			});
		}
		 * */
	}

	$scope.updateResume=function(){
		/*
		jQuery(".passou").html(0);
		jQuery(".falhou").html(0);
		jQuery(".working").html(0);
		jQuery(".flaky").html(0);
		jQuery(".total").html(0);
		jQuery("#resultado").show();
		 * */
	}
	
	$scope.appendExecutionHistory=function(){
/*
		$("#historyResult").html("");
		var executions = jQuery.parseJSON(ajaxGetExecutions());
		$("#historyResult").append("<h3>Last 10 runs</h3>");

		var concatExecutions='';
		for(var i=executions.length-1; i>=0; i--){
			concatExecutions+="<th style=\"min-width:30px;\">#"+executions[i].id+"</th>";
		}
		var headerTable="<table id='historyResultTable' style=\"width:90%;\"><tr class='no-sort'><th style=\"min-width:200px;\" class='no-sort'>Tests</th>"+concatExecutions+"<th style=\"text-align:center;min-width:50px;\" class='sort-default' data-sort-order='asc'>Fails</th></tr>";

		var bodyTable ='';
		for(var j=0; j<obj.stack.length; j++){
			var concatLine = '';
			var fails = 0;
			concatLine+="<td>"+obj.stack[j].classe+"</td>";
			var tmpTestHistory = jQuery.parseJSON(obj.stack[j].historico);
			for(var i=executions.length-1; i>=0; i--){
				var flagFill = false;
				for(var k=tmpTestHistory.length-1; k>=0; k--){
					if(tmpTestHistory[k].id_exec == executions[i].id){
						if(tmpTestHistory[k].status=="sucesso"){
							concatLine+="<td style=\"text-align:center;\"><img src=\"images/passed.gif\" class=\"imgstatus\" /></td>";
							flagFill = true;
						}else{
							concatLine+="<td style=\"text-align:center;\"><img src=\"images/failed.png\" class=\"imgstatus\" /></td>";
							flagFill = true;
							fails++;
						}
					}
				}
				if(!flagFill){
					concatLine+="<td style=\"text-align:center;\">-</td>";					
				}
			}
			concatLine+="<td style=\"text-align:center;\" data-sort='"+fails+"'>"+fails+"</td>";					
			bodyTable+="<tr>"+concatLine+"</tr>";
		}
		bodyTable+="</table>";
		$("#historyResult").append(headerTable+bodyTable);
		
		new Tablesort(document.getElementById('historyResultTable'), {descending: false});
 * */		
	}
	
	$scope.resetTotals=function(){
		/*
 		jQuery(".passou").html(0);
		jQuery(".falhou").html(0);
		jQuery(".working").html(0);
		jQuery(".flaky").html(0);
		jQuery(".total").html(0);
		jQuery("#resultado").show();
 		* */		
	}
	
	$scope.uiInitRun=function(){
		
	}
	
	$scope.uiStopRun=function(){
		/*
		  jQuery(".reexec").fadeIn("slow");
		  jQuery(".loadingUiTest").hide();
		*/
	}
	  
	$scope.ordenar=function(){
		/*
		try{
			jQuery('#execucao .containerTeste').sortElements(function(a, b){return jQuery(a).attr('id') > jQuery(b).attr('id') ? 1 : -1;});
			jQuery('#dlFailApp .containerTeste').sortElements(function(a, b){return jQuery(a).attr('id') > jQuery(b).attr('id') ? 1 : -1;});
			jQuery('#dlFailTest .containerTeste').sortElements(function(a, b){return jQuery(a).attr('id') > jQuery(b).attr('id') ? 1 : -1;});
		}catch(err) {}
		*/
	}

	$scope.fetchBuffer=function(){
		/*
		jQuery.ajaxSetup({cache:false});

		if(historico){
			var jsonres = ajaxReadResult(descVersaoAtual, false);
			appendExecutionHistory(jsonres);
			parseBuffer(jsonres);  
		}else{
			var objLenght = ajaxReadResultSize(descVersaoAtual);
			ajaxVerifyResults();
			if(tests.length < objLenght){
				var jsonres = ajaxReadResult(descVersaoAtual, true);
				appendExecutionHistory(jsonres);
				parseBuffer(jsonres);
			}
		}
		*/
	}

	$scope.parseBufferfunction=function(json){
		/*
		for(var j=tests.length; j<json.stack.length; j++){
			appendResult(json.stack[j]);
		}
		if(!historico){
			ordenarNodos();					
		}
		atualizarTotais();
		*/
	}

	$scope.loop=function(){
		window.setInterval(function(){
			console.log('loop');
		},2000);
		
		/*
		//hide nextBuild
		if(nextBuild == ''){
			$(".nextBuild").css("display", "none");
		}
		
		fetchBuffer();
		atualizarTotais();
		if(!historico){
			window.setInterval(function(){
				fetchBuffer();
				//Restart run
				try{
					buildInfo = jQuery.parseJSON(jQuery.ajax({ type:"GET", url:url+"/lastBuild/api/json", async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8"}).responseText);
					if(buildInfo.result === null){
						uiInitRun();
					}else{
						uiStopRun();
					}
					//TODO: refatorar reinício da run para ficar mais consistente
					if(versaoAtual > 0 && versaoAtual!=buildInfo.id){
						tests = [];	
						zerarTotais();
					}
					versaoAtual = buildInfo.id;
					descVersaoAtual = buildInfo.id;
		  	  	}catch(err){}
			},2000);
		}
		*/
	}	
	
	$scope.loop();
});	