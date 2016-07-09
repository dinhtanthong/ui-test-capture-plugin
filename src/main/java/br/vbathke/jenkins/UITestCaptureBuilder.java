package br.vbathke.jenkins;

import hudson.Extension;
import hudson.Launcher;
import hudson.model.BuildListener;
import hudson.model.ProminentProjectAction;
import hudson.model.AbstractBuild;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.Builder;

import java.io.File;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import net.sf.json.JSONObject;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.FileUtils;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

import br.vbathke.helper.JsonParseSingleQuote;
import br.vbathke.model.Execution;
import br.vbathke.model.Job;
import br.vbathke.model.Result;
import br.vbathke.model.Test;

public class UITestCaptureBuilder extends Builder implements ProminentProjectAction{
	private final String name;
	 
	
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
	
	@DataBoundConstructor
	public UITestCaptureBuilder(String name) {
		this.name = name;
	}
	
    public String getName() {
        return name;
    }	

	@Override
	public boolean perform(AbstractBuild build, Launcher launcher, BuildListener listener) {
		try {
			Thread t;
			t = new Thread(new Watcher(build));
			t.start();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return true;
	}

	@Override
	public DescriptorImpl getDescriptor() {
		return (DescriptorImpl) super.getDescriptor();
	}

	@Extension
	public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {
		public DescriptorImpl() {
			load();
		}

		@Override
		public String getDisplayName() {
			return "UI Test Capture Listener";
		}

		@Override
		public boolean isApplicable(Class type) {
			return true;
		}
		
        @Override
        public boolean configure(StaplerRequest staplerRequest, JSONObject json) throws FormException {
            save();
            return true; 
        }		
	}

	public class Watcher implements Runnable {
		AbstractBuild build;
		BuildListener listener;
		private String hash = "";
		private String fileString = "";

		public Watcher(AbstractBuild pbuild) throws NoSuchAlgorithmException {
			build = pbuild;
			hash = md5Hash(hash);
		}

		@Override
		public void run() {
			while (build.isBuilding()) {
				verifyResults(build);
			}
		}

		public void verifyResults(AbstractBuild build) {
			try {
	        	fileString = build.getProject().getLastBuild().getWorkspace().toString()+"/target/teststream.txt";
				String testStreamLocal = getTestStream();
				String tmpHash = md5Hash(testStreamLocal);
				String[] testStreamSplit;
				String outResponse = "";

				// Se arquivo possuí mudanças
				if (testStreamPossuiDiferenca()) {
					Job job = new Job(build.getProject().getName());
					Execution exec = new Execution(build.getId(), job.getId());

					// unstack from file and record on db
					testStreamSplit = testStreamLocal.split("\\n");
					for (int i = 0; i < testStreamSplit.length; i++) {
						if (!testStreamSplit[i].equals("")) {
							JsonParseSingleQuote jsonLinha = new JsonParseSingleQuote(
									testStreamSplit[i]);

							Test test = new Test(build.getProject().getName(),
									jsonLinha.get("metodo"));
							test.setIdJob(job.getId());
							test.setTest(jsonLinha.get("metodo"));
							test.setTestClass(jsonLinha.get("classe"));
							test.save();

							// record the result
							Result result = new Result(job.getId(),
									exec.getId(), test.getTest());
							result.setStatus(jsonLinha.get("status"));
							try {
								result.setStacktrace(FileUtils
										.readFileToString(
												new File(
														build.getProject()
																.getRootDir()
																.getCanonicalPath()
																+ "/workspace/target/surefire-reports/"
																+ jsonLinha
																		.get("classe")
																		.trim()
																+ ".txt"),
												"UTF-8"));
							} catch (Exception e) {
								result.setStacktrace("");
							}
							result.save();
							
							testStreamLocal = testStreamLocal.replace(
									testStreamSplit[i] + "\n", "");
						}
					}
					hash = tmpHash;

					// se após o processamento o arquivo NÃO foi alterado,
					// desempilhe
					if (!testStreamPossuiDiferenca()) {
						try {
							Files.write(Paths.get(fileString), testStreamLocal
									.getBytes(StandardCharsets.UTF_8));
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					outResponse = "{\"hash\": \"" + hash + "\", \"lines\": "
							+ testStreamSplit.length + "}";
				} else {
					outResponse = "{\"hash\": \"" + hash + "\", \"lines\": 0}";
				}
			} catch (Exception e) {
			}
		}

		public boolean testStreamPossuiDiferenca()
				throws NoSuchAlgorithmException {
			String tmpHash = md5Hash(getTestStream());
			if (!hash.equals(tmpHash)) {
				return true;
			} else {
				return false;
			}
		}

		public String getTestStream() {
			try {
				return FileUtils
						.readFileToString(new File(fileString), "UTF-8");
			} catch (Exception e) {
				return "";
			}
		}

		public String md5Hash(String data) throws NoSuchAlgorithmException {
			MessageDigest messageDigest;
			messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.reset();
			messageDigest.update(data.getBytes(Charset.forName("UTF8")));
			byte[] resultByte = messageDigest.digest();
			String result = new String(Hex.encodeHex(resultByte));
			return result;
		}
	}

}