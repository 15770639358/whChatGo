//index.js

const db = wx.cloud.database({
  env: 'test-0bt5a'
})
Page({
  data: {
    filePath:'',
    folders: []
  },
  onShow() {
    // this.addUser()
  },
  // addUser() {
    // db.collection('user').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     username:'Bob',
    //     password:'123456'
    //   },
    //   success: function(res) {
    //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    //     console.log(res)
    //   }
    // })

    // db.collection('user').doc('0a4429175fbb4ee4003dac565a2ce227').get({
    //   success: function(res) {
    //     // res.data 包含该记录的数据
    //     console.log(res.data)
    //   }
    // })
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       //发起网络请求
    //       // wx.request({
    //       //   url: 'https://test.com/onLogin',
    //       //   data: {
    //       //     code: res.code
    //       //   }
    //       // })
    //       console.log(res.code)
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })

  //   wx.cloud.callFunction({
  //     // 云函数名称
  //     name: 'add',
  //     // 传给云函数的参数
  //     data: {
  //       a: 1,
  //       b: 2,
  //     },
  //     success: function (res) {
  //       console.log(res.result.sum) // 3
  //     },
  //     fail: console.error
  //   })
  // },
  // uploadfile() {

  // },
  uploadfile() {
    wx.navigateTo({
      url: '/pages/uploadFile/uploadFile',
    })
  },
  uploadfiles: function (e) {
    let _this = this
    wx.chooseMessageFile({
      count: 10, //可选择最大文件数 （最多100）
      type: 'all', //文件类型，all是全部文件类型
      success(res) {
        const filePath = res.tempFiles[0].path //文件本地临时路径
        const fileName = res.tempFiles[0].name
        _this.setData({filePath: filePath})
        // 上传文件
        const cloudPath = 'photo/QQ/' + fileName //云存储路径
        console.log(cloudPath,'bbb')
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: resa => {
            console.log(resa.fileID)
            //把文件名和文件在云存储的fileID存入filelist数据表中
            db.collection('folder').add({
              data: {
                path: 'photo/QQ/'
              },
              success: function(res) {
                let id = res._id
                db.collection('filelist').add({
                  data: {
                    filename: cloudPath,
                    fileid: resa.fileID,
                    pathId: id
                  },
                })
              }
            })
          },
          fail: e => {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
        })
      }
    })
  },

})