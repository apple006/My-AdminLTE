作为强迫症的我，选择了 [AdminLTE](https://github.com/almasaeed2010/AdminLTE) 这个 25K 的开源后台模板，以此获得长期更新支持。

但是 AdminLTE 原始版本还是不能满足我的需求，所以我对它做了如下修改：

### 1. 添加标签栏

* 点击菜单，如果标签页已存在选中标签页，不存在新增并标签页；
* 点击标签页，选中菜单；
* 关闭标签页，标签页未选中就删除标签页，标签页选中就选中上一个标签页；
* 向左向右滚动标签栏；
* 右键菜单：刷新标签页、关闭其它标签页、关闭所有标签页；
* 操作后标签栏滚动到选中标签页的位置。

### 2. Iframe 模式

页面固定高度，Footer 固定在底部，iframe 的新增、显示与删除对应标签页的操作。

### 3. Ajax 模式

…………
