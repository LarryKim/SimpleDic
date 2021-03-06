"use strict";

var SdLib = SdLib || {},
save_options = function () {
  var dicUrl = $id("dicUrl").value;
  var frameWidth = $id("frameWidth").value;  
  var frameHeight = $id("frameHeight").value;

  var obj = {
    dicUrl : dicUrl,
    frameWidth: frameWidth,
    frameHeight: frameHeight
  }; 
  SdLib.setData("sync", "_sd_conf", obj, null); 
  // Update status to let user know options were saved.
  var status = $id("status");
  status.innerHTML = "Options Saved :)";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
},
restore_options = function () {
  // get configuration data
  SdLib.getConf(function (cfg) {
    var dicUrl = cfg.dicUrl,
    frmWidth = cfg.frameWidth,  
    frmHeight = cfg.frameHeight;
    
    $id("dicUrl").value = dicUrl;
    $id("frameWidth").value = frmWidth;  
    $id("frameHeight").value = frmHeight;
  });
};

SdLib.domready(restore_options);
$id('save').addEventListener('click', save_options);