// pages/menu/index.js
import request from '../../utils/util'
const app = getApp()
Page({
  //凡是上面data里面的值，都必须要用setData修改，否则页面不会有显示的
  // console.log()写在request和then的外面就没有意义了
  // wx:key="index"的index不用在data里声明
  data: {
    activeKey: 0,
    sideList:null,
    productList:null
  },

  onLoad: function (options) {

  },

  onShow: function () {
    this.getType()

  },

  //商品类型接口
  getType() {
    request({
      url: "/type",
      method: "GET",
      data: {
        appkey: app.globalData.appkey
      }
    }).then(res => {
      console.log("商品类型", res)
      var arr=res.data.result
      //给每个item绑定type值
      arr.forEach(item=>{
        item.key="type"
      })
      arr.unshift({
        id:0,
        key:'isHot',
        type:1,
        typeDesc:"热卖推荐"
      })
      this.setData({
        sideList:arr
      })
      console.log("sideList",this.data.sideList)
        // this.getTypeProduct(this.data.sideList[0].key,this.data.sideList[0].type)
        // this.changeTab(e)
    })
  },
  //具体商品接口
  getTypeProduct(key, value) {
    request({
      url: "/typeProducts",
      method: "GET",
      data: {
        appkey: app.globalData.appkey,
        key: key,
        value: value
      }
    }).then(res => {
      console.log("具体商品",res)
      this.setData({
        productList:res.data.result
      })
      console.log("productList",this.data.productList)
    })
  },
  //绑定的点击事件
  changeTab(e){
    // console.log(e.detail) //会显示点击项的id值
    this.getTypeProduct(this.data.sideList[e.detail].key,this.data.sideList[e.detail].type)
    
  }

})