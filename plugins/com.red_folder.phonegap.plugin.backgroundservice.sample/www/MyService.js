var serviceName = 'com.red_folder.phonegap.plugin.backgroundservice.sample.MyService';

var factory = require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService')
module.exports = factory.create(serviceName);