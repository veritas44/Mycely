// License information is available from LICENSE file

package io.jxcore.node;

import io.jxcore.node.jxcore.JXcoreCallback;

import java.util.ArrayList;
import java.util.*;
import android.net.Uri;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import com.zeipt.mycely.MainActivity;
import com.zeipt.mycely.R;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Vibrator;
import android.graphics.Color;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;

public class JXMobile {


    public static boolean isBackgroundRunning(Context context) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> runningProcesses = am.getRunningAppProcesses();
        Log.e("jxcore",  "context.getPackageName()="+context.getPackageName());
		//
        for (ActivityManager.RunningAppProcessInfo processInfo : runningProcesses) {
            if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                for (String activeProcess : processInfo.pkgList) {
                    if (activeProcess.equals(context.getPackageName()) && MainActivity.active) {
                        Log.e("jxcore",  "is running");
                        Log.e("jxcore",  "MainActivity.active="+MainActivity.active);
                        return true;
                    }
                }
            }
        }

	Log.e("jxcore",  "is not running");
        return false;
    }

    public static void Notify(Context context)
    {
    	Log.e("jxcore", "Notify!: ");
    	NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    	int icon = R.drawable.icon;//R.drawable.notification_icon;
    	long when = System.currentTimeMillis();
    	Notification notification = new Notification(icon, "", when);

    	notification.defaults |= Notification.DEFAULT_LIGHTS;
        //notification.defaults |= Notification.DEFAULT_SOUND;
        notification.defaults |= Notification.DEFAULT_VIBRATE;
        notification.flags |= Notification.FLAG_AUTO_CANCEL;
        notification.sound = Uri.parse("android.resource://" + context.getPackageName() + "/" + R.raw.newmsg);


    	if (android.os.Build.VERSION.SDK_INT >=
                    android.os.Build.VERSION_CODES.KITKAT) {
                notification.ledARGB = Color.MAGENTA;
            };

    		//Context context = getApplicationContext();
    		CharSequence contentTitle = "Mycely";
    		CharSequence contentText = "Attention required!";
    		Intent notificationIntent = new Intent(context, com.zeipt.mycely.MainActivity/*com.red_folder.phonegap.plugin.backgroundservice.BackgroundService*/.class);
    		PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, 0);
    		notification.setLatestEventInfo(context, contentTitle, contentText, contentIntent);

    		//int SERVER_DATA_RECEIVED = 1;
    		notificationManager.notify(1, notification);
    /*
    	NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
    	  @SuppressWarnings("deprecation")
    	  Notification notification = new Notification(R.drawable.icon,
    	    "Attention required", System.currentTimeMillis());

    	   Intent notificationIntent = new Intent(this, MainActivity.class);
    	  PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,
    	    notificationIntent, 0);

    	  // notification.setLatestEventInfo(MainActivity.this, "Mycely",
    	    //"Attention required", pendingIntent);

            notification.defaults |= Notification.DEFAULT_LIGHTS;
            notification.defaults |= Notification.DEFAULT_SOUND;
            notification.defaults |= Notification.DEFAULT_VIBRATE;
            //notification.flags |= Notification.FLAG_AUTO_CANCEL;
            notification.ledARGB = Color.MAGENTA;

    	  notificationManager.notify(9999, notification);
    */
    }

  public static String getStatusString(NetworkInfo[] netInfo, Boolean asJSON) {
    String info = "NotConnected";
    for (NetworkInfo ni : netInfo) {
      if (ni.getTypeName().equalsIgnoreCase("WIFI"))
        if (ni.isConnected()) {
          info = "WiFi";
          break;
        }

      if (ni.getTypeName().equalsIgnoreCase("MOBILE"))
        if (ni.isConnected()) {
          info = "WWAN";
          break;
        }
    }

    return asJSON ? "{\"" + info + "\":1}" : info;
  }

  public static void Initialize() {
    jxcore.RegisterMethod("OnError", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {
        String message = (String) params.get(0);
        String stack = (String) params.get(1);

        Log.e("jxcore", "Error!: " + message + "\nStack: " + stack);
      }
    });

    jxcore.RegisterMethod("GetDocumentsPath", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {
        String path = jxcore.activity.getBaseContext().getFilesDir()
            .getAbsolutePath();
        jxcore.CallJSMethod(callbackId, "\"" + path + "\"");
      }
    });

    jxcore.RegisterMethod("GetConnectionStatus", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {
        ConnectivityManager cm = (ConnectivityManager) jxcore.activity
          .getBaseContext().getSystemService(Context.CONNECTIVITY_SERVICE);

        String info = JXMobile.getStatusString(cm.getAllNetworkInfo(), true);
        jxcore.CallJSMethod(callbackId, info);
      }
    });

    jxcore.RegisterMethod("GetDeviceName", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {

        String name = "\"" + android.os.Build.MANUFACTURER + "-"
            + android.os.Build.MODEL + "\"";

        jxcore.CallJSMethod(callbackId, name);
      }
    });

    /*
     * ADD: <uses-permission android:name="android.permission.BLUETOOTH" />
     * <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
     */
    jxcore.RegisterMethod("ToggleBluetooth", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {
        Boolean enabled = (Boolean) params.get(0);
        BluetoothAdapter mBluetoothAdapter = BluetoothAdapter
            .getDefaultAdapter();
        if (mBluetoothAdapter != null) {
          if (enabled)
            mBluetoothAdapter.enable();
          else
            mBluetoothAdapter.disable();

          jxcore.CallJSMethod(callbackId, "null");
        } else {
          jxcore.CallJSMethod(callbackId,
              "{\"msg\":\"Bluetooth adapter is not available\"}");
        }
      }
    });

    /*
     * ADD: <uses-permission android:name="android.permission.CHANGE_WIFI_STATE"
     * />
     */
    jxcore.RegisterMethod("ToggleWiFi", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {
        Boolean enabled = (Boolean) params.get(0);
        WifiManager wifiManager = (WifiManager) jxcore.activity
            .getBaseContext().getSystemService(Context.WIFI_SERVICE);

        if (wifiManager != null) {
          wifiManager.setWifiEnabled(enabled);

          if (enabled) {
            wifiManager.disconnect();
            wifiManager.reconnect();
          }

          jxcore.CallJSMethod(callbackId, "null");
        } else {
          jxcore.CallJSMethod(callbackId,
              "{\"msg\":\"Wireless adapter is not available\"}");
        }
      }
    });










    jxcore.RegisterMethod("Notify", new JXcoreCallback() {
      @SuppressLint("NewApi")
      @Override
      public void Receiver(ArrayList<Object> params, String callbackId) {
	Log.e("jxcore", "Method Notify!: ");
	if(!isBackgroundRunning(jxcore.activity.getBaseContext())){
			Notify(jxcore.activity.getBaseContext());
	};

      }
    });

  }
}
