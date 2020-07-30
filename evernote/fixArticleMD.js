var glob = require('glob');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var notes_less = require('./notes_less.json');

glob("./blogs/archived/*.md", {}, function (er, files) {
  for (let file of files) {
    // console.log(path.basename(file));
    let fileName = path.basename(file)
      .replace('.md', '')
      .replace(/ /g, '')
      .replace(/-/g, '')
      .replace(/_/g, '')
    // console.log('fileName', fileName)
    const info = _.find(notes_less, note => {
      const noteName = note.title
        .replace(/ /g, '')
        .replace(/\./g, '')
        .replace(/\+/g, '')
        .replace(/-/g, '')
        .replace(/_/g, '')
      return noteName == fileName
    })
    if (!info) continue
    let desc = `---
title: ${info.title}
date: ${moment(info.created).format('YYYY-MM-DD')}
tags:
${info.tags.map(it => ' - ' + it).join('\n')}
categories: 
 - Archived
---
`


    const content = fs.readFileSync(file)
    if(content.includes('categories')) continue
    console.log(file, desc+content)
    fs.writeFileSync(file, desc+content)

    // break
  }
})
// var json = notes.map(it => {
//   delete it.content
//   return it
// })
//
// console.log(json)
// fs.writeFileSync('notes_less.json', JSON.stringify(json, null, 2))
