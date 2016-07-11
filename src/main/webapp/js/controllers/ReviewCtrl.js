app.controller('ReviewCtrl', function($scope, $rootScope, $location, $http, $routeParams, $timeout, Review) {

	$scope.url = url;
	$scope.baseurl = baseurl;
	$scope.urlPrefix = '/jenkins/job/'+job;
	$scope.urlPrefixPlugin = '/jenkins/job/'+job+'/ui-test-capture';
	$scope.execDescription="";
	$scope.doAppend=false;
	$scope.runningStatus=false;
	$scope.streamSize=0;
	$scope.historyPosition=0;
	$scope.lastToken="";
	$scope.stack={};
	$scope.executionHistoryLast10={};
	$scope.executionHistory={};

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
			if($scope.streamSize < data.size){
				$scope.updateStack();
			}
			$scope.streamSize = data.size;
		});
	}
	
	$scope.updateClassification=function(test, status){
		Review.updateClassification($scope.job, test, status, $scope.urlPrefixPlugin).success(function(data) {
			$scope.updateStack();
		});
	}
	
	$scope.showLast10ExecStatus=false;
	$scope.showLast10Exec=function(){
		if($scope.showLast10ExecStatus)
			$scope.showLast10ExecStatus=false;
		else
			$scope.showLast10ExecStatus=true;
	}
	
	$scope.showTestResultDescriptionStatus=false;
	$scope.showTestResultDescription=function(){
		if($scope.showTestResultDescriptionStatus)
			$scope.showTestResultDescriptionStatus=false;
		else
			$scope.showTestResultDescriptionStatus=true;
	}

	$scope.updateTestResultDescription=function(test, description){
		Review.updateTestResultDescription($scope.job, test, $scope.exec, description, $scope.urlPrefixPlugin).success(function(data) {
			$scope.showTestResultDescription();			
		});
	}

	$scope.showTestDescriptionStatus=false;
	$scope.showTestDescription=function(){
		if($scope.showTestDescriptionStatus)
			$scope.showTestDescriptionStatus=false;
		else
			$scope.showTestDescriptionStatus=true;
	}

	$scope.updateTestDescription=function(test, description){
		Review.updateTestDescription($scope.job, test, description, $scope.urlPrefixPlugin).success(function(data) {
			$scope.showTestDescription();			
		});
	}

	$scope.showTestBehaviourStatus=false;
	$scope.showTestBehaviour=function(){
		if($scope.showTestBehaviourStatus)
			$scope.showTestBehaviourStatus=false;
		else
			$scope.showTestBehaviourStatus=true;
	}

	$scope.updateTestBehaviour=function(test, description){
		Review.updateTestBehaviour($scope.job, test, description, $scope.urlPrefixPlugin).success(function(data) {
			$scope.showTestBehaviour();			
		});
	}

	$scope.showExecutionDescriptionStatus=false;
	$scope.showExecutionDescription=function(){
		if($scope.showExecutionDescriptionStatus){
			$scope.showExecutionDescriptionStatus=false;
		}else{
			$scope.showExecutionDescriptionStatus=true;
		}
	}

	$scope.updateExecutionDescription=function(description){
		Review.updateExecutionDescription($scope.job, $scope.exec, description, $scope.urlPrefixPlugin).success(function(data) {
			$scope.execDescription = description;
			$scope.showExecutionDescription();
		});
	}
	
	$scope.updateStack=function(){
		Review.ajaxQueryHistorico($scope.job, $scope.exec, $scope.doStream, $scope.streamSize, $scope.urlPrefixPlugin).success(function(data) {
			$scope.stack = data.stack;
			$scope.resume.passed = 0;
			$scope.resume.failed = 0;
			$scope.resume.flaky = 0;
			$scope.resume.knowissue = 0;
			$scope.resume.total = $scope.stack.length;
			for(var i=0;i<$scope.stack.length;i++){	//Parse do histório TODO: trazer parseado pela API
				try{
					$scope.stack[i].historicoStatus = jQuery.parseJSON($scope.stack[i].historico);

					//sumPassedStats
					var sumhist = 10;
					$scope.stack[i].sumPassed=0;
					if($scope.stack[i].historicoStatus.length<10)
						sumhist = $scope.stack[i].historicoStatus.length;
					for(var j=0; j<sumhist;j++){
						if($scope.stack[i].historicoStatus[j].status=='passed'){
							$scope.stack[i].sumPassed++;
						}
					}
				}catch(err){}
				($scope.stack[i].status=='passed'&&($scope.stack[i].classificacao!='app_fail'&&$scope.stack[i].classificacao!='test_fail')?$scope.resume.passed++:"");
				(($scope.stack[i].status=='error'||$scope.stack[i].status=='failure'||$scope.stack[i].status=='skipped')&&($scope.stack[i].classificacao!='app_fail'&&$scope.stack[i].classificacao!='test_fail')?$scope.resume.failed++:"");
				($scope.stack[i].classificacao=='test_fail'?$scope.resume.flaky++:"");
				($scope.stack[i].classificacao=='app_fail'?$scope.resume.knowissue++:"");
				$scope.execDescription = $scope.stack[i].execDescription;
			}

			$scope.getAllResults();
		});	
	}

	$scope.getAllResults=function(){
		Review.allResults($scope.job, $scope.urlPrefixPlugin).success(function(data) {
			$scope.executionHistory = data;
			
			//last 10 executions ref
			var sizeHis=10;
			if($scope.executionHistory.length<10)
				sizeHis=$scope.executionHistory.length;
			for(var i=0;i<sizeHis;i++){
				try{$scope.executionHistoryLast10[i] = $scope.executionHistory[i];}catch(err){}
			}
		});
	}
	
	$scope.historyPrevious=function(){
		if($scope.historyPosition <= $scope.executionHistory.length){
			$scope.historyPosition++;
		}
		$scope.historySetType();
		$scope.changeRun($scope.executionHistory[$scope.historyPosition].id);
	}
	
	$scope.historyNext=function(){
		if($scope.historyPosition > 0){
			$scope.historyPosition--;
		}
		$scope.historySetType();
		$scope.changeRun($scope.executionHistory[$scope.historyPosition].id);
	}

	$scope.historySetType=function(){
		if($scope.executionHistory == 0){
			$scope.historyType="present";
		}else{
			$scope.historyType="past";			
		}
	}
	
	$scope.changeRun=function(idExec){
		$scope.exec = idExec;
		$scope.updateStack();		
	}
	
	$scope.resetResume=function(){
		$scope.resume= {passed:0,failed:0,working:0,operational:0,flaky:0,knowissue:0,total:0};
		$scope.showLast10ExecStatus=false;
		$scope.execDescription = "";
	}
	
	$scope.runJob=function(){
		Review.runJob($scope.baseurl+'job/'+$scope.job+'/build?delay=0sec').success(function(data) {});
		$scope.runningStatus=true;
		$scope.resetResume();
		$scope.stack={};
	}
	$scope.setExec=function(pExec){
		console.log(pExec);
		$scope.exec = pExec;
	}
	
	$scope.job=job;
	$scope.relativepath=relativepath;
	$scope.doStream=doStream;
	$scope.exec=execParam;
	$scope.resetResume();
	
	//Loop 'do while' forever
	$scope.loop();
	window.setInterval(function(){
		$scope.loop();
	},2000);	
});	