const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.png'), // أيقونة المستشفى
    webPreferences: {
      nodeIntegration: true
    }
  });

  // ربطه بالسيرفر السحابي مباشرة أو بالسيرفر المحلي
  win.loadURL('https://alkafeel-media-system.onrender.com'); 
}

app.whenReady().then(createWindow);