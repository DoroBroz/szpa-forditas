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

const rule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'biblia.hit.hu', schemes: ['http'] }
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
}

chrome.runtime.onInstalled.addListener(details =>
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () =>
    chrome.declarativeContent.onPageChanged.addRules([rule])
  )
)

chrome.pageAction.onClicked.addListener(tab => (isActive = !isActive) ? activateExtension() : deactivateExtension())

chrome.runtime.onMessage.addListener((data, sender, sendResponse) =>
  (!!sender.tab && data.action === 'ISACTIVE') ? sendResponse({ isActive }) : null
)
