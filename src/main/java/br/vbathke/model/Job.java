package br.vbathke.model;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import br.vbathke.helper.SqliteHelper;

public class Job {

	private int id = 0;
	private String name = "";
	private String xmlPath = "";
	private String evidencesPath = "";
	
	public Job(){}
		
	public Job(int id){
		try {
	    	SqliteHelper conn = new SqliteHelper();
	    	JSONArray rs;
	    	setName(name);
			rs = conn.query( "SELECT * FROM tb_job where id='"+id+"';" );
			if(rs.getJSONObject(0).getInt("id") > 0){
				setId(rs.getJSONObject(0).getInt("id"));
				setName(rs.getJSONObject(0).getString("name"));
				setXmlPath(rs.getJSONObject(0).getString("xmlpath"));
				setEvidencesPath(rs.getJSONObject(0).getString("evidencespath"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}	
	
	public Job(String job){
    	SqliteHelper conn = new SqliteHelper();
    	JSONArray rs;
    	setName(job);
		try {
			rs = conn.query( "SELECT * FROM tb_job where name='"+getName()+"';" );
			if(rs.size() > 0){
				setId(rs.getJSONObject(0).getInt("id"));
				setName(rs.getJSONObject(0).getString("name"));
				setXmlPath(rs.getJSONObject(0).getString("xmlpath"));
				setEvidencesPath(rs.getJSONObject(0).getString("evidencespath"));
			}else{
				save();
				rs = conn.query( "SELECT * FROM tb_job where name='"+getName()+"';" );
				setId(rs.getJSONObject(0).getInt("id"));
				setName(rs.getJSONObject(0).getString("name"));
				setXmlPath(rs.getJSONObject(0).getString("xmlpath"));
				setEvidencesPath(rs.getJSONObject(0).getString("evidencespath"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void save(){
		try {
	    	SqliteHelper conn = new SqliteHelper();
	    	JSONArray rs;
			rs = conn.query( "SELECT * FROM tb_job where name='"+getName()+"';" );
			int job=0;
			for (int i=0; i<rs.size(); i++) {
				JSONObject item = rs.getJSONObject(i);
			    if(item.getString("name").equals(name)){
					job = item.getInt("id");
					break;
			    }
			}
			if(job == 0){
	            conn.update("INSERT INTO tb_job(name, xmlpath, evidencespath) VALUES('"+getName()+"', 'target/surefire-reports/', 'target/screenshots/');");
			}else{
	            conn.update("UPDATE tb_job SET xmlpath='"+getXmlPath()+"', evidencespath='"+getEvidencesPath()+"' where id='"+getId()+"';");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

	public String getExecutions() throws Exception{
    	SqliteHelper conn = new SqliteHelper();
    	JSONArray rs = conn.query( "select * from tb_exec where id_job='"+getId()+"' order by date desc limit 0,10");
    	String retorno = rs.toString();
		if(!retorno.equals("")){
			return retorno; 
		}
		return "[{}]";
	}
	
	public String getAllExecutions() throws Exception{
    	SqliteHelper conn = new SqliteHelper();
    	JSONArray rs = conn.query( "select * from tb_exec where id_job='"+getId()+"' order by id desc");
    	String retorno = rs.toString();
		if(!retorno.equals("")){
			return retorno; 
		}
		return "[{}]";
	}

	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}	

	public String getXmlPath() {
		if(!xmlPath.startsWith("/")){
			xmlPath="/"+xmlPath;
		}
		if(!xmlPath.endsWith("/")){
			xmlPath=xmlPath+"/";			
		}
		return xmlPath;
	}

	public void setXmlPath(String xmlPath) {
		this.xmlPath = xmlPath;
	}

	public String getEvidencesPath() {
		if(!evidencesPath.startsWith("/")){
			evidencesPath="/"+evidencesPath;
		}
		if(!evidencesPath.endsWith("/")){
			evidencesPath=evidencesPath+"/";			
		}
		return evidencesPath;
	}

	public void setEvidencesPath(String evidencesPath) {
		this.evidencesPath = evidencesPath;
	}
}
