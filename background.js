let isActive = false

function getActiveTabId() {
  return new Promise((resolve, reject) =>
    chrome.tabs.query({ active: true, currentWindow: true },
      tabs => (!tabs || tabs.length === 0) ? reject('Error in getActiveTabId') : resolve(tabs[0].id)
    ))
}

async function activateExtension() {
  chrome.tabs.sendMessage(await getActiveTabId(), { action: "ACTIVATE" })
}

async function deactivateExtension() {
  chrome.tabs.sendMessage(await getActiveTabId(), { action: "DEACTIVATE" })
}

function getBook() {
  return new Promise(async (resolve, reject) =>
    chrome.tabs.sendMessage(await getActiveTabId(), { action: "GETBOOK" }, response => resolve(response)))
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

chrome.pageAction.onClicked.addListener(tab => (isActive = !isActive) ? activateExtension() : deactivateExtension())

chrome.runtime.onMessage.addListener((data, sender, sendResponse) =>
  (!!sender.tab && data.action === 'ISACTIVE') ? sendResponse({ isActive }) : null
)
