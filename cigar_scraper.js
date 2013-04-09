pjs.config(
    {
        log: 'stdout',
        format: 'json',
        writer: 'file',
        outFile: 'cigars.json',
        timeoutInterval: 5000,
        timeoutLimit: 50000
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
var theCigars = [
    {"link": "http://www.cigargeeks.com/cigardb/default.asp?action=showcig&cigar_id=35979&t=5_Vegas_2011_Freedom_Blend_(Shaggy_head)"},
    {"link": "http://www.cigargeeks.com/cigardb/default.asp?action=showcig&cigar_id=36945&t=5_Vegas_2011_Freedom_Blend_Special_Figurado"},
    {"link": "http://www.cigargeeks.com/cigardb/default.asp?action=showcig&cigar_id=18232&t=Alec_Bradley_Maxx_Traditional_Torpedo"}
];

addCookies();

for (var i=0;theCigars[i];i++) {
    pjs.addSuite({
        url: theCigars[i].link,
        noConflict: true,
        scraper: function() {
            var brand, name, length, ring_gauge, country, filler, binder, wrapper, color, vitola,
                theLabel, theValue,
                cigarData = new Object(),
                finalValue = new Array();

            _pjs.$('table.bbstable').first().find('tr').each(function(){
                theLabel = _pjs.$.trim(_pjs.$(this).find('td.messagecellbody').first().text().replace(/ /g, "_").toLowerCase().split(":")[0]);
                theValue = _pjs.$.trim(_pjs.$(this).find('td.messagecellbody').last().text());
                //console.log(theLabel + ' : '+ theValue);
                cigarData[theLabel] = theValue;
            });
            //console.log(JSON.stringify(cigarData));
            return cigarData;
        }
    });
}


