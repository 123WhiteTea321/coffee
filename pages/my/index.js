import request from '../../utils/util'
const app = getApp()
const token = wx.getStorageSync('token')
Page({
  data: {
    personList: null,
    desc:""     //desc直接在这里修改？不可能吧？应该交给用户修改的，搞个输入框？
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
    }).then(res => {
      console.log("账户管理", res)
      this.setData({
        personList: res.data.result[0]
      })

    })
  },

  //修改简介
  updateDesc() {
    request({
        url:"/updateDesc",
       method: "POST",
     data: {
        appkey: app.globalData.appkey,
        tokenString: token,
        desc:this.data.desc
      }
    })
  },



  onLoad: function (options) {

  },
  onShow: function () {
    this.account()
  },

})