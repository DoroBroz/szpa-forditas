function sendClickNotification(tabId) {
  chrome.tabs.sendMessage(tabId, { action: "WASCLICK" })
}

function getPageStateMatcher(suffix) {
  return new chrome.declarativeContent.PageStateMatcher({
    pageUrl: { schemes: ['http'], hostPrefix: 'biblia.hit.hu', pathSuffix: suffix }
  })
}

function getRules() {
  return [
    {
      conditions: [
        getPageStateMatcher('/COL/1'),
        getPageStateMatcher('/HEB/1'),
        getPageStateMatcher('/1TS/5'),
        getPageStateMatcher('/1CO/13'),
        getPageStateMatcher('/2CO/3')
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }
  ]
}

chrome.runtime.onInstalled.addListener(details =>
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () =>
    chrome.declarativeContent.onPageChanged.addRules(getRules())
  )
)

chrome.pageAction.onClicked.addListener(tab => sendClickNotification(tab.id))
