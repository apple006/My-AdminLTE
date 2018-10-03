作为强迫症的我，选择了 [AdminLTE](https://github.com/almasaeed2010/AdminLTE) 这个 25K 的开源后台模板，以此获得长期更新支持。

但是 AdminLTE 原始版本还是不能满足我的需求，所以我对它做了如下修改：

### 1. 新增标签页

1.1 新增 build/js/ContentTabs.js，并在 Gruntfile.js 的 grunt.initConfig.concat.dist.src 中新增 `'build/js/ContentTabs.js'`；

1.2 新增 build/less/content-tabs.less，并在 AdminLTE.less 中 `@import "content-tabs";`；

1.3 新增 build/less/skins/skin-content-tabs.less，并在 _all-skins.less 中 `@import "skin-content-tabs.less";`。

### 2. Iframe 模式

2.1 新增 index_iframe.html，删除 Content Header 和 Main content，新增 Content Tab 和 Iframe，并给 body 元素新增 class = "fixed"；

2.2 新增 main.html，修改内容，设置为 Iframe src，作为首页。

### 3. Ajax 模式

…………
