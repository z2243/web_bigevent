$(function(){
    // 点击去注册
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })
    
    //自定义密码的正则验证
    //先拿到form对象
    let form = layui.form
    //调用他的verify方法
    form.verify({
        //定义一个名字叫pwd的验证
        //第一个是正则表达式 第二个是提示语
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        //value是自己表单的值
        repwd:function(value){
            //拿到密码框中的内容
            let pwd1 = $('.reg-box [name=password]').val()
            if(value !== pwd1){
                return '两次密码不一致！'
            }
        }
    })

    //我们要用layui的弹出层 所以要导入layer对象
    let layer = layui.layer
    //表单提交时发请求给后端
    //监听注册表单中的提交事件
    $('#form-reg').on('submit',function(e){
        e.preventDefault()
        //发送ajax请求
        $.post(
            'api/reguser',{username:$('#form-reg [name=username]').val(),password:$('#form-reg [name=password]').val()},function(res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功!请登录!')
            //切换到登录界面
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#login_form').submit(function(e){
        e.preventDefault()
        //发送ajax请求
        $.ajax({
            url:'/api/login',
            method:'POST',
            //快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                console.log(res)
                //登录成功后会返回一个token，用来之后的网页的登陆验证,我们就需要把这个token的值存到localStorage里去
                localStorage.setItem('token',res.token)
                //跳转到后台主页
                location.href='./index.html'
            }
        })
    })
})