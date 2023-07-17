// pages/address/index.js
Page({


    data: {

    },
    //跳转到编辑地址
    editAddress(){
        wx.navigateTo({
          url: '/pages/editAddress/index',
        })
    },
    //跳转到新增地址
    addAddress(){
        wx.navigateTo({
          url: '/pages/addAddress/index',
        })
    },

    onShow: function () {

    },

})