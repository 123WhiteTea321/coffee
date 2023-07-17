// pages/shoppingbag/index.js
import request from '../../utils/util'
const app = getApp()
Page({

    data: {
        //为操作页面方便,这里暂设成已登录
        isLogined: false,
        cartList: null,
        checked: false,
        allChecked: false,
        totalPrice: 0
    },

   //提交订单
   onClickButton(){
       wx.navigateTo({
         url: '/pages/order/index',
       })
   },


    onLoad: function (options) {

    },

    onShow: function () {
        //进入购物车页面也是要判断用户是否登录
        var token = wx.getStorageSync("token") 
        if (token) {
            // this.data.isLogined=true //为什么这里设置没有用？可能是setData的问题（页面没有变,那就只能在下面变了）
            this.getCartList()
        } else {
            //用户未登录
            console.log("用户未登录")
            this.setData({
                isLogined:false
            })
        }
    },
    //单项复选框
    /*逻辑：给每一个item绑定checked和id,然后用数组[id].checked=!数组[id].checked
      通俗点说就是改变数组某一项的checked属性，再重新赋值给数组
    */
    onChange(event) {
        console.log(event)
        //获取item身上绑定的data-id的值
        var id = event.currentTarget.dataset.id

        // var arr = this.data.cartList
        // arr[id].checked = !arr[id].checked
        this.data.cartList[id].checked = !this.data.cartList[id].checked
        this.setData({
            // cartList: arr
            cartList: this.data.cartList
        });
        //单选勾上计算价格
        this.getTotalPrice()
        //判断有一个没有勾选上，都会取消全选
        var count = 0
        this.data.cartList.forEach(item => {
            if (item.checked == false) {
                this.setData({
                    allChecked: false
                })
            }
            //单选 所有商品都被勾选时，全选框改变
            if (item.checked) {
                count++
                if (count == this.data.cartList.length) {
                    this.setData({
                        allChecked: true
                    })
                }
            }
        })

    },
    //全选复选框
    onChangeAll(event) {
        this.setData({
            allChecked: !this.data.allChecked //左边为什么不用this.data（左边是名，右边是值,要使用值就要加）
        })
        //全选勾上时，所有都勾上
        if (this.data.allChecked) {
            this.data.cartList.forEach(item => {
                item.checked = true
                this.setData({
                    cartList: this.data.cartList
                })
            })
            this.getTotalPrice()
        } else {
            //全选取消时，所有都取消
            this.data.cartList.forEach(item => {
                item.checked = false
                this.setData({
                    cartList: this.data.cartList,
                    totalPrice: 0 //这里手动触发（onchangeAll）全选取消totalPrice才清0，某个item取消导致的全选取消不触发totalPrice清0
                })
            })
        }
        //上面循环的setData可以放在这里面来

    },
    //步进器
    onChanged(event) {
        console.log(event.detail)
        this.data.count = event.detail
        console.log(this.data.count) //拿到了 
        this.setData({
            count: event.detail,
        });
    },
    //请求购物车数据
    getCartList() {
        var token = wx.getStorageSync("token") 
        if (token) {
            request({
                url: "/findAllShopcart",
                method: "GET",
                data: {
                    appkey: app.globalData.appkey,
                    tokenString: token
                }
            }).then(res => {
                //这里获取购物车数据然后强行登录,后面要改
                console.log("购物车数据", res)
                console.log("isLogined", this.data.isLogined)
                //给每一个item绑定一个checked属性
                var arr = res.data.result
                arr.forEach(item => {
                    item.checked = false
                })
                this.setData({
                    // 这里设置有用,偏偏onShow里面设置isLogined:true没用
                    isLogined: true,
                    cartList: arr
                })
            })
        } else {
            this.setData({
                isLogined: false
            })
        }
    },
    //计算总价
    getTotalPrice() {
        var total = 0
        //当商品被勾选上时，才会计算价格
        this.data.cartList.forEach(item => {

            if (item.checked) {
                total += item.count * item.price //setData只能修改data{}里面的值，这里大胆放心用
            }
            this.setData({
                totalPrice: total
            })
        })
    },
    //修改商品数量
    modifyShopCount(e) {
        var token = wx.getStorageSync("token")
        //data-index绑定的值只能从事件源e中获取
        console.log(e)
        var index = e.currentTarget.dataset.index
        //修改步进器的值居然这么麻烦？？根源是下面的data里的count没有引起本地的count改变
        //下面这一段还不能放到then()里面？？。。。。。。。。。。。。。。。。。。。。。。。。。。
        var a = ['cartList[index].count']
        if (e.type == "plus") {
            this.setData({
                a: this.data.cartList[index].count++
            })
        } else {
            this.setData({
                a: this.data.cartList[index].count--
            })
        }
        //。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
        request({
            url: "/modifyShopcartCount",
            method: "POST",
            data: {
                appkey: app.globalData.appkey,
                tokenString: wx.getStorageSync('token') || token,
                sid: this.data.cartList[index].sid,
                count: this.data.cartList[index].count
            }
        }).then(res => {
            console.log("商品数量", res)
        })
        this.getTotalPrice()
    },
    //删除商品
    delete(e) {
        var token = wx.getStorageSync("token")
        var index=e.currentTarget.dataset.index
        request({
            url: "/removeShopcart",
            method: "POST",
            data: {
                appkey: app.globalData.appkey,
                tokenString: token,
                sids: JSON.stringify([this.data.cartList[index].sid])
            }
        }).then(res=>{
            if(res.data.code==7000){
                this.getCartList()
            }
        })
    },

    //跳转登录
    gologin() {
        wx.navigateTo({
            url: '/pages/login/index',
        })
    }
})