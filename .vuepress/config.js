const { tocPlugin } = require('@vuepress/plugin-toc')

module.exports = {
  title: "进达的博客",
  description: '',
  dest: 'public',
  plugins: [
    tocPlugin({
      // options
    }),
  ],
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    nav: [
      {text: 'Home', link: '/', icon: 'reco-home'},
      {text: 'TimeLine', link: '/timeline/', icon: 'reco-date'},
      {text: 'GitHub', link: 'https://github.com/myfjdthink', icon: 'reco-github'}
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "logo": "/avatar.jpg",
    "search": true,
    "searchMaxSuggestions": 15,
    "lastUpdated": "Last Updated",
    "author": "Nick 进达",
    "authorAvatar": "/avatar.jpeg",
    "record": "",
    "startYear": "2015"
  },
  "markdown": {
    "lineNumbers": true
  }
}
