// pages/detail/index.js
import request from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
const app = getApp() //应该不用写在里面吧
Page({

    data: {
        detailData: null,
        tem: null,
        temIndex: 0, //默认是0,给糖、冰做选择用的

        suagr: null,
        sugarIndex: 0,

        milk: null,
        milkIndex: 0,

        cream: null,
        creamIndex: 0,
        count: 1,
        isCollected: false
    },

    //步进器监测数量
    onChange(event) {
        // console.log(event.detail);
        // 还要拿到count的值,不然有什么意义
        this.data.count = event.detail
        console.log(this.data.count) //拿到了 
    },

    //改变温度
    changeTem(e) {
        console.log("e", e)
        var index = e.currentTarget.dataset.index
        this.setData({
            temIndex: index //这里又不需要this了？
        })
    },
    //改变糖
    changeSugar(e) {
        var index = e.currentTarget.dataset.index
        this.setData({
            sugarIndex: index
        })
    },
    //改变奶
    changeMilk(e) {
        console.log("e", e)
        var index = e.currentTarget.dataset.index
        this.setData({
            milkIndex: index
        })
    },
    //改变奶油
    changeCream(e) {
        console.log("e", e)
        var index = e.currentTarget.dataset.index
        this.setData({
            creamIndex: index 
        })
    },


    onLoad: function (options) {
        console.log("options", options) //里面有pid
        this.getGoodsDetail(options.pid) //调用
        // this.goCart()  //页面加载就转进购物车页面,真是灾难
        // this.collect()  //绑定的事件通过点击来触发,不需要加载来触发
    },

    //请求商品详情数据（明明是因为点击事件进来的，居然还是要像首页那样在js中请求商品数据。。不对，详情数据是新的。）
    //soga,通过options的pid作为标识把详情数据带过来
    getGoodsDetail(pid) {
        request({
            url: '/productDetail',
            method: "GET",
            data: {
                appkey: app.globalData.appkey,
                pid: pid
            }
        }).then(res => {
            console.log("商品详情数据", res)
            this.setData({
                detailData: res.data.result[0],
                //这里只能存放对象格式,又不能写if
                tem: res.data.result[0].tem.split("/"),
                sugar: res.data.result[0].sugar.split("/"),
                milk: res.data.result[0].milk.split("/"),
                cream: res.data.result[0].cream.split("/")
            })
            //明明有值，下面这个为什么就是打印不出来？
            // console.log("某个商品的详情数据",this.detailData) 

            //查询是否收藏,在请求查询数据之后就执行
            this.beCollected()
        })
    },

    //跳转到购物袋
    goCart() {
        wx.switchTab({ //此处用的不是navigateTo,
            url: '/pages/shoppingbag/index',
        })
    },
    /* 
     收藏功能的逻辑是:
     进来详情页面的时候默认收藏状态为空,然后加载becollected()函数通过后台请求的数据判断是否被收藏了,
     收藏过的话becollected()会赋予页面收藏状态(记住是赋予,手段是setData),以保持之前的记录
     后面点击收藏collect()和取消收藏cancelCollect()都是动作性函数,setData都会发送给后台,
     这样becollected才能拿到是否收藏的数据来渲染页面

     以上涉及到三次request()才完成,不知道vue那边是不是
    */

    //判断当前商品是否被收藏
    /*即使在collect()里面让 isCollected=true了,但是点出去再进来收藏又没了,所以要加入以下判断,那么vue里面是怎么解决的?*/
    beCollected() {
        var token = wx.getStorageSync('token') 
        //判断用户是否登录
        if (token) {
            //用户登录以后才判断是否被收藏
            request({
                url: "/findlike",
                method: "GET",
                data: {
                    appkey: app.globalData.appkey,
                    pid: this.data.detailData.pid,
                    tokenString: token
                }
            }).then(res => {
                console.log("是否收藏", res)
                if (res.data.result.length > 0) {
                    //已收藏
                    this.setData({
                        isCollected: true //跟函数重名不会冲突吗
                    })
                } else {
                    //未收藏
                    this.setData({
                        isCollected: false
                    })
                }

            })
        }
    },
    //收藏
    collect() {
        var token = wx.getStorageSync('token') 
        //判断用户是否登录
        if (token) {
            //开始收藏，调用接口(跟登录有关的都要调用接口)
            request({
                url: "/like",
                method: "POST",
                data: {
                    appkey: app.globalData.appkey,
                    pid: this.data.detailData.pid, //非要加上this，也不知道指向谁,指向js?
                    //   不加也不行啊,作用域内没有detailData,不知道的话就打印一下this试试
                    // 上面已经通过options.pid请求的数据中回带有pid,这里就不用去options里面找了
                    // pid: res.data.result[0].pid,错误的
                    tokenString: token
                }
            }).then(res => {
                // 发送请求,返回了msg:"已收藏"
                console.log("收藏", res)
                console.log("this", this)
                if (res.data.code == 800) {
                    this.setData({
                        isCollected: true
                    })
                    Toast.success(res.data.msg);
                }

            })

        } else {
            //跳转登录
            wx.navigateTo({
                url: '/pages/login/index'
            })
        }
    },

    //取消收藏
    cancelCollect() {
        var token = wx.getStorageSync('token')
        //判断用户是否登录
        if (token) {
            //开始收藏，调用接口(跟登录有关的都要调用接口)
            request({
                url: "/notlike",
                method: "POST",
                data: {
                    appkey: app.globalData.appkey,
                    pid: this.data.detailData.pid,
                    tokenString: token
                }
            }).then(res => {
                console.log("取消收藏", res)
                if (res.data.code == 900) {
                    this.setData({
                        isCollected: false
                    })
                    Toast.success(res.data.msg);
                    
                }
            })

        } else {
            //跳转登录
            wx.navigateTo({
                url: '/pages/login/index'
            })
        }
    },
    //加入购物车
    addCart() {
        var token = wx.getStorageSync('token') 
        if(token){
            request({
                url: "/addShopcart",
                method: "POST",
                data: {
                    // 为什么这么多this.data
                    pid: this.data.detailData.pid,
                    count: this.data.count,
                    rule: this.data.tem[this.data.temIndex] + "/" + this.data.sugar[this.data.sugarIndex] + "/" +  this.data.cream[this.data.creamIndex],
                    appkey: app.globalData.appkey,
                    tokenString: token
                }
            }).then(res => {
                console.log("this", this)
                console.log("this.data", this.data)
                console.log("加入购物车成功",res)
                if(res.data.code==3000){
                    Toast.success(res.data.msg);
                }
            })
        }
     
    }



})