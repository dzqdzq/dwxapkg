#!/usr/bin/env node
var Wxapkg = require("../");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const process = require("process");
const WXAPKG_FLAG = "V1MMWX";
const WXAPKG_FLAG_LEN = WXAPKG_FLAG.length;

let fileName = process.argv[2];
if (!fileName) {
  new Error(`参数不正确`);
}

wxapkgExts = [".wxapkg", ".wxvpkg", ".wx"];
if (fileName === "*") {
  let paths = fs.readdirSync(".");
  console.log(paths);

  paths.forEach((fileName) => {
    fileName = path.resolve(fileName);
    var extname = path.extname(fileName);
    if (wxapkgExts.includes(extname)) {
      processOne(fileName);
    }
  });
} else {
  processOne(fileName);
}

function getKeyIv(wxid) {
  const key = crypto.pbkdf2Sync(wxid, "saltiest", 1000, 32, "sha1");
  const iv = "the iv: 16 bytes";
  return { key, iv };
}

function decrypt(data, wxid) {
  const { key, iv } = getKeyIv(wxid);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const xor = wxid.charCodeAt(wxid.length - 2);
  const other = [];
  for (let i = 1024, j = data.length; i < j; i++) {
    other.push(data[i] ^ xor);
  }
  return Buffer.concat([
    decipher.update(data.slice(0, 1024)),
    decipher.final(),
    Buffer.from(other),
  ]);
}

function encrypt(data, wxid) {
  const { key, iv } = getKeyIv(wxid);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const xor = wxid.charCodeAt(wxid.length - 2);
  const other = [];
  for (let i = 1023, j = data.length; i < j; i++) {
    other.push(data[i] ^ xor);
  }
  return Buffer.concat([
    Buffer.from(WXAPKG_FLAG),
    cipher.update(data.slice(0, 1023)),
    cipher.final(),
    Buffer.from(other),
  ]);
}

function getWxidFromPath(path) {
  path = path.replace(/\\/g, "/");
  let regex = /Applet\/wx(\w+)/;
  let match = path.match(regex);
  if (match) {
    return `wx${match[1]}`; // 输出: 7a34380eca23579172
  }
  return null;
}

function processOne(fileName) {
  if (fs.existsSync(fileName)) {
    new Error(`${fileName} 不存在`);
  }

  function getFiles(dir, base = '', files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.name.startsWith('.')) {
            continue;
        }

        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(base, entry.name);

        if (entry.isDirectory()) {
            getFiles(fullPath, relativePath, files);
        } else if (entry.isFile()) {
            const stats = fs.statSync(fullPath);
            files.push({ file: fullPath, simName: relativePath, stats });
        }
    }

    return files;
  }

  fileName = path.resolve(fileName);
  var extname = path.extname(fileName);
  let isDecode = wxapkgExts.includes(extname);

  if (isDecode) {
    // 解码
    let file = fs.readFileSync(fileName);
    let writePath = fileName.replace(extname, "/");
    if (file.slice(0, WXAPKG_FLAG_LEN).toString() === WXAPKG_FLAG) {
      const wxid = process.argv[3] || getWxidFromPath(fileName);
      if (!wxid) {
        console.log("使用示例：dwxapkg /a/b/c/aa.wxapkg wxid");
        throw new Error(`请指定wxid`);
      }
      file = decrypt(file.slice(WXAPKG_FLAG_LEN), wxid);
    }
    let wxapkg = new Wxapkg(file);
    let files = wxapkg.decode();
    files.forEach((f) => {
      let filePath = path.join(writePath, f.name);
      let dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      console.log(filePath);
      fs.writeFileSync(filePath, f.chunk, "binary");
    });
  } else {
    // 压缩
    let wxapkgFileName = fileName + ".wxapkg";
    let list = getFiles(fileName);
    let wxapkg = new Wxapkg();
    wxapkg.encode(list, wxapkgFileName);

    setTimeout(() => {
      let wxid;
      wxid = process.argv[3];
      if (wxid) {
        let file = fs.readFileSync(wxapkgFileName);
        fs.writeFileSync(wxapkgFileName, encrypt(file, wxid));
        return;
      }
      if (process.platform === "darwin") {
        console.log("当前是mac环境，跳过加密");
        return;
      }
      // 提取wxid, 可能是windows环境
      wxid = getWxidFromPath(fileName);
      if (wxid) {
        let file = fs.readFileSync(wxapkgFileName);
        fs.writeFileSync(wxapkgFileName, encrypt(file, wxid));
        return;
      }

      console.warn("您当前可能是windows环境, 未指定wxid，已跳过加密");
    }, 1000);
  }
}
