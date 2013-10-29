"use strict";

// global variable
var _sd_frm = null,
_sd_word_flag = null,
SdLib = SdLib || {},
_sdCaptureWord = function () {
  var sel, node, range, word = "", spChars;

  sel = window.getSelection();
  node = sel.anchorNode;

  if(typeof node.length != 'undefined') {
    range = sel.getRangeAt(0);

    if(node.length <= range.startOffset) {
      word = node.nextSibling.textContent.trim();
    }
    else {
      // set start
      while (range.startOffset > 0 && range.toString().indexOf(' ') != 0) {
          range.setStart(node, (range.startOffset - 1));
      }

      if(/^\s/.test(range.toString())) {
        range.setStart(node, range.startOffset + 1);
      }

      // set end
      while (range.toString().indexOf(' ') == -1 && range.endOffset < node.length) {
          range.setEnd(node, range.endOffset + 1);
      };
      
      word = range.toString().trim();
    }

    // filter useless chars
    //word = word.replace(/([a-zA-Z\-]{3})[^a-zA-Z\-].+$/g, '$1');
    //word = word.replace(/[^a-zA-Z\-]/g, '').toLowerCase();
    var spChars = "\\" + "\"',.()[]{}<>;:?!".split("").join("\\");
    //word = word.replace(new RegExp('^.+[' + spChars + ']([^' + spChars + ']{3})'), '$1');
    word = word.replace(new RegExp('([^' + spChars + ']{3})[' + spChars + '].+$'), '$1');
    word = word.replace(new RegExp('[' + spChars + ']', 'g'), '').toLowerCase();
    
    if(word != "") {
      // save the last search word in the local storage. 
      var obj = {};
      obj["_sd_word"] = {
        lastWord : word,
      };
      chrome.storage.local.set(obj, null);  
    }
  }

  return word;
};

SdLib.getConf(function (cfg) {
  var dicUrl = cfg.dicUrl,
  frmWidth = cfg.frameWidth,  
  frmHeight = cfg.frameHeight;

  document.addEventListener("click", function(evt) {
    var word="",
    markTxt;

    // ctrl + mouse left click or double click
    if(evt.button == 0 && (evt.ctrlKey == true ||  evt.detail == 2)) {
      word = _sdCaptureWord();
      if(word != "") {
        if(_sd_frm == null) {
          _sd_frm = document.createElement("iframe");
          _sd_frm.style.width = frmWidth + "px";
          _sd_frm.style.height = frmHeight + "px";
          _sd_frm.style.position = "absolute";
          _sd_frm.style.overflow = "hidden";
          _sd_frm.style.zIndex = "99999";
          _sd_frm.style.border = "1px solid black";
          _sd_frm.style.backgroundColor = "#fff";

          document.body.appendChild(_sd_frm);
        }
        _sd_frm.src = dicUrl.replace(/\$q/g, encodeURI(word));
        _sd_frm.style.top = window.pageYOffset + window.innerHeight/2 - frmHeight/2 + "px";
        _sd_frm.style.right = "10px";
      
        // show word flag
        if(_sd_word_flag == null) {
          _sd_word_flag = document.createElement("div");
          _sd_word_flag.style.position = "absolute";
          _sd_word_flag.style.color = "rgba(255, 255, 0, 0.9)";
          _sd_word_flag.style.textShadow = "rgba(73, 71, 3, 0.9) 0px 2px 3px"; 
          _sd_word_flag.style.fontSize = "11px";
          markTxt = document.createTextNode('✔');
          _sd_word_flag.appendChild(markTxt);
          document.body.appendChild(_sd_word_flag);
        } 
        _sd_word_flag.style.top = window.pageYOffset + evt.clientY + "px";
        _sd_word_flag.style.left= window.pageXOffset + evt.clientX + "px";

      }
    }
    else {
      if(_sd_frm != null) {
        document.body.removeChild(_sd_frm);
        _sd_frm = null;
      }

      if(_sd_word_flag != null) {
        document.body.removeChild(_sd_word_flag);
        _sd_word_flag = null;
      }
    }
  }, false);
});

