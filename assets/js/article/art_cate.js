$(function(){
    initArtCateList()

    //获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layui.layer.msg('获取文章分类失败！')
                }
                // 使用模板引擎
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //拿到弹出对象
    let layer = layui.layer

    //拿到添加文章的弹窗的下标index
    let addIndex = null
    //给添加类别按钮绑定事件
    $('#btnAddCate').click(function(){
        //弹出对象的open方法可以往弹出层里加很多东西
        addIndex = layer.open({
            //去掉确定按钮
            type:1,
            //规定弹窗大小
            area:['500px','250px'],
            //规定弹窗标题
            title:'添加文章分类',
            //内容
            content:$('#dialog-add').html()
        })
    })

    //通过代理的方式绑定确认添加的监听事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('新增文章类别失败！')
                }
                layer.close(openIndex)
                layer.msg('新增文章类别成功！')
                initArtCateList()
            }
        })
    })

    //拿到编辑文章的弹窗的下标index
    let editIndex = null

    //通过tbody代理方式绑定删除的监听点击事件
    $('tbody').on('click','#edit',function(){
        editIndex = layer.open({
            //去掉确定按钮
            type:1,
            //规定弹窗大小
            area:['500px','250px'],
            //规定弹窗标题
            title:'修改文章分类',
            //内容
            content:$('#dialog-edit').html()
        })

        //数据回填
        //拿到不同编辑框所在的id值
        let id = $(this).attr('data-id')
        //根据id发送ajax请求
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
                //res是我们拿到的返回内容 data里有我们要的数据 需要回填到表单里
                layui.form.val('form-edit',res.data)
            }
        })
    })

    //给编辑弹窗里的form表单绑定监听submit事件 向后端发请求
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更改文章类别失败！')
                }
                layer.close(editIndex)
                layer.msg('更改文章类别成功！')
                initArtCateList()
            }
        })
    })

    //通过tbody代理方式绑定编辑的监听点击事件
    $('tbody').on('click','#delete',function(){
        //拿到不同删除框所在的id值
        let id = $(this).attr('data-id')
        layer.confirm('确认删除吗？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章类别失败！')
                    }
                    layer.msg('删除文章类别成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})