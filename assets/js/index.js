$(function(){
    //调用getUserInfo
    getUserInfo()
    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登陆吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            //清除token
            localStorage.removeItem('token')
            //跳转到登陆页面
            location.href='/login.html'

            layer.close(index);
          });
    })
})
//获取用户的基本信息
function getUserInfo(){
    //要发送ajax请求 通过get方法拿到信息
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        //headers 就是请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token')||''
        // },
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        //不论成功还是失败，最终都会调用complete里的回调函数
        // complete:function(res){
        //     console.log('执行了回调函数')
        //     console.log(res)
        //     //responseJSON中有返回的数据 可以根据里面的数据判断有没有登陆
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         //清除token
        //         localStorage.removeItem('token')
        //         //跳转到登陆页面
        //         location.href='/login.html'
        //     }

        // }
    })
}
//渲染用户的昵称和头像
function renderAvatar(user){
    //渲染昵称
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    //按需渲染用户头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_piv).show()
        $('.text-avatar').hide()
    }else{
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}