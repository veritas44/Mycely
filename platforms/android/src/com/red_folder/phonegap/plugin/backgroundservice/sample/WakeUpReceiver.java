package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.text.SimpleDateFormat;
import java.lang.ref.WeakReference;
import java.util.*;

import android.util.Log;


import android.app.AlarmManager;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;


import android.content.BroadcastReceiver;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v4.content.WakefulBroadcastReceiver;
import android.content.Context;


//import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
import io.jxcore.node.jxcore;

public class WakeUpReceiver extends WakefulBroadcastReceiver {

    private final static String TAG = WakeUpReceiver.class.getSimpleName();
    // Constant to distinguish request
    public static final int WAKE_TYPE_UPLOAD = 2;

    // AlarmManager to provide access to the system alarm services.
    private static AlarmManager alarm;
    // Pending intent that is triggered when the alarm fires.
    private static PendingIntent pIntent;

    /** BroadcastReceiver onReceive() method */
    @Override
    public void onReceive(Context context, Intent intent) {
        // Start appropriate service type
        Log.d(TAG, " // Start appropriate service type 76 ");
        WakeUpReceiver.scheduleNextPing(context);
        int wakeType = intent.getExtras().getInt("wakeType");
        switch (wakeType) {
        case WAKE_TYPE_UPLOAD:
            Log.d(TAG, " WAKE_TYPE_UPLOAD ");
            Intent newUpload = new Intent(context, /*BackgroundService*/MyService.class);
            startWakefulService(context, newUpload);
            Intent newUpload1 = new Intent(context, jxcore.class);
            startWakefulService(context, newUpload1);
            //doWork();
            break;
        default:
            Log.d(TAG, " default");
            break;
        }
    }

    /** Sets alarms */
    //@SuppressLint("NewApi")
    public static void setAlarm(Context context, int wakeType, Calendar startTime) {
        // Set alarm to start at given time
        Log.d(TAG, " Set alarm to start at given time 95");
        alarm = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, WakeUpReceiver.class);
        intent.putExtra("wakeType", wakeType);
        pIntent = PendingIntent.getBroadcast(context, wakeType, intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        // For android 4.4+ the method is different
        if (android.os.Build.VERSION.SDK_INT >=
                android.os.Build.VERSION_CODES.KITKAT) {
            alarm.setExact(AlarmManager.RTC_WAKEUP,
                    startTime.getTimeInMillis() , pIntent);
        } else {
            alarm.set(AlarmManager.RTC_WAKEUP,
                    startTime.getTimeInMillis() , pIntent);
        }

        // The + 5000 is for adding symbolic 5 seconds to alarm start
    }

    private static void scheduleNextPing(Context context)
	{
		Log.d("MyService", "// Shedule service now");
		Calendar wakeUpTime = Calendar.getInstance();
		wakeUpTime.add(Calendar.SECOND, 2);
		WakeUpReceiver.setAlarm(context, WakeUpReceiver.WAKE_TYPE_UPLOAD, wakeUpTime);
	}


}
