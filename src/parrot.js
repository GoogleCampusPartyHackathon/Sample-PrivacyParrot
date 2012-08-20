// Copyright 2012, Mike West: License details can be found in LICENSE.markdown.

/**
 * @fileoverview This file defines the 'Parrot' class, which wraps the Privacy
 * Parrot site in a simple API for use inside the extension.
 *
 * @author mkwst@google.com (Mike West)
 */

/**
 * This singleton wraps http://privacyparrot.com/ in a simple caching 'get' API.
 *
 * @constructor
 */
var Parrot = {};

/**
 * Enum defining the possible return types from PrivacyParrot.com.
 *
 * @enum {number}
 */
Parrot.Result = {
  NO_INFORMATION: 0,
  DOES_NOT_SELL: 1,
  DOES_SELL: 2,
  MAY_SELL_DURING_BANKRUPTCY: 3,
};

/**
 * Given a URL, return just the hostname.
 *
 * @param {string} url The URL in which you're interested.
 * @return {string} The URL's hostname.
 */
Parrot.urlToHost = function (url) {
  var a = document.createElement('a');
  a.href = url;
  return (a.protocol !== "http:" && a.protocol !== "https:") ? null : a.host;
};

/**
 * Given a URL, get the Privacy Parrot report via a callback.
 *
 * @param {string} url The URL in which you're interested.
 * @param {function(Parrot.Result)} callback The callback function triggered
 *     when data is available.
 */
Parrot.get = function (url, callback) {
  var host = Parrot.urlToHost(url);
  if (host === null)
    return callback(null);

  chrome.storage.sync.get(host, function (data) {
    if (!data[host] || data[host].expires < new Date())
      Parrot.scrape(url, callback);
    else
      callback(data[host]);
  });
};

Parrot.generateEndpoint = function (url) {
  var host = Parrot.urlToHost(url);
  return "http://privacyparrot.com/privacy-policy-for-" + host;
};

/**
 * Scrape the Privacy Parrot site for a specific hostname, and store the result
 * for later use, along with a TTL.
 *
 * @param {string} hostname The host in which you're interested.
 * @param {function(Parrot.Result)} callback The callback function triggered
 *     when data is available.
 */
Parrot.scrape = function (url, callback) {
  var host = Parrot.urlToHost(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", Parrot.generateEndpoint(url));
  xhr.onreadystatechange = function (e) {
    if (this.readyState == 4 && this.status == 200) {
      var data = this.responseText;

      var result = Parrot.Result.NO_INFORMATION;
      if (data.match(/color: #090/))
        result = Parrot.Result.DOES_NOT_SELL;
      else if (data.match(/color: #B00/))
        result = Parrot.Result.DOES_SELL;
      else if (data.match(/color: #F60/))
        result = Parrot.Result.MAY_SELL_DURING_BANKRUPTCY;

      var expires = new Date();
      expires.setDate(expires.getDate() + 14);
      var obj = {
        result: result,
        expires: expires
      };
      var temp = {};
      temp[host] = obj;
      chrome.storage.sync.set(temp, function () {
        callback(temp[host]);
      });
    }
  };

  xhr.send();
};
