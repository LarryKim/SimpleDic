"use strict";

var SdLib = SdLib || {},
loadDic = function () {
  SdLib.getConf(function (cfg) {
    var dicUrl = cfg.dicUrl,
    frmWidth = cfg.frameWidth,  
    frmHeight = cfg.frameHeight;

    SdLib.getWord(function(word) {
      var frm;
      
      frm = $id('frm');
      frm.src = dicUrl.replace(/\$q/g, encodeURI(word));
      frm.style.width = frmWidth + "px";
      frm.style.height = frmHeight + "px";   
    });
  });
};

SdLib.domready(loadDic);