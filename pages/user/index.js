// pages/user/index.js
import request from '../../utils/util'
const app = getApp()
const token = wx.getStorageSync('token')
Page({
  data: {
    personList: null
  },

  //个人资料跳转
  personal() {
    wx.navigateTo({
      url: '/pages/my/index',
    })
  },
   //我的订单跳转
   order(){
     wx.navigateTo({
       url: '/pages/order/index',
     })
   },
   //我的收藏跳转
   collect(){
     wx.navigateTo({
       url: '/pages/collect/index',
     })
   },
   //地址管理跳转
   address(){
     wx.navigateTo({
       url: '/pages/address/index',
     })
   },
   //安全中心跳转
   safety(){
     wx.navigateTo({
       url: '/pages/safety/index',
     })
   },




  //获取个人资料
  person() {
    if(token){
      request({
        url: "/findMy",
        method: "GET",
        data: {
          appkey: app.globalData.appkey,
          tokenString: token
        }
      }).then(res => {
        console.log("个人信息", res)
        this.setData({
          personList: res.data.result[0]
        })
      })
    }else{
      // wx.navigateTo({
      //   url: '/pages/login/index',
      // })
    }
   
  },

  // 账号管理接口
  account() {
    request({
      url: "/findAccountInfo",
      method: "GET",
      data: {
        appkey: app.globalData.appkey,
        tokenString: token
      }
    }).then(res=>{
      console.log("账户管理",res)
    })
  },


  onLoad: function (options) {

  },
  onShow: function () {
    this.person()
    this.account()
  },

})