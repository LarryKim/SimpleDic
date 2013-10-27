"use strict";

chrome.runtime.onInstalled.addListener(function() { 
    chrome.storage.sync.get("_sd_conf", function(data) {
        if(typeof data == "undefined" || typeof data._sd_conf == "undefined") {
            chrome.tabs.create({'url': chrome.extension.getURL('options.html')}, null);
        }
    });
});