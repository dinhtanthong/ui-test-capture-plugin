app.controller('ReviewCtrl', function($scope, $rootScope, $location, $http, $routeParams, $timeout, Review) {
	
	$scope.loop=function(){
		Review.queryLastBuild($scope.urlPrefix).success(function(data) {	//Controle de execução do Job
			$scope.runningStatus=true;
			if(data.result === null){
				$scope.runningStatus=true;
				$scope.exec=data.id;
			}else{
				$scope.runningStatus=false;
			}
		});
	
		Review.consultarHistoricoExecSize($scope.job, $scope.exec, $scope.urlPrefixPlugin).success(function(data) {	//Consulta de informações dos itens
			//TODO: corrigir algoritmo inoperante
			if($scope.streamSize < data.size){
				$scope.updateStack();
			}
			$scope.streamSize = data.size;
		});	
		
		//TODO: migrar para o procedimento de execução do job
		Review.ajaxVerifyResults($scope.job, $scope.exec, $scope.urlPrefixPlugin).success(function(data) {
			//console.log(data);			
		});	//Consulta de mudança do número de itens e liquida as ocorrências de registros
	}

	$scope.updateClassification=function(test, status){
		Review.updateClassification($scope.job, test, status, $scope.urlPrefixPlugin).success(function(data) {
			$scope.updateStack();
		});
	}

	$scope.updateTestResultDescription=function(test, description){
		Review.updateTestResultDescription($scope.job, test, $scope.exec, description, $scope.urlPrefixPlugin).success(function(data) {});
	}

	$scope.updateTestDescription=function(test, description){
		Review.updateTestDescription($scope.job, test, description, $scope.urlPrefixPlugin).success(function(data) {});
	}

	$scope.updateTestBehaviour=function(test, description){
		Review.updateTestBehaviour($scope.job, test, description, $scope.urlPrefixPlugin).success(function(data) {});
	}

	$scope.updateExecutionDescription=function(description){
		Review.updateExecutionDescription($scope.job, $scope.exec, description, $scope.urlPrefixPlugin).success(function(data) {});
	}
	
	$scope.updateStack=function(){
		Review.ajaxQueryHistorico($scope.job, $scope.exec, $scope.doStream, $scope.streamSize, $scope.urlPrefixPlugin).success(function(data) {
			console.log(data);

			$scope.stack = data.stack;
			$scope.resume.passed = 0;
			$scope.resume.failed = 0;
			$scope.resume.flaky = 0;
			$scope.resume.total = $scope.stack.length;
			for(var i=0;i<$scope.stack.length;i++){	//Parse do histório TODO: trazer parseado
				$scope.stack[i].historicoStatus = jQuery.parseJSON($scope.stack[i].historico);
				($scope.stack[i].status=='sucesso'&&($scope.stack[i].classificacao!='app_fail'&&$scope.stack[i].classificacao!='test_fail')?$scope.resume.passed++:"");
				($scope.stack[i].status=='falha'&&($scope.stack[i].classificacao!='app_fail'&&$scope.stack[i].classificacao!='test_fail')?$scope.resume.failed++:"");
				($scope.stack[i].classificacao=='test_fail'?$scope.resume.flaky++:"");
				($scope.stack[i].classificacao=='app_fail'?$scope.resume.knowissue++:"");
			}
		});		
	}
	
	$scope.resetResume=function(){
		$scope.resume= {passed:0,failed:0,working:0,operational:0,flaky:0,knowissue:0,total:0};
	}
	
	$scope.runJob=function(){
		$scope.stack={};
		$scope.resetResume();
		Review.runJob(urlRunJob).success(function(data) {});
	}
	$scope.setExec=function(pExec){
		console.log(pExec);
		$scope.exec = pExec;
	}
	
	$scope.urlPrefix = '/jenkins/job/'+job;
	$scope.urlPrefixPlugin = '/jenkins/job/'+job+'/ui-test-capture';
	$scope.job=job;
	$scope.nextBuild=nextBuild;
	$scope.previousBuild=previousBuild;
	$scope.relativepath=relativepath;
	$scope.doStream=doStream;
	$scope.doAppend=false;
	$scope.runningStatus=false;
	$scope.streamSize=0;
	$scope.lastToken="";
	$scope.stack={};
	$scope.exec=execParam;
	$scope.resetResume();
	
	//Loop 'do while' forever
	$scope.loop();
	window.setInterval(function(){
		$scope.loop();
	},2000);	
});	