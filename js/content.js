"use strict";

// global variable
var frm = null,
Lib = Lib || {},
_sdCaptureWord = function () {
  var sel, node, range, word = "";
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

    if(word != "") {
      word = word.replace(/[.,'"]$/, '');
      
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

Lib.getConf(function (cfg) {
  var dicUrl = cfg.dicUrl,
  frmWidth = cfg.frameWidth,  
  frmHeight = cfg.frameHeight;

  document.addEventListener("click", function(evt) {
    var word="";

    if(evt.ctrlKey == true) {
      word = _sdCaptureWord();
      if(word != "") {
        if(frm == null) {
          frm = document.createElement("iframe");
          document.body.appendChild(frm);
          
          frm.style.width = frmWidth + "px";
          frm.style.height = frmHeight + "px";
          frm.style.position = "absolute";
          frm.style.overflow = "hidden";
          frm.style.zIndex = "99999";
          frm.style.border = "1px solid black";
          frm.style.backgroundColor = "#fff";
        }
        frm.src = dicUrl.replace(/\$q$/, encodeURI(word));
        frm.style.top = window.pageYOffset + window.innerHeight/2 - frmHeight/2 + "px";
        frm.style.right = "10px";
      }
    }
    else {
      if(frm != null) {
        document.body.removeChild(frm);
        frm = null;
      }
    }
  }, false);
});

