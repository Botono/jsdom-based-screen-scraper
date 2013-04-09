var page = require('webpage').create();
page.open("http://www.cigargeeks.com/cigardb/default.asp?action=showcig&cigar_id=35979&t=5_Vegas_2011_Freedom_Blend_(Shaggy_head)", function () {
    page.render('cigar.png');
    phantom.exit();
});

