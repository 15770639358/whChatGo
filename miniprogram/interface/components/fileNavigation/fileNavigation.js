// interface/components/fileNavigation/fileNavigation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //文件名
    fileName:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getNextFolders() {
      this.triggerEvent('getNextFolders')
    }
  }
})
