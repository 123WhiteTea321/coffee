import request from '../../utils/util' //引入方法，json文件引入的是组件,两边还必须用双引号。。。

// 获取应用实例
const app = getApp()
Page({
  data: {
    value: '',
    bannerList: null,
    hotList: null,
    isLogined: false
  },

  onLoad() {
    //调用一下getBannerList()
    this.getBannerList()
    this.getHotRec()
    //#region 
    //有Promise()就不用这么写了
    // wx.request({
    //   url:"http://www.kangliuyong.com:10002/banner",
    //   method:'GET',
    //   data:{
    //      appkey:'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    //   },
    //   success:(res)=>{
    //     this.setData({
    //     bannerList:res.data.result   //bannerList必须在上面data:{}声明占位
    //     })
    //   }
    // })
    //#endregion

  },
  onShow: function () {
    var token = wx.getStorageSync('token')
    //根据登录与否在左上角进行登录显示
    if (token) {
      this.setData({
        isLogined: true
      })
    } else {
      this.setData({
        isLogined: false
      })
      console.log("用户未登录")
    }
  },
  //跳转登录
  login() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  //轮播图
  getBannerList() {
    request({
      url: "/banner",
      method: 'GET',
      data: {
        appkey: app.globalData.appkey
      }
    }).then(res => {
      console.log(res)
      this.setData({
        bannerList: res.data.result //bannerList必须在上面data:{}声明占位
      })


    })
  },
  //热卖推荐数据
  getHotRec() {
    request({
      url: "/typeProducts",
      method: "GET",
      data: {
        appkey: app.globalData.appkey,
        key: 'isHot',
        value: 1
      }
    }).then(res => {
      console.log("首页热卖推荐列表", res)
      this.setData({
        hotList: res.data.result

      })
    })
  }

})