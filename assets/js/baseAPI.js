// 每次调用$.get()/ajax()/post()都会调用ajaxPrefilter这个函数
//在这个函数里 我们可以拿到我们给Ajax提供的配置对象options
$.ajaxPrefilter(function(options){
    // 将根路径和不同的路径进行拼接
    options.url='http://www.liulongbin.top:3007'+options.url
    console.log(options.url)
})
