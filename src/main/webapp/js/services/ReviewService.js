app.factory('Review', function($http) {  

    var _consultarHistoricoExecSize = function(job, exec, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/consultarHistoricoExecSize',
    	    data: Object.toparams({job:job, exec:exec}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});
    }

    var _updateTestResultDescription = function(job, test, exec, description, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/ajaxUpdateQuarantineResult',
    	    data: Object.toparams({job:job, test:test, exec:exec, statusResult:description}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});    	    	
    }

    var _updateTestDescription = function(job, test, description, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/ajaxUpdateQuarantineDescription',
    	    data: Object.toparams({job:job, test:test, statusDescription: description}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});    	    	
    }

    var _updateTestBehaviour = function(job, test, description, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/ajaxUpdateQuarantineBehavior',
    	    data: Object.toparams({job:job, test:test, statusBehavior: description}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});    	    	
    }
    
    var _updateExecutionDescription = function(job, exec, description, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/ajaxUpdateExecDescription',
    	    data: Object.toparams({job:job, exec:exec, description:description}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});    	    	
    }
    
    var _updateClassification = function(job, test, status, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/ajaxUpdateQuarantine',
    	    data: Object.toparams({job:job, test:test, status:status}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});    	
    }
    
    var _ajaxVerifyResults = function(job, exec, prefix) {
        return $http.get(prefix+'/ajaxVerifyResults?job='+job+'&exec='+exec);
    }

    var _runJob = function(url) {
        return $http.get(url);
    }

    var _queryLastBuild = function(prefix) {
        return $http.get(prefix+"/lastBuild/api/json");
    }
    
    var _ajaxQueryHistorico = function(job, exec, stream, streamsize, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/ajaxQueryHistorico',
    	    data: Object.toparams({job:job, exec:exec, stream:stream, streamsize:streamsize}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});
    }

    var _lastResults = function(job, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/getExecutions',
    	    data: Object.toparams({job:job}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});
    }    
    
    var _allResults = function(job, prefix) {
    	return $http({
    	    method: 'POST',
    	    url: prefix+'/getAllExecutions',
    	    data: Object.toparams({job:job}),
    	    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});
    }    
    
    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    };    
    
    return {
    	allResults: _allResults,
    	lastResults: _lastResults,
    	updateTestResultDescription: _updateTestResultDescription,
        updateTestDescription: _updateTestDescription,
        updateTestBehaviour: _updateTestBehaviour,
        updateExecutionDescription: _updateExecutionDescription,
    	updateClassification :_updateClassification,
    	consultarHistoricoExecSize: _consultarHistoricoExecSize,
    	ajaxVerifyResults: _ajaxVerifyResults,
    	ajaxQueryHistorico: _ajaxQueryHistorico,
    	queryLastBuild: _queryLastBuild,
    	runJob: _runJob
	};
});