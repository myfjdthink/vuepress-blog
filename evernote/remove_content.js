var notes = require('./notes.json');
var fs = require('fs');


var json = notes.map(it => {
  delete it.content
  return it
})

console.log(json)
fs.writeFileSync('notes_less.json', JSON.stringify(json, null, 2))
