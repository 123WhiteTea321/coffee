// components/goods-list/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        goodList: Array
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        //跳转到商品详情页面
        goDetail(e) {
            console.log("e", e)
            //  直接拿取数据不用setData了？setData的应用场景是data里面声明变量，再在.then()里面setData赋值
            var pid = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/detail/index?pid='+pid,
            })
        }
    }
})