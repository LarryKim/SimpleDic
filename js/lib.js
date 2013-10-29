"use strict";

function $id(id) {
  return document.getElementById(id);
}

var SdLib = (function () {
  var _domready, _getData, _setData, _getConf, _getWord, _domready;

  _getData = function (opt, key, callback) {
    var api = (opt == "local") ? chrome.storage.local : chrome.storage.sync;
      
    api.get(key, function(data) {
      if(typeof data !== "undefined") {
        callback(data[key]);
      }
      else {
        callback({});
      }
   });
  },
  _setData = function(opt, key, val, callback) {
      var api = (opt == "local") ? chrome.storage.local : chrome.storage.sync,
      obj = {};
      obj[key] = val;
      api.set(obj, callback); 
  },  
  _getConf = function (callback) {
    _getData("sync", "_sd_conf", function (data) {
      var config;
      if(typeof data === "undefined" || typeof data.dicUrl === "undefined") {
          config = {
            dicUrl : "http://dictionary.cambridge.org/dictionary/american-english/$q?q=$q",
            frameWidth: "411",
            frameHeight: "530"
          };
          _setData("sync", "_sd_conf", config, callback(config));
      }
      else {
        callback(data);
      } 
    });
  },
  _getWord = function (callback) {
    _getData("local", "_sd_word", function (data) {
      if(typeof data === "undefined" || typeof data.lastWord === "undefined") {
        callback("");
      }
      else {
        callback(data.lastWord);
      } 
    });
  },  
  _domready = function (callback) {
    document.addEventListener('DOMContentLoaded', callback);
  }

  return {
    getConf: _getConf,
    getWord: _getWord,
    getData: _getData,
    setData: _setData,
    domready: _domready
  };

}());