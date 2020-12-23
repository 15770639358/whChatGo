const db = wx.cloud.database({
  env: 'test-0bt5a'
})

export default class {
  //获取目录
  static getFolders(parentPathId) {
    return new Promise((resolve, reject) => {
      db.collection('folder').where({
          _openid: 'user-open-id',
          parentPathId: parentPathId
        })
        .get({
          success: function (res) {
            let folders = []
            res.data.forEach(value => {
              // console.log(value)
              folders.push({
                path: value.path,
                parentPathId: value.parentPathId,
                id: value._id
              })
            })
            resolve(folders)
          }
        })
    })
  }

  //上传照片
  static uploadFiles(cloudPath, filePath) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: resa => {
          resolve(resa.fileID)
        },
        fail: e => {
          reject('0')
        },
      })
    })
  }

  //上传信息存入数据库
  static saveFile(fileId, fileName, pathId) {
    return new Promise((resolve, reject) => {
      db.collection('filelist').add({
        data: {
          fileid: fileId,
          filename: fileName,
          pathId: pathId
        },
        success: function (res) {
          let id = res._id
          resolve(id)
        },
        fail: e => {
          reject: 0
        }
      })
    })
  }

  //新建文件夹
  static setFolser(path, parentPathId) {
    return new Promise((resolve, reject) => {
      db.collection('folder').add({
        data: {
          parentPathId: parentPathId,
          path: path,
        },
        success: function (res) {
          let id = res._id
          resolve(id)
        },
        fail: e => {
          reject: 0
        }
      })
    })
  }

  //获取以存照片id
  static getPhoto(pathId, page = 0, num = 20) {
    return new Promise((resolve, reject) => {
      db.collection('filelist').skip(page * num).limit(num).where({
          _openid: 'user-open-id',
          pathId: pathId
        })
        .get({
          success: function (res) {
            resolve(res.data)
          }
        })
    })
  }

  static countResult(pathId) {
    return new Promise((resolve, reject) => {
      db.collection('filelist').where({
        _openid: 'user-open-id',
        pathId: pathId
      }).count({
        success: function (res) {
          resolve(res.total)
        }
      })
    })
  }
}