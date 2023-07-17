// pages/login/index.js
import request from '../../utils/util'
import Dialog from '@vant/weapp/dialog/dialog'
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

    data: {
        phone: '',
        password: '',
        PhoneError: '',
        PasswordError: '',
        show: false,
        regPhone: '',
        regPassword: '',
        regNickname: '',
        NicknameError: '',
        regPhoneError: '',
        regPasswordError: '',

    },
    //弹出弹出框
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

    //检查手机号
    checkPhone(e) {
        var reg = /^1[3-9]\d{9}$/
        var rule = e.currentTarget.dataset.rule
        if (rule == 'login') {
            //校验登录手机号
            if (reg.test(this.data.phone) == false) {
                this.setData({
                    PhoneError: "手机格式输入错误"
                })
            } else {
                this.setData({
                    PhoneError: ""
                })
            }
        } else {
            //校验注册手机号
            if (reg.test(this.data.regPhone) == false) {
                this.setData({
                    regPhoneError: "手机格式输入错误"
                })
            } else {
                this.setData({
                    regPhoneError: ""

                })
            }
        }

    },
    //检查密码
    checkPassword(e) {
        var reg = /^[A-Za-z]\w{5,15}$/
        var rule = e.currentTarget.dataset.rule
        if (rule == 'login') {
            //校验登录密码
            if (reg.test(this.data.password) == false) {
                this.setData({
                    PasswordError: "密码格式错误"
                })
            } else {
                this.setData({
                    PasswordError: ""

                })
            }
        } else {
            //校验注册密码
            if (reg.test(this.data.regPassword) == false) {
                this.setData({
                    regPasswordError: "密码格式错误"
                })
            } else {
                this.setData({
                    regPasswordError: ""

                })
            }
        }

    },
    //检查昵称（凡是事件，无论是点击事件，失焦事件，都有一个事件源e）
    checkNickname(e) {
        var reg = /^[\w\u4e00-\u9fa5]{1,10}$/
        if (reg.test(this.data.regNickname) == false) {
            this.setData({
                NicknameError: "昵称错误"
            })
        } else {
            this.setData({
                NicknameError: ""
            })
        }
    },
    //登录
    login() {
        //检查手机号或密码是否输入
        if (this.data.phone == '' || this.data.password == '') {
            Dialog.alert({
                title: '错误',
                message: "手机号或密码未输入",
            })
        } else {
            request({
                url: "/login",
                method: "POST",
                data: {
                    appkey: app.globalData.appkey,
                    password: this.data.password,
                    phone: this.data.phone
                }
            }).then(res => {
                console.log(res)
                //登录成功
                if (res.data.code == 200) {
                    Dialog.alert({
                        message: res.data.msg,
                    })
                    //保存token到本地
                    wx.setStorageSync('token', res.data.token)
                    
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                } else {
                    Dialog.alert({
                        message: res.data.msg,
                    })
                }
            })
        }

    },
    //注册
    register() {
        if (this.data.regNickname == '' || this.data.regPassword == '' || this.data.regPhone == '') {
            Dialog.alert({
                title: '错误',
                message: "手机号密码或昵称未输入",
            })
        } else {
            request({
                url: "/register",
                method: "POST",
                data: {
                    appkey: app.globalData.appkey,
                    nickName: this.data.regNickname,
                    password: this.data.regPassword,
                    phone: this.data.regPhone
                }
            }).then(res => {
                //这里不用dialog,因为会被注册页面盖住
                console.log(res)
                //注册成功
                if (res.data.code == 100) {
                    Toast.success(res.data.msg);
                    this.onClose()
                } else {
                    //注册失败
                    Toast.fail(res.data.msg);
                }
            })
        }
    },


    onLoad: function (options) {

    },

    onShow: function () {

    },


    goHome() {
        //wx.navigateTo不能跳转到tabbar页面
        wx.switchTab({
            url: '/pages/index/index',
        })
    }

})