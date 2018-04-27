# 分页

## 基本使用

```
<link rel="stylesheet" href="jquery-pagination.css"/>

<div id="pagination"></div>

<script src="/crdp/js/jquery.min.js"></script>
<script type="text/javascript" src="jquery-pagination.js"></script>
<script>
    var option = {
        total: 108,  // 总条目数
        pageSize: 8,   // 每页显示条数
        visiblePages: 10,   // 最多显示的页数
        onPageChange: function (value) { // 切换页码的触发回调
            console.log('当前是第' + value + '页');
        }
    };

    $('#pagination').pagination(option);
</script>
```

## 参数
参数名         |       说明      |       类型      |       默认值
------       |    -----      |     ---     |   ---
total          |   总条目数     |   Number      |   0
pageSize       |   每页显示条数    |   Number      |   0
visiblePages   |   最多显示的页数    |   Number      |   106
currentPage    |   总条目数      |   Number      |   0
total          |   当前的页码    |   Number      |   1
showPreNext    |   是否显示上一页，下一页    |   Boolean      |   true
showJump       |   是否显示跳转    |   Boolean      |   true
activeColor    |   选中颜色，   |   String      |   默认绿色
activeCss      |   选中样式，会覆盖activeColor    |   Object      |   {}
hoverCss       |   hover样式，默认activeColor颜色字体    |   Object      |   {}


## 事件
事件名     |       说明      |       回调参数
------   |    -----     |     ---     |   ---
onPageChange  |   切换页码的触发回调    |   value 当前页码


## 方法
```
$(selector).pagination(functionName)
```
方法名     |       说明      |       返回数据
------   |    -----     |     ---
destroy  |   销毁     |