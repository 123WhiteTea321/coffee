var baseUrl="http://www.kangliuyong.com:10002"

var request=(options)=>{
  // Promise函数是解决异步回调的问题，简而言之就是别的js引入该函数后可以使用.then(res=>{})
  return new Promise((resolve,reject)=>{
    return wx.request({
      //下面这些参数是request函数里的固定写法还是后台/接口文档给予的？
      url: baseUrl+options.url,
      method:options.method,
      data:options.data||{},
      header:options.header||{
        'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success:resolve,
      fail:reject

    })
  })
 
}

export default request