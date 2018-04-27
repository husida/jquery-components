/**
 * Created by Administrator on 2018/4/23 0023.
 */


;(function ($) {

    var Pagination = function (el, option) {
        this.$el = $(el);
        this.option = $.extend({}, this.defaultOption, option);
        this.init();
    };

    // 参数
    Pagination.prototype.defaultOption = {
        total: 0,  // 总条目数
        pageSize: 0,   // 每页显示条数
        totalPages: 0,
        visiblePages: 10,   // 最多显示的页数
        currentPage: 1, // 当前的页码
        showPreNext: true,  // 显示上一页，下一页
        showJump: true, // 显示跳转
        activeColor: '',// 主颜色，默认绿色
        activeCss:{},  // 主样式，会覆盖activeColor
        hoverCss:{},    // hover样式，默认activeColor颜色字体
        onPageChange: function (value) { // 切换页码的触发回调

        }
    };

    Pagination.prototype.init = function () {
        this.validateOption();
        this.initStyle();
        this.initHtml();
        this.initEvent();
    };

    // 验证option
    Pagination.prototype.validateOption = function () {
        if (this.option.total && this.option.pageSize) {
            this.option.totalPages = Math.ceil(this.option.total / this.option.pageSize);
        }

        if (this.option.currentPage < 0 || this.option.currentPage > this.option.totalPages) {
            throw new Error('currentPage is illegal');
        }
    };


    Pagination.prototype.initHtml = function () {
        this.initContainer();
        this.initPagerHtml();
    };

    Pagination.prototype.initContainer = function () {
        this.$el.html('<div class="jq-pagination"><ul class="pager"></ul></div>');

        if(this.option.showPreNext) {
           this.$el.find('.jq-pagination').prepend('<button type="button" class="btn btn-prev"><i class="iconfont icon-left"></i></button>');
           this.$el.find('.jq-pagination').append('<button type="button" disabled="disabled" class="btn btn-next"><i class="iconfont icon-right"></i></button>');
        }

        if (this.option.showJump) {
            this.$el.find('.jq-pagination').append('<span class="pager-jump">前往<input type="number" value="'+this.option.currentPage+'">页</span>');
        }
    };

    Pagination.prototype.initPagerHtml = function () {

        var pageHtml = '';
        var middlePage = Math.floor(this.option.visiblePages / 2);
        var page;
        var i;

        // 上一页，下一页按钮
        if (this.option.currentPage == 1) {
            this.$el.find('.btn-prev').attr('disabled', true);
        } else {
            this.$el.find('.btn-prev').removeAttr('disabled');
        }

        if (this.option.currentPage == this.option.totalPages) {
            this.$el.find('.btn-next').attr('disabled', true);
        } else {
            this.$el.find('.btn-next').removeAttr('disabled');
        }

        // 页数
        if (this.option.currentPage <= middlePage) {
            for (i = 1; i <= this.option.visiblePages; i++) {
                if (i < this.option.visiblePages - 1) {
                    if (i == this.option.currentPage) {
                        pageHtml += '<li class="number active">' + i + '</li>';
                    } else {
                        pageHtml += '<li class="number">' + i + '</li>';
                    }

                } else if (i == this.option.visiblePages - 1) {
                    pageHtml += '<li class="number"><i class="iconfont icon-more"></i></li>';
                } else {
                    pageHtml += '<li class="number">' + this.option.totalPages + '</li>';
                }
            }
        } else if (this.option.currentPage >= this.option.totalPages - middlePage) {
            for (i = 1; i <= this.option.visiblePages; i++) {
                if (i == 1) {
                    pageHtml += '<li class="number">1</li>';
                } else if (i == 2) {
                    pageHtml += '<li class="number"><i class="iconfont icon-more"></i></li>';
                } else {
                    page = this.option.totalPages - (this.option.visiblePages - i);
                    if (page == this.option.currentPage) {
                        pageHtml += '<li class="number active">' + page + '</li>';
                    } else {
                        pageHtml += '<li class="number">' + page + '</li>';
                    }
                }
            }
        } else {
            for (i = 1; i <= this.option.visiblePages; i++) {
                if (i == 1) {
                    pageHtml += '<li class="number">1</li>';
                } else if (i == 2 || i == this.option.visiblePages - 1) {
                    pageHtml += '<li class="number"><i class="iconfont icon-more"></i></li>';
                } else {
                    page = this.option.currentPage - (middlePage - i);
                    if (page == this.option.currentPage) {
                        pageHtml += '<li class="number active">' + page + '</li>';
                    } else {
                        pageHtml += '<li class="number">' + page + '</li>';
                    }
                }
            }
        }

        this.$el.find('.jq-pagination .pager').html(pageHtml);
        this.$el.find('.jq-pagination .pager li.active').css(this.option.activeCss);

    };

    Pagination.prototype.initStyle = function () {
      if (this.option.activeColor != '') {
          this.option.activeCss = {
                "background-color": this.option.activeColor,
                "border-color":this.option.activeColor
          };
          this.option.hoverCss = {
                "color":this.option.activeColor
          }
      }
    };

    Pagination.prototype.initEvent = function () {
        var self = this;
        var $el = this.$el;
        $el.find('.jq-pagination .pager').on('click','li',function () {
            var temp = parseInt($(this).text());
            if (isNaN(temp)) {
                return;
            }
            self.option.currentPage = temp;

            self.initPagerHtml();
            $el.find('.pager-jump input').val(self.option.currentPage);
            self.option.onPageChange(self.option.currentPage);
        });

        $el.find('.jq-pagination .pager').on({
            mouseover:function () {
                $(this).css(self.option.hoverCss);
            },
            mouseout:function () {
                $(this).removeAttr('style');
            }

        },'li:not(.active)');


        $el.find('.btn-prev').click(function () {
            self.option.currentPage--;
            if (self.option.currentPage < 1) {
                self.option.currentPage = 1;
            }
            self.initPagerHtml();
            $el.find('.pager-jump input').val(self.option.currentPage);
            self.option.onPageChange(self.option.currentPage);
        });

        $el.find('.btn-next').click(function () {
            self.option.currentPage++;
            if (self.option.currentPage > self.option.totalPages) {
                self.option.currentPage = self.option.totalPages;
            }
            self.initPagerHtml();
            $el.find('.pager-jump input').val(self.option.currentPage);
            self.option.onPageChange(self.option.currentPage);
        });

        $el.find('.pager-jump input').keydown(function (event) {

            if (event.keyCode == 13) {
                var value = parseInt($(this).val());

                if(value < 1) {
                    $(this).val(1);
                    self.option.currentPage = 1;
                } else if (value > self.option.totalPages){
                    $(this).val(self.option.totalPages);
                    self.option.currentPage = self.option.totalPages;
                } else {
                    self.option.currentPage = value;
                }
                self.option.onPageChange(self.option.currentPage);
                self.initPagerHtml();
            }

        });
    };

    // 调用方法
    Pagination.prototype.callMethod = function (name, param) {
        switch (name) {
            case 'destroy':
                this.removeData('plugin_pagination');
                break;
            default:
                throw new Error('this method is not allow');
        }
    };

    $.fn.pagination = function () {
        var $self = this;
        var args = Array.prototype.slice.call(arguments);
        var value;
        if (typeof args[0] === 'string') {
            var instance = $self.data('plugin_pagination');
            if( !instance ) {
                throw new Error('pagination is no instance')
            } else {
                value = instance.callMethod(args[0],args[1]);
            }
        } else {
            var instance = $self.data('plugin_pagination');
            if( !instance ) {
                $self.data('plugin_pagination', new Pagination(this,args[0]));
            } else {
                instance.initPagerHtml();
            }

            return typeof value === 'undefined' ? this : value;
        }

    }
})(jQuery);
