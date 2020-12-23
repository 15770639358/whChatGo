import funTree from './funTree.js'
// import Serv from './trackerApi.js'
const app = getApp()

var BiData = {
  wxApp: App, //App对象
  wxPage: Page,  //Page对象
  wxComponent: Component, //Component对象

  rewriteApp: function (e) { //重写App对象
    return BiData.wxApp(BiData.instrument(e)) //BiData.wxApp(BiData.instrument(e)) = App()  BiData.instrument(e) 返回重写后的对象
  },
  rewritePage: function (e) {  //重写Page对象
    return BiData.wxPage(BiData.instrument(e))  //BiData.wxPage(BiData.instrument(e)) = App()  BiData.instrument(e) 返回重写后的对象
  },
  rewriteComponent: function (e) {  //重写Component对象
    return BiData.wxComponent(BiData.instrumentComponent(e))
  },

  log(funName, self, argvs) {
    for (let i in funTree.handlerFuns) {
      if (funName == funTree.handlerFuns[i]) { //读取funTree里的方法名，监听里面有的方法
        BiData.logApi(funName, self, argvs)
      }
    }
  },

  hook:  function (funName, callback) {
    var c = callback; //将方法赋值给c
    return function () {
      BiData.log(funName, this, arguments) //调用记录方法
      return c.apply(this, arguments) //执行c即当前page要执行的方法,this => 当前的page
    }
  },

  instrument: function (e) {
    for (var t in e) {  //对每个页面Page/App对象进行遍历，t =》 key
      if ("function" == typeof e[t]) {    //判断是否为function
        e[t] = this.hook(t, e[t]) //把方法名与方法传入
      }
    }
    return e;
  },

  instrumentComponent: function (e) {
    for (var t in e) {
      if ("object" == typeof e[t]) {
        if('methods' == t) { //获取组件里面的methods，在调用instrument
          this.instrument(e[t])
        }
      }
    }
    return e;
  },
  trackerData: [],
  trackerRoute: "",
  trackerIp: "",

  logApi: async function (funName, self, argvs) {
    if (self.route != BiData.trackerRoute && BiData.trackerData.length > 0 && self.route ) {  //self.route 当前page的路径，即当前路径等于BiData记录的路径，不执行，点击调到下一个page，就当前路径不等于记录路径且存在记录路径，便向后台发送记录请求，记录的数据为当前请求的方法列表与参数
      // let res = await Serv.addTracker({ data: BiData.trackerData })
      console.log(BiData.trackerData)
      BiData.trackerData = []
      BiData.trackerRoute = self.route
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    }
    // console.log(BiData.trackerData)
    // console.log("aaa")
    // console.log(getApp().globalData.userInfo)
    //记录BiData.trackerData 
    BiData.trackerData.push({
      user: getApp() ? getApp().globalData.userInfo : "",
      funName: funName,
      arg: argvs[0],
      route: self.is ? self.is : 'APP中的方法',
      ip: BiData.trackerIp
    })
    //记录self.route
    if ( self.route ) {
      BiData.trackerRoute = self.route
    }

    // console.log(BiData.trackerData)
  },
}


App = BiData.rewriteApp //将重写后的App对象重新赋值给App对象
Page = BiData.rewritePage
Component = BiData.rewriteComponent



// 获取Ip地址
// const trackerIp = async () => {
//   let res = await Serv.getIpAddress()
//   BiData.trackerIp = res.data.ip
//   console.log("ip:" + BiData.trackerIp)
//   return res.data.ip
// }


// trackerIp()
// console.log('aaa')