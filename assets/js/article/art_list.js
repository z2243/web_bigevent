$(function(){
    
    //定义一个能够发查询请求的参数对象，里面包含需要提交给服务器的四条数据
    let q = {
        pagenum:1,//页码值 默认是第一页
        pagesize:2,//分页数，默认分页是每页显示2条
        cate_id:'',//文章分类的id
        state:''//文章的发布状态
    }

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;

    initTable()
    initCate()

    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败!')
                }
                // layer.msg('获取文章列表成功!')
                //使用模板引擎渲染返回的数据到页面上
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    

    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败!')
                }
                //使用模板引擎渲染返回的数据到页面上
                let htmlStr = template('tpl-cate',res)
                $('[name=cate-id]').html(htmlStr)
                form.render()
            }
        })
    }

    //给表单提交绑上监听事件
    $('#form-search').submit(function(e){
        e.preventDefault()
        let cate_id = $('[name=cate-id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    //渲染分页的方法
    function renderPage(total){
        laypage.render({
            elem:'pageBox',//分页容器的id
            count:total,//一共有多少条数据
            limit:q.pagesize,//每页放多少条数据
            curr:q.pagenum,//默认先渲染哪一页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump:function(obj,first){
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的条目数，赋值到q这个查询参数对象中的pagesize属性中
                q.pagesize = obj.limit
                if(!first){
                    initTable()
                }
            }
        })
    }

    //给删除按钮绑定点击事件
    $('tbody').on('click','.btnDelArt',function(){
        let id = $(this).attr('data-id')
        layer.confirm('确定删除该文章吗？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    initTable()
                }
            })
            
            layer.close(index);
        });
    })
    
    $('tbody').on('click', '.btnEditArticle', function (e) {
        var id = $(this).attr('data-id')
        location.href = `/article/art_pub.html?id=${id}`
    })
})