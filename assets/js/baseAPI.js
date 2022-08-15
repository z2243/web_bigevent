// 每次调用$.get()/ajax()/post()都会调用ajaxPrefilter这个函数
//在这个函数里 我们可以拿到我们给Ajax提供的配置对象options
$.ajaxPrefilter(function(options){
    // 将根路径和不同的路径进行拼接
    options.url='http://www.liulongbin.top:3007'+options.url
    // console.log(options.url)

    //由于非常多/my/开头的url都需要headers里设置内容
    //所以就在API里统一设置header值
    if(options.url.indexOf('/my/') !== -1){
        options.headers={
            Authorization:localStorage.getItem('token')||''
        }
    }

    //全局统一挂载complete回调函数
    options.complete = function(res){
        console.log('执行了回调函数')
        console.log(res)
        //responseJSON中有返回的数据 可以根据里面的数据判断有没有登陆
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            //清除token
            localStorage.removeItem('token')
            //跳转到登陆页面
            location.href='/login.html'
        }
    }
})
