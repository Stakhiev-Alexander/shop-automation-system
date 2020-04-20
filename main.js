const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require("fs");
const {app, ipcMain, BrowserWindow, Menu} = electron;

// Set env
// process.env.NODE_ENV = 'production';

let mainWindow;
let loginWindow;

// Listen for the app to be ready
app.on('ready', createLoginWindow);
ipcMain.on('show-main', function() {
  createMainWindow();
  loginWindow.close();
});


function createMainWindow() {
  //create new window
  mainWindow = new BrowserWindow({ 
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  //load html 
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file',
    slashes: true
  }));

  // Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
}

// Handle add action
function createLoginWindow() {
  //create new window
  loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const loginMenu = Menu.buildFromTemplate(loginMenuTemplate);
  Menu.setApplicationMenu(loginMenu);

  //load html 
  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loginWindow.html'),
    protocol: 'file',
    slashes: true
  }));

  // Destructor
  loginWindow.on('close', function() {
    loginWindow = null;
  });
}

const loginMenuTemplate = [];

// Create menu template
const mainMenuTemplate = [
    {
      label: 'File', 
      submenu: [
        {
          label: 'Add',
          click() {
            // createAddWindow();
          }
        },
        {
          label: 'Delete'
        },
        {
          label: 'Quit',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    }
];

if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools item
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'DevTools',
    submenu:[
      {
        label: 'Toogle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}