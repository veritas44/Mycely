package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.text.SimpleDateFormat;
import java.lang.ref.WeakReference;
import java.util.*;
import android.net.Uri;


import org.json.*;


import android.util.Log;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Vibrator;
import android.graphics.Color;

import android.app.AlarmManager;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.content.Context;
import android.content.pm.PackageManager;



import android.app.Service;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.net.ConnectivityManager;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.os.Process;
import android.os.Message;
import android.provider.Settings;
import android.provider.Settings.Secure;

import android.net.wifi.WifiManager.*;
import android.net.wifi.WifiManager;
import android.net.NetworkInfo;


import org.apache.cordova.*;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

import com.zeipt.mycely.MainActivity;
import com.zeipt.mycely.R;

import se.tonyivanov.android.ajax.Transport;
import se.tonyivanov.android.ajax.Request;


public class MyService extends BackgroundService {

	private final static String TAG = MyService.class.getSimpleName();
	private String mHelloTo = "World";
	public static String myPushId = "0";
	WifiLock wfl;
	private SharedPreferences sharedPrefs;
    public static final int WAKE_TYPE_UPLOAD = 2;



	public static boolean isBackgroundRunning(Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> runningProcesses = am.getRunningAppProcesses();
		Log.d(TAG, context.getPackageName());
		//Log.d(TAG, MainActivity.active);
        for (ActivityManager.RunningAppProcessInfo processInfo : runningProcesses) {
            //if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                for (String activeProcess : processInfo.pkgList) {
                    if (activeProcess.equals(context.getPackageName()) && MainActivity.active) {
						//Log.d(TAG, "is running");
                        return true;
                    }
                }
            //}
        }

		//Log.d(TAG, "is not running");
        return false;
    }





	public void onNewPush(){

		//if(!isBackgroundRunning(this)){
			Notify();
			return;
			/*
			PackageManager packageManager = getPackageManager();

			Intent intent = packageManager.getLaunchIntentForPackage("io.jxcore.node");
			if(intent != null) {
				intent.setAction(Intent.ACTION_MAIN);
				intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				this.startActivity(intent);
			};

			Intent intent1 = packageManager.getLaunchIntentForPackage("com.zeipt.mycely");
			if(intent1 != null) {
				intent1.setAction(Intent.ACTION_MAIN);
				//intent.addCategory(Intent.CATEGORY_LAUNCHER);
				intent1.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
				//intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
				this.startActivity(intent1);
			}
			*/
		//}

		//System.out.println("intent Received");
		//String jsonString = "{\"query\":\"qwe\"}";
		//Intent RTReturn = new Intent(MainActivity.RECEIVE_JSON);
		//RTReturn.putExtra("json", jsonString);
		//LocalBroadcastManager.getInstance(this).sendBroadcast(RTReturn);

	}

	public void Notify()
    {
		NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
		int icon = R.drawable.icon;//R.drawable.notification_icon;
		long when = System.currentTimeMillis();
		Notification notification = new Notification(icon, "", when);

		notification.defaults |= Notification.DEFAULT_LIGHTS;
        //notification.defaults |= Notification.DEFAULT_SOUND;
        notification.defaults |= Notification.DEFAULT_VIBRATE;
        notification.flags |= Notification.FLAG_AUTO_CANCEL;
		notification.sound = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.newmsg);

		if (android.os.Build.VERSION.SDK_INT >=
                android.os.Build.VERSION_CODES.KITKAT) {
            notification.ledARGB = Color.MAGENTA;
        };

		Context context = getApplicationContext();
		CharSequence contentTitle = "Mycely";
		CharSequence contentText = "Attention required!";
		Intent notificationIntent = new Intent(this, com.zeipt.mycely.MainActivity.class);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);
		notification.setLatestEventInfo(context, contentTitle, contentText, contentIntent);

		//int SERVER_DATA_RECEIVED = 1;
		notificationManager.notify(1, notification);

    }

	@Override
	protected  JSONObject doWork() {
		JSONObject result = new JSONObject();

		scheduleNextPing();

		try {


			WifiManager wm = (WifiManager) getSystemService(Context.WIFI_SERVICE);
	        wfl = wm.createWifiLock(WifiManager.WIFI_MODE_FULL, "WifiLock");
	        if (!wfl.isHeld()) {
	            wfl.acquire();
	        }

			// Start checking if internet is enabled
            /*boolean hasInternet = false;
            long endTime = System.currentTimeMillis() + 55 * 1000;
            // Check every second (max 55) if connected
            while (System.currentTimeMillis() < endTime) {
                if (isOnline()) {
                    hasInternet = true;
                    break;
                }
                synchronized (this) {
                    try {
                        wait(1000);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }*/

			//if(isOnline()){
				if(myPushId.length()>10){

					Request r = new Request("http://178.54.7.199:33234/"+myPushId){

						// Optional callback override.
						@Override
						protected void onSuccess(Transport transport) {
							// Your handling code goes here,
							// The 'transport' object holds all the desired response data.

							//EditText et = (EditText) this.findViewById(R.id.editText1);
							//et.getText().append( transport.getResponseJson().optString("foo") );
							Log.d(TAG, "response");
							Log.d(TAG, transport.getResponseJson().toString());
							int data = transport.getResponseJson().optInt("notify");
							if(data==1){
								onNewPush();
							}
						}
					};
					r.execute("GET");
				}else{
					myPushId = generateClientId();
				}
			//};

			ConnectivityManager cm = (ConnectivityManager)getSystemService(CONNECTIVITY_SERVICE);
	        if (cm.getBackgroundDataSetting() == false) // respect the user's request not to use data!
	        {
	            // user has disabled background data
	            //connectionStatus = MQTTConnectionStatus.NOTCONNECTED_DATADISABLED;

	            // update the app to show that the connection has been disabled
	            //broadcastServiceStatus("Not connected - background data disabled");

	            // we have a listener running that will notify us when this
	            //   preference changes, and will call handleStart again when it
	            //   is - letting us pick up where we leave off now
				Log.d(TAG, "Not connected - background data disabled");
				//можно показывать оповещение...
	            //return;
	        }



			Log.d("MyService", "doWork");
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			String now = df.format(new Date(System.currentTimeMillis()));

			String msg = "### "  + now;
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
			if(myPushId.length()<10){
				myPushId = generateClientId();
				result.put("pushid", myPushId);
			}else{
				result.put("pushid", myPushId);
			}

		} catch (JSONException e) {
		}

		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			if (config.has("HelloTo"))
				this.mHelloTo = config.getString("HelloTo");
			if (config.has("pushid")){
				String tpushid = config.getString("pushid");
				if(tpushid.length()<10){
					myPushId = generateClientId();
				}
				else{
					myPushId = tpushid;
				}
			}

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



	public String generateClientId()
    {
        sharedPrefs = getSharedPreferences("mycelyVars", MODE_PRIVATE);
		myPushId = sharedPrefs.getString("pushid", "0");

        if (myPushId.length()<10)
        {
			String timestamp = "" + (new Date()).getTime();
            String android_id = Settings.System.getString(getContentResolver(),
                                                          Secure.ANDROID_ID);
            myPushId = timestamp + android_id;

            // truncate
            if (myPushId.length() > 128) {
                myPushId = myPushId.substring(0, 128);
            }

			Editor edit = sharedPrefs.edit();
			edit.putString("pushid", myPushId);
			edit.apply();
		}

        return myPushId;
	}

	private boolean isOnline()
    {
        ConnectivityManager cm = (ConnectivityManager)getSystemService(CONNECTIVITY_SERVICE);
        if(cm.getActiveNetworkInfo() != null &&
           cm.getActiveNetworkInfo().isAvailable() &&
           cm.getActiveNetworkInfo().isConnected())
        {
            return true;
        }

        return false;
    }

	private void scheduleNextPing()
	{
		Log.d("MyService", "// Shedule service now");
		Calendar wakeUpTime = Calendar.getInstance();
		wakeUpTime.add(Calendar.SECOND, 2);
		WakeUpReceiver.setAlarm(this, WakeUpReceiver.WAKE_TYPE_UPLOAD, wakeUpTime);
	}



}
