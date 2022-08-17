$(function(){
    //第一步要定义校验密码的规则
    let form = layui.form
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'] ,
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    //监听表单提交事件 发送ajax请求
    $('.layui-form').submit(function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                //重置表单
                //通过拿到表单的DOM元素 调用reset方法
                $('.layui-form')[0].reset()
            }
        })
    })
})