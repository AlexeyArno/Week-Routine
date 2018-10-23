// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const notifier = require('node-notifier');
const path = require('path');
const fs = require("fs")
const {dialog} = require('electron')

exports.notifAction = (title, message) =>{
  notifier.notify(
    {
      title,
      message,
      icon:  path.join(__dirname,'/res/images/routinelogo@medium.png'),
      sound:true
    }
  )
}

exports.fileSelect = async ()=>{
   let promise = new Promise(function(resolve, reject){
    dialog.showSaveDialog(function (filename) {
        if (filename === undefined) reject();  
        resolve(filename);
      })
   })

   return await promise;

}

exports.openFile = async (path)=>{
  let promise = new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) reject(err);
      resolve(data)
      // data is the contents of the text file we just read
    });
  })
  return await promise;
}

exports.writeToFile = async (path, data)=>{
  let promise = new Promise((resolve, reject)=>{
    fs.writeFile(path, data,'utf-8', (err)=>{
      if (err) reject(err)
      else resolve();
    })
  })

  return await promise;
}