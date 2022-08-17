$(function(){
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    //初始化用户基本信息
    initUserInfo()
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)
                //我们通过val（）方法快速赋值到表单中
                form.val('formUserInfo',res.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').click(function(e){
        e.preventDefault()
        initUserInfo()
    })

    //发送请求提交表单更改后的信息  并重新渲染父页面
    $('.layui-form').submit(function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                window.parent.getUserInfo()
            }
        })
    })
})