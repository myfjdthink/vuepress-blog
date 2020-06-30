module.exports = {
  title: "天如",
  description: '做个追求的程序员.',
  dest: 'public',
  head: [
    ['link', {rel: 'icon', href: '/favicon.ico'}],
    ['meta', {name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no'}]
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      {text: 'Home', link: '/', icon: 'reco-home'},
      {text: 'TimeLine', link: '/timeline/', icon: 'reco-date'},
      {text: 'GitHub', link: 'https://github.com/myfjdthink', icon: 'reco-github'}
    ],
    // sidebar: {
    //   '/docs/theme-reco/': [
    //     '',
    //     'theme',
    //     'plugin',
    //     'api'
    //   ]
    // },
    type: 'blog',
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      }
    },
    bgImage: '/background-cover.jpg',
// # heroImageStyle: {
//   #   maxWidth: '600px',
//     #   width: '100%',
//     #   display: block,
//     #   margin: '9rem auto 2rem',
//     #   background: '#fff',
//     #   borderRadius: '1rem',
//     # }
    // friendLink: [
    //   // {
    //   //   title: '午后南杂',
    //   //   desc: 'Enjoy when you can, and endure when you must.',
    //   //   email: '1156743527@qq.com',
    //   //   link: 'https://www.recoluan.com'
    //   // },
    //   {
    //     title: 'vuepress-theme-reco',
    //     desc: 'A simple and beautiful vuepress Blog & Doc theme.',
    //     avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //     link: 'https://vuepress-theme-reco.recoluan.com'
    //   },
    // ],
    logo: '/avatar.jpg',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    sidebar: 'auto',
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'Nick Feng',
    // 作者头像
    authorAvatar: '/avatar.jpg',
    // 备案号
    record: '粤ICP备18051267号',
    // 项目开始时间
    startYear: '2015'
    /**
     * 密钥 (if your blog is private)
     */

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
  markdown: {
    lineNumbers: true
  }
}
