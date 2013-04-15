pjs.config(
    {
        log: 'stdout',
        format: 'json',
        writer: 'file',
        outFile: 'cigars4.json',
        timeoutInterval: 3000,
        timeoutLimit: 30000
    }
)


function addCookies() {
    phantom.addCookie({
        'name':     'username',   /* required property */
        'value':    'Botono',  /* required property */
        'domain':   'www.cigargeeks.com',           /* required property */
        'path':     '/',
        'httponly': true,
        'expires':  (new Date()).getTime() + 86400   /* <- expires in 10 hour */
    });

    phantom.addCookie({
        'name':     'password',   /* required property */
        'value':    'FFCA2DB69D920FF3DAD420334F4E59F5C051C36E',  /* required property */
        'domain':   'www.cigargeeks.com',           /* required property */
        'path':     '/',
        'httponly': true,
        'expires':  (new Date()).getTime() + 86400   /* <- expires in 10 hour */
    });

    phantom.addCookie({
        'name':     'bbsmid',   /* required property */
        'value':    '30293',  /* required property */
        'domain':   'www.cigargeeks.com',           /* required property */
        'path':     '/',
        'httponly': true,
        'expires':  (new Date()).getTime() + 86400   /* <- expires in 10 hour */
    });
}
var theCigars = require('../scrape_output.js');

addCookies();

for (var i=30000;i<32000;i++) {
    pjs.addSuite({
        url: theCigars[i].link,
        noConflict: true,
        scraper: function() {
            var theLabel, theValue,
                cigarData = new Object();
            _pjs.$('table.bbstable').first().find('tr').each(function(){
                theLabel = _pjs.$.trim(_pjs.$(this).find('td.messagecellbody').first().text().replace(/ /g, "_").toLowerCase().split(":")[0]);
                theValue = _pjs.$.trim(_pjs.$(this).find('td.messagecellbody').last().text());
                cigarData[theLabel] = theValue;
            });
            return cigarData;
        }
    });
}


