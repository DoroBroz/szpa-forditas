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
        getPageStateMatcher('/COL/1')
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
