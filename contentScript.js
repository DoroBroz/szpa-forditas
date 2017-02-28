let isActive = false

function toggleActive() {
    isActive = !isActive
}

function getTranslatedChapter() {

}

function activateExtension() {
    console.log('ACTIVATE')
    toggleActive()
}

function deactivateExtension() {
    console.log('DEACTIVATE')
    toggleActive()
}

function getBookString() {
    const bibleBreadcrumb = document.getElementsByClassName('bible-breadcrumb')[0]
    if (!bibleBreadcrumb) return null
    const active = bibleBreadcrumb.getElementsByClassName('active')[0]
    return (!active) ? null : active.href
}

function getBook() {
    const bookString = getBookString()
    if (!bookString) return
    const splittedBookElements = bookString.split('/')
    const chapter = splittedBookElements[splittedBookElements.length - 1]
    const bookName = splittedBookElements[splittedBookElements.length - 2]
    if (!parseInt(chapter)) return
    return { bookName, chapter }
}

chrome.runtime.onMessage.addListener((data, sender) => {
    if (!sender.tab && data.action === 'ACTIVATE') return activateExtension()
    if (!sender.tab && data.action === 'DEACTIVATE') return deactivateExtension()
})

function sendMessageAndGetResponse(message) {
    return new Promise((resolve, reject) => chrome.runtime.sendMessage(message, response => resolve(response)))
}

async function isExtensionActivated() {
    const response = await sendMessageAndGetResponse({ action: 'ISACTIVE' })
    return response.isActive
}

function getTranslation(xhr) {
    return new Promise((resolve, reject) => xhr.onload = result => resolve(JSON.parse(result.target.response)))
}

(async () => {
    isActive = await isExtensionActivated()
    console.log("lasuk, hogy aktiv-e: ", isActive)
    const xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('/forditasok/colossians.json'), true);
    xhr.send();
    const translation = await getTranslation(xhr)
    console.log(translation.chapter1.v11)
    console.log(getBook())
})();
