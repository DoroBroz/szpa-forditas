let isActive = false

function toggleActive() {
    isActive = !isActive
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

function getBookData() {
    const bookString = getBookString()
    if (!bookString) return { bookName: null, chapter: null }
    const splittedBookElements = bookString.split('/')
    const chapter = (splittedBookElements[splittedBookElements.length - 1]).toLowerCase()
    const bookName = (splittedBookElements[splittedBookElements.length - 2]).toLowerCase()
    if (!parseInt(chapter)) return { bookName: null, chapter: null }
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

function getResponse(xhr) {
    return new Promise((resolve, reject) => xhr.onload = result => resolve(JSON.parse(result.target.response)))
}

async function getTranslationOfCurrentChapter(bookName, chapter) {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", chrome.extension.getURL(`/translations/${bookName}.json`), true)
    xhr.send()
    const response = await getResponse(xhr)
    return response[`chapter${chapter}`]
}

(async () => {
    isActive = await isExtensionActivated()
    if (!isActive) return
    const {bookName, chapter} = getBookData()
    if (!bookName || !chapter) return
    const translation = await getTranslationOfCurrentChapter(bookName, chapter)
    if (!translation) return
    console.log(JSON.stringify(translation, null, 2))
})();
