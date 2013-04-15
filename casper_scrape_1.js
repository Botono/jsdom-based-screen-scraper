
var fs = require('fs');
var casper = require('casper').create({
    clientScripts: ['jquery.js']
});
var config = {
    outFile: 'cigars1.json',
    scrapeDelay: 3000
};
var theCigars = require('./cigar_links_1.js');


casper.start('http://www.cigargeeks.com/community/logon.asp', function() {
    fs.write(config.outFile, '', 'w');
    fs.write(config.outFile, '[', 'a');
    this.fill('form[method="post"]', {
        postusername: 'Botono',
        postpassword: '1lQ2@yG$@q2xDGZCBCI8',
        storeincookie: true
    }, true);
});

casper.on('remote.message', function(message) {
    this.echo('remote console message: ' + message);
});

casper.each(theCigars, function(casper, cigar) {
    casper.wait(3000, function () {
        console.log('Opening: ' + cigar);
        this.open(cigar);
        var cigarData = this.evaluate(function() {
            var theLabel, theValue,
                cigarInfo = new Object();
            $('table.bbstable').first().find('tr').each(function(){
                theLabel = $.trim($(this).find('td.messagecellbody').first().text().replace(/ /g, "_").toLowerCase().split(":")[0]);
                theValue = $.trim($(this).find('td.messagecellbody').last().text());;
                cigarInfo[theLabel] = theValue;
            });

            return cigarInfo;
        });
        console.log('Writing data: ' + JSON.stringify(cigarData));
        fs.write(config.outFile, JSON.stringify(cigarData)+',', 'a');
})});




casper.run(function () {
    fs.write(config.outFile, ']', 'a');
    this.exit();
});
