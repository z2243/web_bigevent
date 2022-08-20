$(function(){
    //拿到list页面传过来的id
    let id = getUrlParam('id')

    let layer = layui.layer
    let form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类失败！')
                }
                // 使用模板引擎
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //给选择封面按钮绑定点击事件
    $('#btnChooseImg').click(function(){
        $('#coverFile').click()
    })

    //选择图片之后如果点击了确定就要将图片上传
    $('#coverFile').click(function(e){
        //可以拿到上传的file
        let files = e.target.files
        if(files.length === 0){
            return
        }
        //根据文件创建对应的URL地址
        let newImgUrl = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //定义文章发布状态
    let art_state = '已发布'
    //给存为草稿按钮绑定点击事件
    $('#btnSave2').click(function(){
        art_state = '草稿'
    })

    //为表单提交绑定监听事件 发请求
    $('#form-pub').submit(function(e){
        e.preventDefault()
        //1.拿到表单中各个框的数据
        //this指表单，【0】可以拿到DOM对象
        let formData = new FormData($(this)[0])
        //这个formData里的数据都是key-value的形式存在在数组里

        //2.将文章的发布状态也存到fd中,也要以key-value形式存进去
        formData.append('state',art_state)

        //查看数据
        // formData.forEach(function(v,k){
        //     console.log(k,v)
        // })

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存储到formData中
                formData.append('cover_img',blob)
                publishArt(formData)
            })
    })
    //另外定义一个发布文章的方法
    function publishArt(data1){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:data1,
            //如果是提交FormData格式的数据 要添加以下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //跳转页面到文章列表
                location.href = '../article/art_list.html'
            }
        })
    }

    // 用文章旧数据渲染页面
    if (id) {
        $.ajax({
            method: 'GET',
            url: `/my/article/${id}`,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }
                layui.form.val('formPublish', res.data)
                $image.cropper('destroy').attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img).cropper(options);
            }
        })
    }

    //获取url中的参数
    function getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

})