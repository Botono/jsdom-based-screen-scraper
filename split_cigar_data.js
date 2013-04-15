var theCigars = require('./scrape_output.js');
var fs = require('fs');
var set1 = [],
    set2 = [],
    set3 = [],
    set4 = []


for (var i=0;i<10000;i++) {
   set1.push(theCigars[i].link);
}
fs.write('cigar_links_1.js', JSON.stringify(set1), 'w');
console.log('DONE WITH 1');
for (var i=10000;i<20000;i++) {
    set2.push(theCigars[i].link);
}
fs.write('cigar_links_2.js', JSON.stringify(set2), 'w');
console.log('DONE WITH 2');
for (var i=20000;i<30000;i++) {
    set3.push(theCigars[i].link);
}
fs.write('cigar_links_3.js', JSON.stringify(set3), 'w');
console.log('DONE WITH 3');
for (var i=30000;theCigars[i];i++) {
    set4.push(theCigars[i].link);
}
fs.write('cigar_links_4.js', JSON.stringify(set4), 'w');
console.log('DONE WITH 4');