package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.text.SimpleDateFormat;
import java.util.*;


import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;




import android.app.Activity;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.net.Uri;

import android.content.BroadcastReceiver;
import android.support.v4.content.LocalBroadcastManager;
import android.content.Context;
import android.os.Vibrator;
import android.widget.Toast;
import android.content.pm.PackageManager;

import org.apache.cordova.*;

/*
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Binder;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
*/




import org.apache.cordova.*;

import com.zeipt.mycely.R;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

import com.zeipt.mycely.MainActivity;

public class MyService extends BackgroundService {
	
	private final static String TAG = MyService.class.getSimpleName();
	
	private String mHelloTo = "World";


	public static Context mContext;

	public static final String MQTT_MSG_RECEIVED_INTENT = "com.example.hello.MSGRECVD";
	public static final int MQTT_NOTIFICATION_ONGOING = 1;  
	public static final int MQTT_NOTIFICATION_UPDATE  = 2;

/*
public boolean isRunning(Context ctx) {
        ActivityManager activityManager = (ActivityManager) ctx.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.AppTask> tasks = activityManager.getAppTasks();

        for (RunningTaskInfo task : tasks) {
            if (ctx.getPackageName().equalsIgnoreCase(task.baseActivity.getPackageName())) 
                return true;                                  
        }

        return false;
    }
*/

public static boolean isBackgroundRunning(Context context) {
	//return MainActivity.active;
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> runningProcesses = am.getRunningAppProcesses();
	Log.d(TAG, context.getPackageName());
	//Log.d(TAG, MainActivity.active);
        for (ActivityManager.RunningAppProcessInfo processInfo : runningProcesses) {
            //if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                for (String activeProcess : processInfo.pkgList) {
                    if (activeProcess.equals(context.getPackageName()) && MainActivity.active) {
			Log.d(TAG, "is running");
                        return true;
                    }
                }
            //}
        }

	Log.d(TAG, "is not running");
        return false;
    }




public void Notify()
    {
/*try {
	NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
	  @SuppressWarnings("deprecation")
	  Notification notification = new Notification(R.drawable.icon,
	    "New Message", System.currentTimeMillis());

	   Intent notificationIntent = new Intent(this, MainActivity.class);
	  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
	    notificationIntent, 0);

	   notification.setLatestEventInfo(MainActivity.this, "notificationTitle",
	    "notificationMessage", pendingIntent);
	  notificationManager.notify(9999, notification);
} catch (Exception e) {
Log.d(TAG, e);
		}*/


//Toast.makeText(this,"Notify", Toast.LENGTH_LONG).show();

Log.d(TAG, "Notify0");
NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
int icon = R.drawable.icon;//R.drawable.notification_icon;
CharSequence notiText = "Your notification from the service";
long meow = System.currentTimeMillis();
Log.d(TAG, "Notify1");
Notification notification = new Notification(icon, notiText, meow);

Context context = getApplicationContext();
CharSequence contentTitle = "Your notification";
CharSequence contentText = "Some data has arrived!";
Intent notificationIntent = new Intent(this, com.example.hello.MainActivity.class);
PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);
Log.d(TAG, "Notify2");
notification.setLatestEventInfo(context, contentTitle, contentText, contentIntent);

int SERVER_DATA_RECEIVED = 1;
notificationManager.notify(SERVER_DATA_RECEIVED, notification);
Log.d(TAG, "Notify3");
	
    }


	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();
		
		try {


			//getContentResolver().notifyChange(uri, null);
			//MainActivity mActivity= new MainActivity();
			//mActivity.Notify();
			//((MainActivity)getActivity()).Notify();

			//MyService.sendMessage();
String msg1 = "###Hello ";
			
//Toast.makeText(this,"JSONObject doWork", Toast.LENGTH_LONG).show();
Log.d("MyService", msg1);
//			Notify();






/*
Intent myintent = new Intent(Intent.ACTION_MAIN);
// Tells the OS to reset the activity if needed or launch the application if it has not already been launched
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
PendingIntent contentIntent = PendingIntent.getActivity(this, 0, myintent, 0);
*/

if(!isBackgroundRunning(this)){
PackageManager packageManager = getPackageManager();

    Intent intent = packageManager.getLaunchIntentForPackage("com.zeipt.mycely");

    if(intent != null) {

        intent.setAction(Intent.ACTION_MAIN);

        //intent.addCategory(Intent.CATEGORY_LAUNCHER);

        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
//intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        this.startActivity(intent);

    }
}

System.out.println("intent Received");
String jsonString = "{\"query\":\"qweqwe\"}";
Intent RTReturn = new Intent(MainActivity.RECEIVE_JSON);
RTReturn.putExtra("json", jsonString);
LocalBroadcastManager.getInstance(this).sendBroadcast(RTReturn);



Log.d("MyService", "JSONObject doWork1");
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss"); 
			String now = df.format(new Date(System.currentTimeMillis())); 

			String msg = "###Hello " + this.mHelloTo + " - its currently " + now;
			result.put("Message", msg);

			Log.d(TAG, msg);







		} catch (JSONException e) {
		}
		
		return result;	
	}

	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();
		
		try {
			result.put("HelloTo", this.mHelloTo);
		} catch (JSONException e) {
		}
		
		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			if (config.has("HelloTo"))
				this.mHelloTo = config.getString("HelloTo");
		} catch (JSONException e) {
		}
		
	}     

	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub
		
	}

	@Override
	protected void onTimerDisabled() {
		// TODO Auto-generated method stub
		
	}


}
