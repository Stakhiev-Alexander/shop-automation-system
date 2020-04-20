// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const path = require('path');
const url = require('url');

const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2f3241'),
    icon: url.format(path.join(__dirname, '/assets', '/win','/icon.ico')),
  });

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// function loginBtnHandler() {
//     const uid = document.getElementById("uid")
//     const password = document.getElementById("password")
//     const {remote} = require('electron')
//     document.getElementById("demo1").innerHTML = uid.value;
//     document.getElementById("demo2").innerHTML = password.value;
// }
