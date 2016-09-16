/*
 * The MIT License
 *
 * Copyright 2013 Praqma.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package br.vbathke.jenkins;

import hudson.model.ProminentProjectAction;
import hudson.model.AbstractProject;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;

import javax.servlet.ServletOutputStream;

import jenkins.model.Jenkins;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.FileUtils;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.StaplerResponse;
import br.vbathke.model.Execution;
import br.vbathke.model.Job;
import br.vbathke.model.Result;
import br.vbathke.model.Test;

public class UITestCaptureProjectAction implements ProminentProjectAction{

    public final AbstractProject<?,?> project;
    
    private String hash = "";
    private String fileString = "";
    
    public UITestCaptureProjectAction(AbstractProject<?,?> project) throws IOException, NoSuchAlgorithmException {
    	this.project = project;
    }

    @Override
    public String getIconFileName() {
        return "/plugin/ui-test-capture/images/uitestcapture.png";
    }

    @Override
    public String getDisplayName() {
        return "UI Test Capture";
    }

    @Override
    public String getUrlName() {
        return "ui-test-capture";
    }
    
    public AbstractProject<?,?> getProject(){
    	return project;
    }
    
    public String getName(){
    	return project.getName();
    }
    
    public String getVersaoAtual(){
    	String version = "";
    	try{
    		version= ""+project.getLastBuild().getNumber();
    	}catch(Exception e){}
    	return version;
    }
    
    public String getBuildArtifacts(){
    	return "ws/";
    }
    
    public String getProjectUrl(){
    	return getProject().getUrl();
    }

    public String getRootUrl(){
    	return ""+Jenkins.getInstance().getRootUrl();
    }
    
    public Object getUITestCaptureProjectAction(){
    	return UITestCaptureProjectAction.class;
    }

    public void doAjaxUpdateJobConfig(StaplerRequest request, StaplerResponse response) throws Exception {
		ServletOutputStream out = response.getOutputStream();
      	try {
	    	Job job = new Job(request.getParameter("job"));
	    	job.setXmlPath(request.getParameter("xmlpath"));
	    	job.setEvidencesPath(request.getParameter("evidencespath"));
	    	job.save();
			out.write(("{\"status\":\"success\"}").getBytes("UTF-8")); 
      	} catch (IOException e) {
			out.write(("{\"status\":\"fail\"}").getBytes("UTF-8")); 
		}
    }
    
    public void doAjaxQueryHistorico(StaplerRequest request, StaplerResponse response) throws Exception {
    	int streamsize = 0;
    	if(request.getParameter("streamsize") != null){
    		streamsize = Integer.parseInt(request.getParameter("streamsize"));
    	}
    	Job job = new Job(request.getParameter("job"));
    	Execution exec = new Execution(request.getParameter("exec"), job.getId());
    	String historico = exec.consultarHistoricoExec(request.getParameter("stream"), streamsize);
      	try {
			ServletOutputStream out = response.getOutputStream();
			out.write((historico).getBytes("UTF-8")); 
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }
    
    public void doAjaxUpdateQuarantine(StaplerRequest request, StaplerResponse response) {
    	Test test = new Test(request.getParameter("job"), request.getParameter("test"));
    	test.setStatus(request.getParameter("status"));
    	test.save();
      	try {
			response.getOutputStream().println("{\"message\":\"sucesso\"}");
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }

    public void doAjaxUpdateQuarantineDescription(StaplerRequest request, StaplerResponse response) {
    	Test test = new Test(request.getParameter("job"), request.getParameter("test"));
    	test.setStatusDescription(request.getParameter("statusDescription"));
    	test.save();
      	try {
			response.getOutputStream().println("{\"message\":\"sucesso\"}");
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }
    
    public void doAjaxUpdateQuarantineResult(StaplerRequest request, StaplerResponse response) {
    	Job job = new Job(request.getParameter("job"));    	
    	Result result = new Result(job.getId(), Integer.parseInt(request.getParameter("exec")), request.getParameter("test"));
    	result.setDescription(request.getParameter("statusResult"));
    	result.save();
      	try {
			response.getOutputStream().println("{\"message\":\"sucesso\"}");
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }
    
    public void doAjaxUpdateQuarantineBehavior(StaplerRequest request, StaplerResponse response) {
    	Test test = new Test(request.getParameter("job"), request.getParameter("test"));
    	test.setBehavior(request.getParameter("statusBehavior"));
    	test.save();
      	try {
			response.getOutputStream().println("{\"message\":\"sucesso\"}");
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }
    
    public void doAjaxUpdateExecDescription(StaplerRequest request, StaplerResponse response) throws Exception{
    	Job job = new Job(request.getParameter("job"));
    	int idJob = 1;
    	if(job.getId() > 0){
    		idJob = job.getId();
    	}
    	Execution exec = new Execution(request.getParameter("exec"), idJob);
    	exec.setDescription(request.getParameter("description"));
    	exec.save();
      	try {
			response.getOutputStream().println("{\"message\":\"sucesso\"}");
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }    
    
    public void doConsultarQuadro(StaplerRequest request, StaplerResponse response) throws Exception{
    	Job job = new Job(request.getParameter("job"));
    	Execution exec = new Execution(request.getParameter("exec"), job.getId());
      	try {
    		String retorno = exec.consultarQuadro();
        	if(retorno.equals("")){
        		retorno="[{}]";
    		}
			response.getOutputStream().println(retorno);
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }
    
    public void doConsultarHistoricoExecSize(StaplerRequest request, StaplerResponse response) throws Exception{
		String retorno="0";
      	try {
      		if(request.getParameter("job") != null && request.getParameter("exec") != null){
      			String jobname = request.getParameter("job").trim();
      			Job job = new Job(jobname);
		    	int idJob = 1;
		    	if(job.getId() > 0){
		    		idJob = job.getId();
		    	}
		    	Execution exec = new Execution(request.getParameter("exec"), idJob);
	    		retorno = ""+Integer.toString(exec.consultarHistoricoExecSize());
	        	if(retorno.equals("")){
	        		retorno="0";
	    		}
    		}
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
		response.getOutputStream().println("{\"size\":"+retorno+"}");
    }
    
    public void doGetExecutions(StaplerRequest request, StaplerResponse response) throws Exception{
    	Job job = new Job(request.getParameter("job"));
      	try {
    		String retorno = job.getExecutions();
        	if(retorno.equals("")){
        		retorno="[{}]";
    		}
			response.getOutputStream().println(retorno);
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }

    public void doGetAllExecutions(StaplerRequest request, StaplerResponse response) throws Exception{
    	Job job = new Job(request.getParameter("job"));
      	try {
    		String retorno = job.getAllExecutions();
        	if(retorno.equals("")){
        		retorno="[{}]";
    		}
			response.getOutputStream().println(retorno);
      	} catch (Exception e) {
      		System.out.println("Resquest failed");
		}
    }    

    public void doGetConfig(StaplerRequest request, StaplerResponse response) throws Exception{
  	    try {
  	    	Job job = new Job(request.getParameter("job"));
			response.getOutputStream().println("{\"xmlpath\":\""+job.getXmlPath()+"\",\"evidencespath\":\""+job.getEvidencesPath()+"\"}");
  	    } catch (Exception e) {
			response.getOutputStream().println("{}");
  	    }
    }
}