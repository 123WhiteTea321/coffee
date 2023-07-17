// pages/order/index.js
import request from '../../utils/util'
const app=getApp()
const token=wx.getStorageSync('token')
Page({

    data: {
       shopsList:null,
       totalPrice:null,
       shopRows:null
    },

  //获取购物车商品条目 (不是商品总数量)
     getShopRows(){
         request({
           url:"/shopcartRows",
          method: "GET",
          data: {
              appkey: app.globalData.appkey,
              tokenString: token
            }
         }).then(res=>{
             console.log("购物车商品条目",res)
             this.setData({
                 shopRows:res.data.result
             })
         })
     },
    //  查询用户所有购物车商品接口
      getAllShop(){
        var price=0

         request({
          url:"/findAllShopcart",
          method:"GET",
           data: {
              appkey: app.globalData.appkey,
              tokenString: token
            }
         }).then(res=>{
             console.log("购物车所有商品",res)
             this.setData({
                 shopsList:res.data.result
             })
             //获取总价格 
             this.data.shopsList.forEach(item=>{
                price +=item.price*item.count
             })
             this.setData({
                 totalPrice:price
             })
             console.log("总价格",this.data.totalPrice)
         })
      },

      //立即结算
      pay(){
          request({
           url:"/pay",
           method:"POST",
          data: {
              appkey: app.globalData.appkey,
              tokenString: token,
              sids:sids,   //有点麻烦，forEach把item的sid提取出来?
              phone: phone,  //从个人信息接口获取
              address: address,
              receiver:  receiver
            }
          }).then(res=>{
              //完成地址再来，
          })
      },
   
    onShow: function () {
       this.getShopRows()
       this.getAllShop()
    },

 
})