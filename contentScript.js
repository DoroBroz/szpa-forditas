let isActive = false
let karoli

function toggleActive() {
    isActive = !isActive
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

async function translateToSZPA() {
    karoli = $('.bible-chapter-content').html()
    const {bookName, chapter} = getBookData()
    if (!bookName || !chapter) return
    const translationOfCurrentChapter = await getTranslationOfCurrentChapter(bookName, chapter)
    if (!translationOfCurrentChapter) return
    const verses = Object.keys(translationOfCurrentChapter)
    verses.forEach(vers => $(`a[name='${vers}']`).parent().next().text(translationOfCurrentChapter[vers]))
    $('.bible-breadcrumb a:first').text('Szent Pál Akadémia')
}

function translateToKaroli() {
    $('.bible-chapter-content').replaceWith(`<dl class="bible-chapter-content">${karoli}</dl>`)
    $('.bible-breadcrumb a:first').text('Károli Gáspár')
}

chrome.runtime.onMessage.addListener((data, sender) => {
    if (!sender.tab && data.action === 'WASCLICK') {
        toggleActive()
        isActive ? translateToSZPA() : translateToKaroli()
    }
})
