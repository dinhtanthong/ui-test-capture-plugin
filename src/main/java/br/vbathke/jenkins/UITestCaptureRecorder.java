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

import hudson.Extension;
import hudson.Launcher;
import hudson.model.Action;
import hudson.model.BuildListener;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Publisher;
import hudson.tasks.Recorder;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import net.sf.json.JSONObject;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

public class UITestCaptureRecorder extends Recorder {

	@DataBoundConstructor
	public UITestCaptureRecorder() {
		super();
	}

	@Override
	public DescriptorImplRecorder getDescriptor() {
		return (DescriptorImplRecorder) super.getDescriptor();
	}

	/* Hide the plugin form main Jenkins menu
	 * */
	@Override
	public BuildStepMonitor getRequiredMonitorService() {
		return BuildStepMonitor.NONE;
	}

	/* Set the actual run of the plugin visible in the icon list of the project
	 * */
	@Override
	public Action getProjectAction(AbstractProject<?, ?> project) {
		try {
			return new UITestCaptureProjectAction(project);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@Extension
	public static class DescriptorImplRecorder extends BuildStepDescriptor<Publisher> {

		public DescriptorImplRecorder() {
			load();
		}

		@Override
		public boolean isApplicable(Class<? extends AbstractProject> project) {
			return true;
		}

		@Override
		public String getDisplayName() {
			return "UI Test Capture Publisher";
		}

		@Override
		public boolean configure(StaplerRequest staplerRequest, JSONObject json){
			save();
			return true;
		}
	}
}
