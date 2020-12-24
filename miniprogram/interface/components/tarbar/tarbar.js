
Component({
  properties: {
    currentTab:{
      type:String,
      value:'0'
    }
  },

  data: {
    items: [
      {
        "iconPath": "/resources/image/index2.png",
        "selectedIconPath": "/resources/image/index1.png",
        "text": "新建文件夹"
      },
      {
        "iconPath": "/resources/image/products2.png",
        "selectedIconPath": "/resources/image/products1.png",
        "text": "相册"
      },
      {
        "iconPath": "/resources/image/introduce2.png",
        "selectedIconPath": "/resources/image/products1.png",
        "text": "相机"
      }
    ]
  },

  methods: {
    changePage(e) {
      let {current} = e.currentTarget.dataset
      this.setData({currentTab:current})
      if (current == '0') {
        console.log(0)
        this.triggerEvent('getFolder')
      }
      if (current == '1') {
        console.log(1)
        this.triggerEvent('getFile')
      }

      if (current == '2') {
        
      }
    }
  }
})
