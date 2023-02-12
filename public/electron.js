const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require('fs');
const http = require('http');

const isDev = require('electron-is-dev');

/*********************/
/** my globals **/

const appConfigDir = app.getPath('userData');

let configFilePath = appConfigDir+'/config.json'
let dbFilePath = ""

let defaultDbJson = require('./defaultDb.json')
let defaultConfigJson = require('./defaultConfig.json');
const { exit } = require('process');

/** end global vars **/
/*********************/

// Create the native browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    frame: false,
    height: 1080,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setFullScreen(true);

  mainWindow.on('closed', () => (mainWindow = null))
}

/****** MY HANDLERS & HELPERS *****/

/**** TRY THIS

base64 encode -- https://stackoverflow.com/questions/24523532/how-do-i-convert-an-image-to-a-base64-encoded-data-url-in-sails-js-or-generally
sharp resize to generate thumb -- https://stackoverflow.com/questions/71284943/saving-a-sharp-promise-to-a-variable-returns-pending

async function resizer(base64, width = 224, height = 224) {
  if (!base64) {
    throw console.error("not a base64 string")
  } else {
    const Buffer = require("buffer").Buffer
    let base64buffer = Buffer.from(base64, "base64")
    const image = await sharp(base64buffer)
      .resize({
        width: width,
        height: height,
        fit: sharp.fit.cover,
      })
      .rotate(90)
      .toBuffer()

    const newBase64 = image.toString("base64")

    return newBase64
  }
}

const resizedBase64 = resizer(base64Image).then((result) => {
  console.log(result)
  return result
})
console.log(resizedBase64) ****/

function createNewItemObj(id) {
  let data = fs.readFileSync(dbFilePath, 'utf8')
  data = JSON.parse(data)
  
  let newObj = data.filter(node => node['core_props']['label'] === 'Label'
                                   && node['label_props']['strLabel'] === 'Item')[0]
  
  newObj['core_props']['label'] = 'Item'
  delete newObj['label_props']['strLabel']
  delete newObj['label_props']['strLabelDescription']
  newObj['core_props']['id'] = id
  
  return newObj
}

function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function getConfigFromFilePath(message) {
  // if config.json does not exist, create it in the default location
  if (!fs.existsSync(configFilePath)) { 
    console.log('creating config.json from default at ' + configFilePath)
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfigJson, null, 2));
    message['status'] = 'SUCCESS'
    message['payload'] = defaultConfigJson
  } else {
    let data = fs.readFileSync(configFilePath, 'utf8')
    message['status'] = 'SUCCESS'
    message['payload'] = JSON.parse(data)
  }

  return message
}

function getDbFromDbFilePath(message) {

    if (dbFilePath) {
      console.log('STEP 1')
    if (!fs.existsSync(dbFilePath)) { 
      console.log('STEP 2')
      fs.writeFileSync(dbFilePath, JSON.stringify(defaultDbJson, null, 2));
      message['status'] = 'SUCCESS'
      message['payload'] = defaultConfigJson
    } else {
      console.log('STEP 3')
      data = fs.readFileSync(dbFilePath, 'utf8')
      data = JSON.parse(data)

      // strip the files info
      data.map(node => {
        node['label_props']['listDigitalFiles'] = []
        node['label_props']['boolHasDigitalObject'] = false
      })

      // for every filename in Scans,
      //   create thumbnails
      //   create the Item node if it does not exist
      //   add an object to listDigitalFiles
      let configData = fs.readFileSync(configFilePath, 'utf8')
      let scansPath = JSON.parse(configData)['paths']['scans_path']['val']
      let thumbsPath = scansPath + '/Thumbs'

      fs.readdirSync(scansPath).forEach(filename => {

        fullFilePath = scansPath + '/' + filename

        // create the digital file object
        let size = formatBytes(fs.statSync(fullFilePath).size)
        let numPagesStr
        let ext = filename.split('.').pop()
        let id = filename.slice(0,10)
        
        if (ext === 'pdf') {    
          let numPages = 1
          numPagesStr = (numPages === 1) ? numPages + ' page' : numPages + ' pages'
        } else {
          numPagesStr = '1 file'
        }

        let digFileObj = { 'name': filename,
                           'size': size,
                           'pdf_pages': numPagesStr}

        const i = data.map(node => node['core_props']['id']).indexOf(id);
        
        // create the Item node if it does not exist
        // update the node
        if (i >= 0) {          
          data[i]['label_props']['listDigitalFiles'].push(digFileObj)
          data[i]['label_props']['boolHasDigitalObject'] = true
        } else {
          let newItemNode = createNewItemObj(id)
          console.log(newItemNode['core_props'])
          newItemNode['label_props']['listDigitalFiles'].push(digFileObj)
          newItemNode['label_props']['boolHasDigitalObject'] = true
          data.push(newItemNode)
        }

        // // create thumbnail
        // let thumbFilePath = thumbsPath + '/' + id + '.jpg'

        // let filePaths = fs.readdirSync(desktopPath)
        // for (let filePath of filePaths) {
        //     app.getFileIcon(filePath).then((fileIcon) => {
        //         fs.writeFileSync(__dirname + `/images/img-${filePath}.png`, fileIcon.toPNG())
        //   })
        // }
        // fileThumb.resize({
        //   height: 256,
        //   width: 256,
        //   quality: 100
        // }).toPNG()
        //
        // if (fs.existsSync(thumbFilePath)) {
        //   console.log('it exists')
        // } else {
        //   console.log('does not exist')
        // }

      })

      // check for validity of the resulting data
      let dataValid = true
      if (!dataValid) { 
          console.log('STEP 4')
          message['status'] = 'FAILURE_SEE_ERROR'
          message['payload'] = err
      } else {
          console.log('STEP 5')
          message['status'] = 'SUCCESS'
          message['payload'] = data
      }

      // TODO: on the way to the frontend,
      // push the new data to db.json and trigger a manual backup
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

    }
  } else {
    console.log('STEP 6')
    message['status'] = 'ERROR_NO_DATABASE_PATH_GIVEN'
  }
  
  return message
}

/************************/
/*** message handling ***/
/************************/

ipcMain.on('get-appdir', (event) => {
  console.log('get-appdir', appConfigDir+'/config.json')

  let message = {}
  message['status'] = 'SUCCESS'
  message['payload'] = appConfigDir+'/config.json'

  mainWindow.webContents.send('got-appdir', message)
})

ipcMain.on('get-config', (event) => {
  console.log('get-config', appConfigDir+'/config.json')

  let message = {}
  message['status'] = 'INCOMPLETE'
  message['payload'] = {}

  message = getConfigFromFilePath(message)

  dbFilePath = message['payload']['paths']['db_path']['val']

  mainWindow.webContents.send('got-config', message)
})

ipcMain.on('set-config', (event, newConfigObj) => {
  console.log('set-config', appConfigDir+'/config.json')

  let message = {}
  message['status'] = 'INCOMPLETE'
  message['payload'] = {}

  fs.writeFileSync(configFilePath, JSON.stringify(newConfigObj, null, 2));
  message['status'] = 'SUCCESS'
  message['payload'] = newConfigObj

  mainWindow.webContents.send('config-set', message)
})

ipcMain.on('get-db', (event) => {
  console.log('get-db', dbFilePath)

  let message = {}
  message['status'] = 'INCOMPLETE'
  message['payload'] = {}

  message = getDbFromDbFilePath(message)

  mainWindow.webContents.send('got-db', message)
})

ipcMain.on('set-db', (event, newDbObj) => {
  // read file 
  console.log('set-db', )

  let message = {}
  message['status'] = 'INCOMPLETE'
  message['payload'] = {}

  fs.writeFileSync(dbFilePath, JSON.stringify(newDbObj, null, 2));
  message['status'] = 'SUCCESS'
  message['payload'] = newDbObj

  mainWindow.webContents.send('config-set', message)
})

ipcMain.on('run-manual-backup', (event, backupObj) => {
  console.log('run-manual-backup')

  let message = {}
  message['status'] = 'INCOMPLETE'
  message['payload'] = {}

  // actually do the backup here

  mainWindow.webContents.send('manual-backup-complete', message)
})

ipcMain.on('deploy-site', (event, siteObj) => {
  console.log('deploy-site')

  let message = {}
  message['status'] = 'INCOMPLETE'
  message['payload'] = {}

  // actually do the backup here

  mainWindow.webContents.send('site-deployed', message)
})

/**** END OF MY HANDLERS ******/

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

app.whenReady().then(() => {
});

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
// const allowedNavigationDestinations = "https://wallowahistory.org";
// app.on("web-contents-created", (event, contents) => {
//   contents.on("will-navigate", (event, navigationURL) => {
//     const parsedURL = new URL(navigationURL);
//    if (!allowedNavigationDestinations.includes(parsedURL.origin)) {
//      event.preventDefault();
//    }
//   });
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
