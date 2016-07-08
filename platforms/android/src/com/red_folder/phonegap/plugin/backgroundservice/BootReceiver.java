package com.red_folder.phonegap.plugin.backgroundservice;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
//import android.content.pm.PackageManager;


import java.util.*;
import org.json.*;
import android.util.Log;

//import com.red_folder.phonegap.plugin.backgroundservice.sample.MyService;
//import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
//import com.zeipt.mycely.MainActivity;

public class BootReceiver extends BroadcastReceiver {  

	private final static String TAG = BootReceiver.class.getSimpleName();
	
	/*
	 ************************************************************************************************
	 * Overriden Methods 
	 ************************************************************************************************
	 */
	@Override  
	public void onReceive(Context context, Intent intent) {
		Log.d("MyService", "BroadcastReceiver BootReceiver onReceive ");
		
		//context.startService(new Intent(this, MyService.class));
		try {
			/*Intent serviceIntent0 = new Intent(context, BackgroundService.class);         
			context.startService(serviceIntent0);
			Intent serviceIntent1 = new Intent(context, BackgroundServicePlugin.class);         
			context.startService(serviceIntent1);
			Intent serviceIntent2 = new Intent(context, MyService.class);         
			context.startService(serviceIntent2);
			Intent serviceIntent3 = new Intent(context, MainActivity.class);         
			context.startService(serviceIntent3);
			
			PackageManager packageManager = context.getPackageManager();
			
			Intent intent0 = packageManager.getLaunchIntentForPackage("io.jxcore.node");
			if(intent0 != null) {
				intent0.setAction(Intent.ACTION_MAIN);
				//intent0.addCategory(Intent.CATEGORY_LAUNCHER);
				intent0.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				//intent0.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
				context.startActivity(intent0);
			};
	
			Intent intent1 = packageManager.getLaunchIntentForPackage("com.zeipt.mycely");
			if(intent1 != null) {
				intent1.setAction(Intent.ACTION_MAIN);
				intent1.addCategory(Intent.CATEGORY_LAUNCHER);
				intent1.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);// | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				//intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
				context.startActivity(intent1);
			};*/
		} catch (Exception e) {
                    e.printStackTrace();
                }

		Log.d("MyService", "all intents sent ");

		// Get all the registered and loop through and start them
		String[] serviceList = PropertyHelper.getBootServices(context);
		
		if (serviceList != null) {
			for (int i = 0; i < serviceList.length; i++)
			{
				// Fix to https://github.com/Red-Folder/bgs-core/issues/18
				// Gets the class from string
				Class<?> serviceClass = ReflectionHelper.LoadClass(serviceList[i]);

				Intent serviceIntent = new Intent(context, serviceClass);         
				context.startService(serviceIntent);
			}
		}

		
	} 
	
} 
