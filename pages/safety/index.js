// pages/safety/index.js
import request from '../../utils/util'
import Dialog from '@vant/weapp/dialog/dialog'
const app = getApp()
var token = wx.getStorageSync('token')
Page({
    data: {
        show: false,
        newPassword: null,
        oldPassword: null,
        PasswordError: null
    },

    //弹出弹出窗
    showPopup() {
        this.setData({
            show: true
        });
    },
    //关闭弹出窗
    onClose() {
        this.setData({
            show: false
        });
    },
    //检查密码
    checkPassword(e) {
        var reg = /^[A-Za-z]\w{5,15}$/
        var rule = e.currentTarget.dataset.rule
        if (rule == 'new') {
            //校验新密码
            if (reg.test(this.data.newPassword) == false) {
                this.setData({
                    PasswordError: "密码格式错误"
                })
            } else {
                this.setData({
                    PasswordError: ""
                })
            }
        } else {
            //校验旧密码
            if (reg.test(this.data.oldPassword) == false) {
                this.setData({
                    PasswordError: "密码格式错误"
                })
            } else {
                this.setData({
                    PasswordError: ""
                })
            }
        }
    },
    onLoad: function (options) {

    },

    onShow: function () {

    },
    //注销账号
    removeAccount() {
        request({
            url: "/destroyAccount",
            method: "POST",
            data: {
                appkey: app.globalData.appkey,
                tokenString: token
            }
        }).then(res => {
            console.log("注销账号成功", res)
        })
    },
    //修改密码
    modifyPassword() {
        if (this.data.oldPassword == '' || this.data.newPassword == '') {
            Dialog.alert({
                title: '错误',
                message: "新密码或旧密码未输入",
            })
        } else {
            request({
                url: "/updatePassword",
                method: "POST",
                data: {
                    appkey: app.globalData.appkey,
                    tokenString: token,
                    password: this.data.newPassword,
                    oldPassword: this.data.oldPassword
                }
            }).then(res => {
                console.log("更新密码成功", res)
                this.onClose()
            })
        }
    },
    //退出登录
    exitLogin() {
        request({
            url: "/logout",
            method: "POST",
            data: {
                appkey: app.globalData.appkey,
                tokenString: token
            }
        }).then(res => {
            console.log("退出登录成功", res)
            //退出登录要清空token
            wx.removeStorageSync('token')
            wx.switchTab({
              url: '/pages/index/index',
            })
           
        })
    },



})