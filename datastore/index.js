const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId()
    .then((id) => {
      fs.writeFileAsync(`${exports.dataDir}/${id}.txt`, text);
      return id;
    })
    .then((id) => (callback(null, {id, text})));
};

exports.readAll = (callback) => {
  const data = [];
  fs.readdirAsync(`${exports.dataDir}`).then((files) => (
    Promise.all(files.map((file) => fs.readFileAsync(`${exports.dataDir}/${file}`)
      .then((text) => (data.push({id: file.split('.')[0], text: String(text)})))))
  )).then(() => (callback(null, data)));
};

exports.readOne = (id, callback) => {
  fs.readFileAsync(`${exports.dataDir}/${id}.txt`)
    .then((fileData) => (callback(null, {id, text: String(fileData)})));
};

exports.update = (id, text, callback) => {
  fs.readFileAsync(`${exports.dataDir}/${id}.txt`)
    .then(() => fs.writeFileAsync(`${exports.dataDir}/${id}.txt`, text))
    .then(() => (callback(null, {id, text})));
};

exports.delete = (id, callback) => {
  fs.readFileAsync(`${exports.dataDir}/${id}.txt`)
    .then(() => fs.unlink(`${exports.dataDir}/${id}.txt`))
    .then(() => callback());
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
