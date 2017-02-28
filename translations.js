const xhr = new XMLHttpRequest();
//xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", chrome.extension.getURL('/forditasok/colossians.json'), true);
xhr.send();

export const translations = {
    COL: {
        1: colossians.chapter1
    }
}