// miniprogram/pages/uploadFile/uploadFile.js
import Serv from './uploadFileApi'
let hander
let app = getApp()
Page({

  data: {
    // folders: [],
    showFolders: [],
    filePath: [], //文件本地临时路径,
    cloudPath: '', //文件上传路径
    cloudPathId: '', //文件上传路径的id
    cloudPathList: [], //文件上传路径列表
    cloudPathIdList: [], //文件上传路径的id列表
    show: false,
    addPath: '', //需新建的path folder,
    photo: [], //已有的photo，展示
    page: 0, //当前页数
    num: 20, //每页数据数
    nowPhoto: [], //本页数据量
    oldPhoto: [], //除去本页的数据量
    getNextPhoto: true //触底更新是否可以
  },

  onLoad: async function () {
    await this.init()
    let photo = await this.getPhoto()
    let photoPath = []
    photo.forEach(value => {
      photoPath.push(value.fileid)
    })
    this.setData({
      photo: photoPath
    })

    //下拉刷新防抖
    hander = this.throttle(2000)
  },

  async init() {
    console.log(app)
    let showFolders = []
    // let allFolders = await Serv.getFolders()
    let folers = await Serv.getFolders('')
    folers.forEach(folder => {
      showFolders.push(folder)
    })
    this.setData({
      showFolders,
      cloudPathIdList: ['']
    })
  },

  //获取照片
  async getPhoto() {
    return await Serv.getPhoto(this.data.cloudPathId, this.data.page, this.data.num)
  },

  //触底更新
  async getNextPhoto() {
    if (this.data.getNextPhoto) {
      await hander(this.getNextPhotoImpl)
    }
  },

  //触底更新实现
  async getNextPhotoImpl() {
    let total = await Serv.countResult(this.data.cloudPathId)
    if ((this.data.photo.length + this.data.filePath.length) < total) {
      // console.log('aaa')
      // this.setData({filePath: []})
      let page = this.data.page + 1
      this.setData({
        page
      })
      let photos = await this.getPhoto()
      let photoPath = []
      photos.forEach(value => {
        photoPath.push(value.fileid)
      })
      // this.setData({
      //   nowPhoto: photoPath
      // })
      let oldPhoto = this.data.oldPhoto
      let nowPhoto = this.data.nowPhoto
      oldPhoto = [...oldPhoto, ...nowPhoto]
      let photo = [...oldPhoto, ...photoPath]
      this.setData({
        photo,
        oldPhoto,
        nowPhoto: photoPath
      })
    }
  },

  //获取下一级目录
  async getNextFolders(e) {
    this.setData({page: 0})
    let id = e.target.dataset.id
    let cloudPath = e.target.dataset.path
    let showFolders = await Serv.getFolders(id)
    this.setData({
      showFolders,
      cloudPath,
      cloudPathId: id
    })
    //将本目录下的路径信息获取，存放在列表下
    let {
      cloudPathList,
      cloudPathIdList
    } = this.data
    cloudPathIdList.push(this.data.cloudPathId)
    cloudPathList.push(this.data.cloudPath)
    this.setData({
      cloudPathIdList,
      cloudPathList
    })

    let filePath = []
    let photos = await this.getPhoto()
    let photoPath = []
    photos.forEach(value => {
      photoPath.push(value.fileid)
    })
    let oldPhoto = []
    let photo = [...oldPhoto, ...photoPath]
    this.setData({
      filePath,
      nowPhoto: photoPath,
      photo,
      oldPhoto
    })
  },

  //获取上一级目录
  async getPreFolders() {
    if (this.data.cloudPathIdList.length > 1) {
      this.setData({page: 0})
      let {
        cloudPathList,
        cloudPathIdList
      } = this.data
      cloudPathList.pop()
      cloudPathIdList.pop()

      let cloudPathId = cloudPathIdList[cloudPathIdList.length - 1]
      let cloudPath = cloudPathList[cloudPathList.length - 1]

      this.setData({
        cloudPathList,
        cloudPathIdList,
        cloudPathId,
        cloudPath
      })

      let showFolders = await Serv.getFolders(cloudPathId)
      let photos = await this.getPhoto()
      let photoPath = []
      let filePath = []
      photos.forEach(value => {
        photoPath.push(value.fileid)
      })
      let oldPhoto = []
      let photo = [...oldPhoto, ...photoPath]
      this.setData({
        filePath,
        nowPhoto: photoPath,
        photo,
        showFolders,
        oldPhoto
      })
    }

  },

  //上传文件
  async uploadFile() {
    let _this = this
    this.setData({
      getNextPhoto: false
    })
    _this.setData({
      filePath: []
    })
    let photos = await _this.getPhoto()
    let photoPath = []
    photos.forEach(value => {
      photoPath.push(value.fileid)
    })
    // _this.setData({
    //   nowPhoto: photoPath
    // })
    // console.log(photoPath)
    let oldPhoto = this.data.oldPhoto
    let photo = [...oldPhoto, ...photoPath]
    // console.log(photoPath)
    _this.setData({
      photo,
      nowPhoto: photoPath
    })
    await this.getNextPhotoImpl()
    _this.setData({
      getNextPhoto: true
    })
    wx.chooseImage({
      count: 10, //可选择最大文件数 （最多100）
      async success(res) {
        //filePath
        let filePath = []
        //设置空白待上传图片，上传成功显示
        res.tempFilePaths.forEach(path => {
          filePath.push({
            path: '',
            successUpload: true
          })
        })
        _this.setData({
          filePath
        })
        //循环遍历上传
        res.tempFilePaths.forEach(async (path, i) => {
          const filePath = path //文件本地临时路径
          const fileName = (new Date()).getTime() + Math.random()
          const cloudPath = _this.data.cloudPath + fileName //云存储路径
          let fileID = await Serv.uploadFiles(cloudPath, filePath)
          let saveId = await Serv.saveFile(fileID, fileName, _this.data.cloudPathId)
          if (fileID === 0 || saveId === 0) {
            wx.showToast({
              title: '上传失败',
            })
          } else {
            let filePath = _this.data.filePath
            filePath[i] = {
              path: path,
              successUpload: true
            }
            _this.setData({
              filePath
            })
          }
        })
      },
      fail: e => {
        wx.showToast({
          title: '上传失败',
        })
      }
    })
  },

  //新建文件夹
  async setFolser() {
    if (this.data.addPath.trim()) {
      await Serv.setFolser(this.data.cloudPath + this.data.addPath + '/', this.data.cloudPathId)
      let showFolders = await Serv.getFolders(this.data.cloudPathId)
      this.setData({
        showFolders,
        show: false,
        addPath: ''
      })
    } else {
      wx.showToast({
        title: '文件夹名不可为空',
      })
    }

  },

  //展示新建文件夹的输入框
  isShow() {
    this.setData({
      show: true,
      addPath: ''
    })
  },

  onClose() {
    this.setData({
      show: false,
      addPath: ''
    })
  },

  //获取输入内容
  onChange(e) {
    let addPath = e.detail.value
    this.setData({
      addPath
    })
  },


  //防抖
  throttle(delay) {
    let prev = Date.now();
    return function (func) {
      var context = this;
      var args = arguments;
      var now = Date.now();
      if (now - prev >= delay) {
        func.apply(context, args);
        prev = Date.now();
      }
    }
  }
})