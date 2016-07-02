app.factory('Review', function($http) {  

    var _readResults = function(job, exec, stream, streamsize) {
    	return $http({
    	    method: 'POST',
    	    url: 'ui-test-capture/ajaxQueryHistorico',
    	    data: $.param({job:job, exec:exec, stream:stream, streamsize:streamsize}),
    	    headers: {'Content-Type': 'multipart/form-data'}
    	});
    }

    var _historico = function() {
    	//url+"ui-test-capture/ajaxQueryHistorico
        return $http.get('api/auth/validate');
    }

	return {
		readResults: _readResults,
		validate: _validate
	};
});

/*
	function ajaxSubmit(obj){
		var stringAnterior = document.getElementById(obj.name).value;
		var jsonObj = {id: obj.name, status: obj.value}	
		jQuery.post(url+"ui-test-capture/ajaxProcess", jsonObj, function( data ) {
			atualizarQuadroFalhas();
		});
	}
		
	function ajaxReadResult(exec, stream){
		var streamsize = tests.length;
		var jsonObj = {job:job, exec:exec, stream:stream, streamsize:streamsize};
		var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxQueryHistorico", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
		return jQuery.parseJSON(response);
	}

	function ajaxReadResultSize(exec){
		var jsonObj = {job:job, exec:exec};
		var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/consultarHistoricoExecSize", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
		return jQuery.parseJSON(response);
	}
	
	function ajaxVerifyResults(){
		var jsonObj = {job:job, exec:descVersaoAtual};
		var response = jQuery.ajax({type:"GET", url:url+"ui-test-capture/ajaxVerifyResults", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	}
	
	function ajaxUpdateQuarantineDescription(test){
		var jsonObj = {job:job, test:test, statusDescription: jQuery("[id='description "+test+"']").val()}	
		var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxUpdateQuarantineDescription", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	}

	//buildInfo = jQuery.parseJSON(jQuery.ajax({ type:"GET", url:url+"/lastBuild/api/json", async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8"}).responseText);
*/


/*
function ajaxUpdateQuarantine(obj){
	var stringAnterior = document.getElementById(obj.name).value;
	var jsonObj = {job:job, test: obj.name, status: obj.value}	
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxUpdateQuarantine", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;

	if(obj.value == "app_fail"){
		jQuery("[id='container "+obj.name+"']").detach().appendTo("#dlFailApp");				
	}else{
		if(obj.value == "test_fail"){
			jQuery("[id='container "+obj.name+"']").detach().appendTo("#dlFailTest");		
		}else{			
			jQuery("[id='container "+obj.name+"']").detach().appendTo("#execucao");		
		}
	}
	jQuery("[id='container "+obj.name+"'] > dd").hide();		
	atualizarTotais();
}

function ajaxUpdateQuarantineDescription(test){
	var jsonObj = {job:job, test:test, statusDescription: jQuery("[id='description "+test+"']").val()}	
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxUpdateQuarantineDescription", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	document.getElementById("description-status-"+test.replace(/\./g,"")).innerHTML = "Saved";
}

function ajaxUpdateQuarantineResult(test){
	var jsonObj = {job:job, test:test, exec:descVersaoAtual, statusResult: jQuery("[id='result "+test+"']").val()}
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxUpdateQuarantineResult", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	document.getElementById("result-status-"+test.replace(/\./g,"")).innerHTML = "Saved";
}

function ajaxUpdateQuarantineBehavior(test){
	var jsonObj = {job:job, test:test, statusBehavior: jQuery("[id='behavior "+test+"']").val()}	
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxUpdateQuarantineBehavior", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	document.getElementById("behavior-status-"+test.replace(/\./g,"")).innerHTML = "Saved";
	if(jQuery("[id='behavior "+test+"']").val() != ""){
		document.getElementById("label "+test+"").innerHTML = jQuery("[id='behavior "+test+"']").val();		
	}else{
		document.getElementById("label "+test+"").innerHTML = test;
	}
}

function ajaxUpdateExecDescription(){
	var jsonObj = {job:job, exec:descVersaoAtual, description: jQuery("[id='execdescription']").val()}
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/ajaxUpdateExecDescription", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	document.getElementById("execdescription-status").innerHTML = "Saved";
}

function ajaxGetExecutions(){
	var jsonObj = {job:job}
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/getExecutions", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	return response;
}


function atualizarTotais(){
	var jsonObj = {job:job, exec:descVersaoAtual};
	var response = jQuery.ajax({type:"POST", url:url+"ui-test-capture/consultarQuadro", data:jsonObj, async:false, contentType: "application/x-www-form-urlencoded;charset=UTF-8" }).responseText;
	var retorno = jQuery.parseJSON(response);
	var success = 0;
	var fail = 0;
	var app_fail = 0;
	var test_fail = 0;
	var working = 0;
	var notQuarantined = 0;
	var total = 0;
	for(var i=0; i<retorno.length;i++){
		if(retorno[i].label == "success")success = parseInt(retorno[i].total);
		if(retorno[i].label == "fail")fail = parseInt(retorno[i].total);
		if(retorno[i].label == "app_fail")app_fail = parseInt(retorno[i].total);
		if(retorno[i].label == "test_fail")test_fail = parseInt(retorno[i].total);
		if(retorno[i].label == "working")notQuarantined = parseInt(retorno[i].total);
		working = notQuarantined+app_fail;
		total = app_fail+test_fail+notQuarantined;
	}
	jQuery(".passou").html(success);
	jQuery(".falhou").html(fail);
	jQuery(".working").html(working);
	jQuery(".flaky").html(test_fail);
	jQuery(".total").html(total);
	jQuery("#resultado").show();
}
*/