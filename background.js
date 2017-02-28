let isActive = false

function enableExtension(tabId) {
  chrome.pageAction.show(tabId)
}

function isItTheTargetPage(url) {
  return (!url) ? false : url.includes('biblia.hit.hu')
}

function getTab(tabId) {
  return new Promise((resolve, reject) => chrome.tabs.get(tabId, tab => (!tab) ? reject('error in getTab') : resolve(tab)))
}

function getActiveTabId() {
  return new Promise(
    (resolve, reject) =>
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

chrome.runtime.onMessage.addListener((data, sender, sendResponse) =>
  (!!sender.tab && data.action === 'ISACTIVE') ? sendResponse({ isActive }) : null
)
/*chrome.tabs.onCreated.addListener(tab => isItTheTargetPage(tab.url) ? enableExtension(tab.id) : null)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => isItTheTargetPage(changeInfo.url) ? enableExtension(tabId) : null)
chrome.tabs.onReplaced.addListener(async (addedTabId, removedTabId) => {
  const currentTab = await getTab(addedTabId)
  return isItTheTargetPage(currentTab.url) ? enableExtension(currentTab.id) : null
})*/

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
};

chrome.runtime.onInstalled.addListener(details =>
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () =>
    chrome.declarativeContent.onPageChanged.addRules([rule])
  )
)

/*chrome.tabs.onCreated.addListener(async tab => {
  console.log('onCreated')
})
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  console.log('onUpdated')
})
chrome.tabs.onReplaced.addListener(async (addedTabId, removedTabId) => {
  console.log('onReplaced')
})*/
chrome.pageAction.onClicked.addListener(tab => (isActive = !isActive) ? activateExtension() : deactivateExtension())
