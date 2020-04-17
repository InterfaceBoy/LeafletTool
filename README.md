# grid

北大网格底层架构整改

Feature:

- 底层基于 vuecli3
- 基础容器布局组件重写 
- 代码规范约束
- 提供接口 Mock 以及 Api 从组件中抽离
- ...

## 目录结构

```
.
├── README.md
├── babel.config.js                 # babel
├── yarn.lock                       # package🔐
├── package.json                    # package管理
├── postcss.config.js               # postcss配置
├── public
│   ├── favicon.ico                 # 系统图标
│   ├── index.html                  # 单页面
│   └── static                      # 本地自定义json
├── src
│   ├── main.js                     # 项目入口文件
│   ├── App.vue                     # Vue根组件
│   ├── api                         # 后端api统一管理
│   ├── assets                      # 静态文件
│   ├── components                  # 通用组件
│   ├── mock                        # mockjs
│   ├── plugins                     # 插件管理
│   ├── router                      # 路由表管理
│   ├── store                       # vuex
│   ├── styles                      # 全局scss变量、全局样式
│   ├── utils                       # 通用工具函数
│   └── views                       # 页面 
└── vue.config.js                   # 工程配置文件
```

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Lints and fixes files

```
yarn run lint
```

