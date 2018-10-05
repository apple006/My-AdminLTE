/**
 * 和 AdminLTE 配合使用
 *
 * @author  https://github.com/duanluan
 */
$(function () {
    var State = {
        active: "active",
        pin: "pin"
    };

    var Selector = {
        menu: ".sidebar-menu li",
        openMenu: ".sidebar-menu li.treeview.menu-open",
        contentTabs: ".content-tabs",
        contentIframe: ".content-iframe",
        iframe: ".content-iframe iframe",
        pinIframe: ".content-iframe iframe.pin",
        pageTabs: ".page-tabs",
        pageTabContent: ".page-tabs-content",
        pageTab: ".page-tab",
        pageTabClose: ".page-tab-close",
        activePageTab: ".page-tab.active",
        pinPageTab: ".page-tab.pin",
        tabLeft: ".page-tabs-left",
        tabRight: ".page-tabs-right",
        tabRefresh: ".page-tabs-refresh"
    };


    // 计算元素集合的总宽度
    function calSumWidth(elements) {
        var width = 0;
        $(elements).each(function () {
            width += $(this).outerWidth(true);
        });
        return width;
    }

    // 滚动到选中标签页
    function scrollToTab(element) {
        var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(Selector.contentTabs).children().not(Selector.pageTabs));
        //可视区域tab宽度
        var visibleWidth = $(Selector.contentTabs).outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(Selector.pageTabContent).outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
            if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                scrollVal = marginLeftVal;
                var tabElement = element;
                while ((scrollVal - $(tabElement).outerWidth()) > ($(Selector.pageTabContent).outerWidth() - visibleWidth)) {
                    scrollVal -= $(tabElement).prev().outerWidth();
                    tabElement = $(tabElement).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
            scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
        }
        $(Selector.pageTabContent).animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    }

    // 选中菜单
    function selectMenu(tabUrl) {
        // 关闭打开的顶级菜单
        $(Selector.openMenu).each(function () {
            var $this = $(this),
                treeviewMenu = $this.find("ul.treeview-menu");

            // 如果需要选中的标签页不在菜单中
            if (treeviewMenu.css("display") == "block" && treeviewMenu.find("li a[href='" + tabUrl + "']").length == 0) {
                treeviewMenu.slideUp(500);
                return false;
            }
        });
        // 取消选中的菜单
        $(Selector.menu).removeClass("menu-open").removeClass(State.active);
        // 选中标签页对应的菜单
        var parentElement;
        $(Selector.menu).each(function () {
            var $this = $(this),
                menuUrl = $this.find("a").attr("href");

            if (menuUrl == tabUrl) {
                $this.addClass(State.active);
                parentElement = $this;
                return false;
            }
        });
        while (true) {
            // 菜单顶层退出循环
            if (parentElement.hasClass("sidebar-menu")) {
                break;
            }

            parentElement = parentElement.parent();
            var tagName = parentElement[0].tagName.toLowerCase();

            if (tagName == "li") {
                parentElement.addClass(State.active);
                parentElement.addClass("menu-open");
            }
            if (tagName == "ul" && parentElement.css("display") == "none") {
                parentElement.slideDown(500);
            }
        }
    }

    // 点击菜单
    $(Selector.menu).on("click", function () {
        // 获取菜单数据
        var $this = $(this),
            menu = $this.find("a"),
            menuUrl = menu.attr("href"),
            menuName = $.trim(menu.text()),
            menuIcon = menu.find("i").attr("class");
        if (menuIcon == undefined || menuIcon == "fa fa-circle-o") menuIcon = "";

        // url 是否正确
        if (menuUrl == undefined || $.trim(menuUrl).length == 0 || menuUrl == "#") return true;

        var pageTab = $(Selector.pageTab + "[data-url='" + menuUrl + "']");
        if (pageTab.length > 0) {
            // 不是当前标签页
            if (!pageTab.hasClass(State.active)) {
                // 选中标签页
                pageTab.addClass(State.active).siblings(Selector.pageTab).removeClass(State.active);
                // 显示标签页对应的 iframe
                $(Selector.iframe + "[src='" + menuUrl + "']").show().siblings(Selector.iframe).hide();
            }
        } else {
            // 清除所有标签页选中
            $(Selector.pageTab).removeClass(State.active);
            // 添加标签页
            $(Selector.pageTabContent).append('<a href="javascript:;" class="page-tab active" data-url="' + menuUrl + '"><i class="' + menuIcon + '"></i> ' + menuName + '&nbsp;&nbsp;<i class="page-tab-close fa fa-times-circle"></i></a>');
            // 隐藏所有 iframe 并添加选项卡对应的 iframe
            $(Selector.iframe).hide();
            $(Selector.contentIframe).append('<iframe width="100%" height="100%" frameborder="0" src="' + menuUrl + '" data-url="' + menuUrl + '" seamless></iframe>');
        }

        scrollToTab($(Selector.activePageTab));

        // 激活菜单
        $(Selector.menu).removeClass(State.active);
        $this.addClass(State.active);
        var parentElement = $this;
        while (true) {
            // 菜单顶层退出循环
            if (parentElement.hasClass("sidebar-menu")) {
                break;
            }

            parentElement = parentElement.parent();
            if (parentElement[0].tagName.toLowerCase() == "li") {
                parentElement.addClass(State.active);
                parentElement.addClass("menu-open");
            }
        }

        return true;
    });

    // 点击标签页
    $(Selector.pageTabs).on("click", Selector.pageTab, function () {
        var $this = $(this);

        if (!$this.hasClass(State.active)) {
            var tabUrl = $this.data("url");

            // 选中标签页
            $this.addClass(State.active).siblings(Selector.pageTab).removeClass(State.active);
            // 显示标签页对应的 iframe
            $(Selector.iframe + "[src='" + tabUrl + "']").show().siblings(Selector.iframe).hide();

            scrollToTab($(Selector.activePageTab));
            selectMenu(tabUrl);
        }
    });

    // 关闭标签页
    $(Selector.pageTabs).on("click", Selector.pageTabClose, function () {
        var $this = $(this),
            $pageTab = $this.parents(Selector.pageTab),
            closeTabUrl = $pageTab.data("url")/*,
            currentWidth = $pageTab.width()*/;

        // 标签页选中状态
        if ($pageTab.hasClass(State.active)) {
            var $prevPageTab = $pageTab.prev(),
                prevPageTabUrl = $prevPageTab.data("url");
            // 选中上一个标签页
            $prevPageTab.addClass(State.active);
            // 关闭当前标签页
            $pageTab.remove();

            $(Selector.iframe).each(function () {
                var $this = $(this),
                    iframeUrl = $this.attr("src");

                // 显示上一个标签页的 iframe
                if (iframeUrl == prevPageTabUrl) {
                    $this.show().siblings(Selector.iframe).hide();
                }
                // 关闭当前标签页的 iframe
                if (iframeUrl == closeTabUrl) {
                    $this.remove();
                }
            });

            // var marginLeftVal = parseInt($(Selector.pageTabContent).css('margin-left'));
            // if (marginLeftVal < 0) {
            //     $(Selector.pageTabContent).animate({
            //         marginLeft: (marginLeftVal + currentWidth) + 'px'
            //     }, "fast");
            // }
        }
        // 标签页未选中
        else {
            // 移除当前标签页
            $pageTab.remove();
            // 移除标签页对应的 iframe
            $(Selector.iframe + "[src='" + $this.attr("src") + "']").remove();
        }

        scrollToTab($(Selector.activePageTab));
        selectMenu($(Selector.activePageTab).data("url"));

        return false;
    });

    // 左移按扭
    $(Selector.tabLeft).on("click", function () {
        var marginLeftVal = Math.abs(parseInt($(Selector.pageTabContent).css('margin-left')));
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(Selector.contentTabs).children().not(Selector.pageTabs));
        //可视区域tab宽度
        var visibleWidth = $(Selector.contentTabs).outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(Selector.pageTabContent).width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".page-tab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).prev();
                }
                scrollVal = calSumWidth($(tabElement).prevAll());
            }
        }
        $(Selector.pageTabContent).animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    });

    // 右移按扭
    $(Selector.tabRight).on("click", function () {
        var marginLeftVal = Math.abs(parseInt($(Selector.pageTabContent).css('margin-left')));
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(Selector.contentTabs).children().not(Selector.pageTabs));
        //可视区域tab宽度
        var visibleWidth = $(Selector.contentTabs).outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(Selector.pageTabContent).width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".page-tab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            scrollVal = calSumWidth($(tabElement).prevAll());
            if (scrollVal > 0) {
                $(Selector.pageTabContent).animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        }
    });

    // 标签页右键菜单
    var pageTabMenu = new BootstrapMenu(Selector.pageTab, {
        fetchElementData: function ($pageTab) {
            return $pageTab;
        },
        actions: {
            refresh: {
                name: "刷新标签页",
                onClick: function ($pageTab) {
                    var url = $pageTab.data("url");

                    $(Selector.iframe + "[src='" + url + "']").attr("src", url);
                }
            },
            closeOther: {
                name: "关闭其它标签页",
                isShown: function () {
                    return $(Selector.pageTab).not(Selector.pinPageTab).length > 0;
                },
                onClick: function ($pageTab) {
                    var url = $pageTab.data("url");

                    // 选中标签页
                    $pageTab.addClass(State.active).siblings(Selector.pageTab).not(Selector.pinPageTab).remove();
                    // 显示标签页对应的 iframe
                    $(Selector.iframe + "[src='" + url + "']").show().siblings(Selector.iframe).remove();

                    scrollToTab($(Selector.activePageTab));
                    selectMenu(url);
                }
            },
            closeAll: {
                name: "关闭全部标签页",
                isShown: function () {
                    return $(Selector.pageTab).not(Selector.pinPageTab).length > 0;
                },
                onClick: function () {
                    // 选中标签页
                    $(Selector.pageTab).not(Selector.pinPageTab).remove();
                    var lastPinPageTab = $(Selector.pinPageTab).last(),
                        lastPinPageTabUrl = lastPinPageTab.data("url");
                    lastPinPageTab.last().addClass(State.active);
                    // 显示标签页对应的 iframe
                    $(Selector.iframe + "[src='" + lastPinPageTabUrl + "']").show().siblings(Selector.iframe).not(Selector.pinPageTab).remove();

                    scrollToTab($(Selector.pinPageTab));
                    selectMenu(lastPinPageTabUrl);
                }
            }
        }
    });
});
