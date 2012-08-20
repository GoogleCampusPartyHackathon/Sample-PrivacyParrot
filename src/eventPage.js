// Copyright 2012, Mike West: License details can be found in LICENSE.markdown.

// When the extension is installed or updated, wipe the local storage.
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.clear();
});

// When a tab is activated, grab its data, and render a result in the browser
// action's icon.
function processTab(tabId) {
  chrome.browserAction.setBadgeText({ text: "" });
  if (tabId.tabId) // onActivated?
    tabId = tabId.tabId;
  chrome.tabs.get(tabId, function (details) {
    if (details.status === "loading" || !details.active)
      return;
    Parrot.get(details.url, function (data) {
      if (data === null)
        return;
      var color = "#CCC";
      if (data.result === Parrot.Result.DOES_NOT_SELL)
        color = "#090";
      else if (data.result === Parrot.Result.DOES_SELL)
        color = "#B00";
      else if (data.result === Parrot.Result.MAY_SELL_DURING_BANKRUPTCY)
        color = "#F60";

      chrome.browserAction.setBadgeBackgroundColor({ color: color });
      chrome.browserAction.setBadgeText({ text: "!!!" });
    });
  });
}
chrome.tabs.onActivated.addListener(processTab);
chrome.tabs.onUpdated.addListener(processTab);

// When the user clicks on the browser action icon, take them to PrivacyParrot.
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.get(tab.id, function (details) {
    chrome.tabs.create({ url: Parrot.generateEndpoint(details.url) });
  });
});
