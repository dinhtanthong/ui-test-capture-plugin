package br.vbathke.helper;

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jenkins.model.Jenkins;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.io.FileUtils;

import com.thoughtworks.xstream.io.json.JsonWriter;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

public class SqliteHelper {
	private static Connection c = null;
	private static Connection cNewDb = null;
	private Statement stmt = null;
	private static boolean runReady = true;
	
	private void waitRunStart(){
		int semaforo = 0;
		for(int i=0; i<=60; i++){
			if(runReady){
				break;
			}
			try {
				Thread.sleep(500);
				semaforo+=500;
				System.out.println("semaforo ativo: "+semaforo);
			} catch (InterruptedException e) {} 
		}
	}
	
	private void setRunReady(boolean set){
		runReady = set;
	}

    public static JSONArray convertToJSON(ResultSet resultSet) throws Exception {
        JSONArray jsonArray = new JSONArray();
        while (resultSet.next()) {
            int total_rows = resultSet.getMetaData().getColumnCount();
            JSONObject obj = new JSONObject();
            for (int i = 0; i < total_rows; i++) {
                obj.put(""+resultSet.getMetaData().getColumnLabel(i + 1), ""+resultSet.getObject(i + 1));
            }
            jsonArray.add(obj);
        }
        return jsonArray;
    }	
	
	public JSONArray query(String query) throws Exception{
		ResultSet rs = null;
		//waitRunStart();
		JSONArray jsonArray = new JSONArray();
		setRunReady(false);
		try{
	        stmt = null;
	        stmt = getConn().createStatement();
			rs = stmt.executeQuery(query);
			jsonArray = convertToJSON(rs);
			rs.close();
		}catch(Exception e){
			e.printStackTrace();
		}
		if(stmt!=null)stmt.close();
		setRunReady(true);		
		return jsonArray;
	}

	public boolean update(String query) throws Exception{
		boolean rs = false;
		//waitRunStart();
		setRunReady(false);
		try{
	        stmt = null;
	        stmt = getConn().createStatement();
	        stmt.executeUpdate(query);
	        rs = true;
		}catch(Exception e){
			System.out.println("falha: "+query);
			//e.printStackTrace();
		}
		if(stmt!=null)stmt.close();
		setRunReady(true);
		return rs;
	}
	
	@SuppressFBWarnings("LI_LAZY_INIT_UPDATE_STATIC")
    public static Connection getConn()  throws Exception {
    	if(c == null){
        	Class.forName("org.sqlite.JDBC");
        	try{
    			c = DriverManager.getConnection("jdbc:sqlite:"+(Jenkins.getInstance().getRootDir().toString()).replace("\\", "/")+"/plugins/ui-test-capture/uitest.sqlite");
    			c.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);        		
        	}catch(Exception e1){
        		c = DriverManager.getConnection("jdbc:sqlite:src/main/webapp/uitestdev.sqlite");
    			c.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);        		
        	}
        }
        return c;
    }
}
