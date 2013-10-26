"use strict";

var Lib = Lib || {},
loadDic = function () {
  Lib.getConf(function (cfg) {
    var dicUrl = cfg.dicUrl,
    frmWidth = cfg.frameWidth,  
    frmHeight = cfg.frameHeight;

    Lib.getWord(function(word) {
      var frm;
      
      frm = $id('frm');
      frm.src = dicUrl.replace(/\$q$/, encodeURI(word));
      frm.style.width = frmWidth + "px";
      frm.style.height = frmHeight + "px";   
    });
  });
};

Lib.domready(loadDic);