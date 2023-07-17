// pages/addAddress/index.js
import request from '../../utils/util'
import Dialog from '@vant/weapp/dialog/dialog';
// import { areaList } from '@vant/weapp/area';
import {
    areaList
} from '@vant/area-data';
const token = wx.getStorageSync('token')
const app = getApp()
Page({
    data: {
        areaList,
        area: '',
        show: false,
        checked: true,
        name:'',
        tel:'',
        province: '',
        city: '',
        county: '',
        addressDetail: '',
        areaCode: '',
        postalCode: '',
        isDefault: 1,
    },
    //弹出层
    showPopup() {
        this.setData({
            show: true
        });
    },

    onClose() {
        this.setData({
            show: false
        });
    },
    //省市区确认
    confirm(e) {
        // console.log(e)
        this.setData({
            province: e.detail.values[0].name,
            city: e.detail.values[1].name,
            county: e.detail.values[2].name,
            //点完确定，在地区输入框上显示文字
            // tem: res.data.result[0].tem.split("/"),
            area: [e.detail.values[0].name,e.detail.values[1].name, e.detail.values[2].name]
        })
        // console.log(this.data.area)
        //   console.log(this.data.province) //成功打印
        this.onClose()

    },
    cancel(e) {
        this.onClose()
    },
    change(e) {
        //应该用不上
    },

    //设为默认地址
    onChange({
        detail
    }) {
        // 需要手动对 checked 状态进行更新
        this.setData({
            isDefault: detail
        });
    },

    //  新增地址接口,其中 isDefault 的值只能为 0 或者 1, ==> 0: 非默认地址, 1: 默认地址
    addAddress() {
        if (this.data.name == '' ||
        this.data.tel == '' ||
        this.data.province == '' ||
        this.data.city == '' ||
        this.data.county == '' ||
        this.data.addressDetail == '' ||
        this.data.postalCode == ''
    ) {
        Dialog.alert({
            message:"请完善相关信息",
        })
    }else{
        request({
            url: "/addAddress",
            method: "POST",
            data: {
                appkey: app.globalData.appkey,
                tokenString: token,
                name: this.data.name,
                tel: this.data.tel,
                province: this.data.province,
                city: this.data.city,
                county: this.data.county,
                addressDetail: this.data.addressDetail,
                // areaCode: this.data.areaCode,  //地区编号？有这个吗？
                postalCode: this.data.postalCode,   
                isDefault: this.data.isDefault
            }
        }).then(res => {
            // console.log(res)
            if(res.data.code==9000){
                Dialog.alert({
                    message: res.data.msg,
                  })
            }
        })
    }
       
    },

    //
    onShow: function () {

    },

})