/**
 * Created by husida on 2018/4/4.
 *
 *
 */
(function ($) {
    var defaults = {
        isMultiple :true,// 是否是多选
        type: '1',// 编码表类型1：表格 2：列表  3：树
        url: '',// 数据地址
        data: [],// 数组数据
        json: '',// json
        selectIds: ''// 初始化的id，字符串逗号分隔
    };


    var allowedMethods = [
        'changeType',
        'getSelectedData',
        'getSelectedIds',
        'destroy'
    ];

    var container = '<div class="cs-container">' +
        '<div class="cs-result cs-result1">' +
        '<p class="cs-count"></p>' +
        '<ul>' +
        '</ul>' +
        '<i class="cs-expand down"></i>' +
        '</div>' +
        '<div class="cs-drop">' +
        '<div class="cs-result cs-result2">' +
        '<ul>' +
        '</ul>' +
        '</div>' +
        '<div class="cs-search">' +
        '<input id="key" type="text" name="key" placeholder="请输入中文、拼音或者编码" />' +
        '</div>' +
        '<div class="cs-table">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>编码</th>' +
        '<th>名称</th>' +
        '<th>拼音</th>' +
        '<th>上级编码</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';

    var CodeSelection = function (el, options) {
        this.setting = $.extend({},defaults,options);
        this.el = el;
        this.$el = $(el);
        this.oriDatalist = [];// 原始数据
        this.dataList = [];// 处理过的数据
        this.selectedData = [];// 选中的数据

        this.init();
    };

    // 根据数组下标删除数据
    Array.prototype.delByIndex=function(index){
        if(isNaN(index)||index>=this.length){
            return false;
        }
        for(var i=0,n=0;i<this.length;i++){
            if(this[i]!=this[index]){
                this[n++]=this[i];
            }
        }
        this.length-=1;
    };

    // 根据数组唯一属性删除数据
    Array.prototype.delByProperty=function(name, value){
        if(this.length<=0 || !this[0][name]) {
            return false;
        }

        for(var i=0,n=0;i<this.length;i++){
            if(this[i][name]!= value){
                this[n++]=this[i];
            }
        }
        this.length-=1;
    };

    // 初始化
    CodeSelection.prototype.init = function (){
        var _this = this;
        _this.createContiner();
        _this.initStyle();
        _this.initEvent();
        _this.getData(function () {
            _this.initCSDom();
        })
    };

    // 添加html内容
    CodeSelection.prototype.createContiner = function () {
        this.$el.html(container);
    };

    // 获取数据
    CodeSelection.prototype.getData = function (cb) {
        var csThis = this;
        if ($.type(csThis.setting.json)=='string' && csThis.setting.json.indexOf('.json')!=-1) {
            $.getJSON(csThis.setting.json,function(data){
                csThis.dataList = data.data;
                csThis.oriDatalist = data.data;
                csThis.idsToDatas();

                cb();
            });
        } else if ($.type(csThis.setting.url)=='string' && $.type(csThis.setting.url)!= ''){

        } else if($.type(csThis.data)=='array') {
            csThis.dataList = csThis.data;
            csThis.oriDatalist = csThis.data;
            csThis.idsToDatas();
            cb();
        }

    };

    // 设置样式
    CodeSelection.prototype.initStyle = function () {
        if(this.setting.isMultiple) {
            this.$el.find('.cs-result2').show();
        } else {
            this.$el.find('.cs-result2').hide();
        }
    };

    // 初始化事件
    CodeSelection.prototype.initEvent = function () {
        var $csEl =this.$el;
        var csThis = this;

        // 点击下拉框
        $csEl.find('.cs-result1,.cs-expand').on('click', function() {
            if($csEl.find('.cs-container ').hasClass('cs-container-active')) {
                $csEl.find('.cs-container ').removeClass('cs-container-active');
            } else {
                $csEl.find('.cs-container ').addClass('cs-container-active');
                var top = $csEl.find('.cs-table .cs-select:first').position().top;
                $csEl.find('.cs-table').scrollTop(top);
            }
        });

        // 移除选中结果
        $csEl.find('.cs-result').on('click', '.icon-del', function() {
            var _this = $(this);
            var index = $(this).parents('li').index();
            setTimeout(function() {
                $csEl.find('.cs-table tbody tr[data-id="'+csThis.selectedData[index].id+'"]').removeClass('cs-select');
                csThis.selectedData.delByIndex(index);

                csThis.setResultDom();
            },50);

        });

        // 表格行点击事件
        $csEl.find('.cs-table tbody').on('click','tr',function(){
            var index = $(this).index();
            if(csThis.setting.isMultiple){
                if($(this).hasClass('cs-select')) {
                    $(this).removeClass('cs-select');
                    csThis.selectedData.delByProperty('id', $(this).data('id'));
                } else {
                    $(this).addClass('cs-select');
                    csThis.selectedData.push(csThis.dataList[index])
                }
            } else {
                csThis.selectedData = [];
                csThis.selectedData.push(csThis.dataList[index]);
                $csEl.find('.cs-table tbody tr').removeClass('cs-select');
                $(this).addClass('cs-select');
            }
            csThis.setResultDom();

            csThis.trigger('onSelect',csThis.dataList[index]);

        });


        // 显示、隐藏下拉内容
        $(document).click(function(e) {

            if( $(e.target).hasClass('cs-result1')){

            } else if($(e.target).hasClass('cs-container')){
                if ($(e.target).hasClass('cs-container-active')) {
                    $(e.target).removeClass('cs-container-active');
                } else {
                    $(e.target).addClass('cs-container-active');
                }
            } else if ($(e.target).parents('.cs-container').length>0){
                $(e.target).parents('.cs-container').addClass('cs-container-active');
            } else {
                $csEl.find('.cs-container').removeClass('cs-container-active');

            }
        });

        // 搜索
        $csEl.find('.cs-search input').on('input propertychange',function() {
            var value = $(this).val();
            csThis.dataFilter(value);
        });

    };

    // 通过id获取对应的数据数组（初始化使用）
    CodeSelection.prototype.idsToDatas = function () {
        var idsArr = this.setting.selectIds.split(',');
        for(var i = 0;i<this.dataList.length;i++) {
            if ($.inArray(this.dataList[i].id, idsArr) != -1) {
                this.selectedData.push(this.dataList[i]);
            }
        }
    }

    // 渲染选中结果内容
    CodeSelection.prototype.setResultDom = function(){
        var html = '';
        if(this.setting.isMultiple) {
            for(var i=0;i<this.selectedData.length; i++) {
                html +='<li><a class="cs-text" data-id="'+this.selectedData[i].id+'">'+this.selectedData[i].text+'<span class="icon-del"></span></a></li>'
            }
        } else {
            if(this.selectedData.length>0) {
                html +='<li><a class="cs-text" data-id="'+this.selectedData[0].id+'">'+this.selectedData[0].text+'<span class="icon-del"></span></a></li>'
            }
        }


        this.appendResult(html);

    };

    // 添加结果
    CodeSelection.prototype.appendResult = function (html) {
        if(this.setting.isMultiple) {
            this.$el.find('.cs-result2 ul').html(html);
            console.log(this.$el.find('.cs-result2').height());
            if(this.$el.find('.cs-result2').height()>45) {
                this.$el.find('.cs-result1 .cs-count').text('已选中'+this.selectedData.length + '条编码');
                this.$el.find('.cs-result1 ul').html('');
                this.$el.find('.cs-result2').show();
            } else {
                this.$el.find('.cs-result1 .cs-count').text('');
                this.$el.find('.cs-result1 ul').html(html);
                this.$el.find('.cs-result2').hide();
            }

        } else {
            this.$el.find('.cs-result1 ul').html(html);
        }
    }


    // 搜索时筛选数据
    CodeSelection.prototype.dataFilter = function (value) {
        if(!value || value=='') {
            this.dataList = this.oriDatalist;
        } else {
            var curVal = {};
            this.dataList = [];
            for(var i=0; i < this.oriDatalist.length; i++) {
                curVal = this.oriDatalist[i];
                if(curVal.code.indexOf(value) != -1 || curVal.text.indexOf(value) != -1 || curVal.pinyin.indexOf(value) != -1) {
                    this.dataList.push(this.oriDatalist[i]);
                }
            }
        }
        this.initCSDom();
    };


    // 渲染编码表内容
    CodeSelection.prototype.initCSDom = function () {
        var $csEl = this.$el;
        if(this.setting.type=='1') {
            $csEl.find('.cs-table thead').show();
        } else if(this.setting.type == '2'){
            $csEl.find('.cs-table thead').hide();
        }

        var html = '';
        for(var i = 0;i<this.dataList.length;i++) {
            html += '<tr data-id="'+this.dataList[i].id+'">';
            if(this.setting.type=='1') {
                html += '<td>'+this.dataList[i].code+'</td>' +
                '<td>'+this.dataList[i].text+'</td>' +
                '<td>'+this.dataList[i].pinyin+'</td>' +
                '<td>'+this.dataList[i].parentCode+'</td>' +
                '</tr>';
            } else if(this.setting.type=='2') {
                html += '<td>'+this.dataList[i].text+'</td>' +
                '</tr>';
            }

        }
        $csEl.find('.cs-table tbody').html(html);
        if(this.selectedData.length>0) {
            this.initTableSelect();
            this.setResultDom();
        }
    };

    // 初始化表格选中行
    CodeSelection.prototype.initTableSelect = function () {
        this.$el.find('.cs-table tbody tr').removeClass('cs-select');
        if(this.setting.isMultiple) {
            for(var i=0;i<this.selectedData.length; i++) {
                this.$el.find('.cs-table tbody tr[data-id="'+this.selectedData[i].id+'"]').addClass('cs-select');
            }
        } else {
            if(this.selectedData.length>0) {
                this.$el.find('.cs-table tbody tr[data-id="'+this.selectedData[0].id+'"]').addClass('cs-select');
            }

        }

    };

    // 触发回调
    CodeSelection.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);
        this.setting[name].apply(this.options, args);
    };

    // 切换类型
    CodeSelection.prototype.changeType = function (type) {
        if(type!='1' && type!='2' && type!='3') {
            throw new Error("type is unknow");
        }

        this.setting.type = type;
        this.initCSDom();
    }

    // 获取选中数据
    CodeSelection.prototype.getSelectedData = function () {
      return this.selectedData;
    };

    // 获取选中数据的id
    CodeSelection.prototype.getSelectedIds = function () {
        var ids = '';
        for(var i=0;i<this.selectedData.length;i++ ) {
            if (i == 0){
                ids += this.selectedData[i].id;
            } else {
                ids +=','+ this.selectedData[i].id;
            }
        }
      return ids;
    };


    $.fn.codeSelection = function (options) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this);

            if (options === 'destroy') {
                $this.removeData('plugin_codeSelection');
            }

            var data = $this.data('plugin_codeSelection');

            if (typeof options === 'string') {
                if ($.inArray(options, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + options);
                }

                if (!data) {
                    return;
                }

                value = data[options].apply(data, args);
            }

            if (!data) {
                $this.data('plugin_codeSelection', (data = new CodeSelection(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

})(jQuery);