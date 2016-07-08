package com.zeipt.mycely;


import android.os.Bundle;

import android.util.Log;

import org.apache.cordova.*;


public class MainActivity extends CordovaActivity
{
    public static boolean active = false;


    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
        active = true;
    }

}
