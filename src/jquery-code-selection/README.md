# 编码表

## 基本使用

```
<link href="codeSelection.css" rel="stylesheet">

<div id="demo"></div>

<script src="/js/jquery.min.js"></script>
<script type="text/javascript" src="jquery-code-selection.js"></script>
<script>
    var options = {
        json:'test.json',
        isMultiple :true,// 是否是多选
        type: '1',// 编码表类型1：表格 2：列表  3：树
        selectIds: '1,2,22,24,3,4',//初始化的id
        onSelect: function(value) {
        }
    }

    $('#demo').codeSelection(options);

    // 获取选中的数据
    $("#getData").click(function(){
        alert(JSON.stringify($('#demo').codeSelection('getSelectedData')));
    })

    // 获取选中的id
    $("#getSelectedIds").click(function(){
        alert($('#demo').codeSelection('getSelectedIds'));
    })
</script>
```

## 参数
参数名         |       说明      |       类型      |       默认值
------       |    -----      |     ---     |   ---
isMultiple     |   是否是多选     |   Boolean      |   true,多选
type           |   编码表类型1：表格 2：列表  3：树    |   Number      |   1表格
url            |   数据地址      |   String      |   url,data,json任选一
data           |   数组数据      |   Array      |   url,data,json任选一
json           |   json格式数据    |   Object      |   url,data,json任选一
selectIds      |   初始化的id，字符串逗号分隔    |   String      |   ''


## 事件
事件名     |       说明      |       回调参数
------   |    -----     |     ---


## 方法
```
$(selector).codeSelection(functionName)
```
方法名     |       说明      |       返回数据
------   |    -----     |     ---
getSelectedData |   获取选中的数据     |     数据对象数组
getSelectedIds  |   获取选中的数据的id     |     逗号分隔的id字符串
changeType      |   切换类型     |
destroy         |   销毁     |
