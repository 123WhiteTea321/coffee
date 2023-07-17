import request from '../../utils/util'
const app = getApp()
var token = wx.getStorageSync('token')
Page({
    data: {
       collectList:null
    },
    //查询用户所有收藏商品接口(少一个作是否登录的判断)
    getAllLike() {
        request({
            url: "/findAllLike",
            method: "GET",
            data: {
                appkey:app.globalData.appkey,
                tokenString: token
            }
        }).then(res=>{
            console.log("所有收藏商品",res)
            this.setData({
                collectList:res.data.result
            })
                
        })
    },
    onLoad: function (options) {

    },

    onShow: function () { 
      this.getAllLike()
    },

})