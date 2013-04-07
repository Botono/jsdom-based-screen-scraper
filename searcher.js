// Modules
var request = require('ahr2'),	 // Abstract-HTTP-request https://github.com/coolaj86/abstract-http-request
sys = require('sys'),		// System		
events = require('events'),	// EventEmitter
jsdom = require('jsdom'),	// JsDom https://github.com/tmpvar/jsdom
mongoose = require('mongoose');

require('./cg_brands'); // Big list of brands in cigarGeeksBrands[]


/*mongoose.connect('mongodb://localhost/cigardb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    // Mongoose Schemas
    var brandSchema = new mongoose.Schema({
        name: String,
        approved: {type: Boolean, default: false}
    });

    var cigarSchema = new mongoose.Schema({
        brand: String,
        name: String,
        length: Number,
        ring_gauge: Number,
        vitola: String,
        country_of_origin: String,
        wrappers: [{type: String}],
        binders: [{type: String}],
        fillers: [{type: String}],
        approved: {type: Boolean, default: false}
    })

});    */

var jQueryPath = 'http://code.jquery.com/jquery-1.9.1.min.js';
var headers = {'content-type':'application/json', 'accept': 'application/json'};



// Export searcher
module.exports = Searcher;

// Searcher = 1 brand
function Searcher(param) {
	if (param.headers) {
		this.headers = param.headers;
	} else {
		this.headers = headers;
	}

	this.merchantUrl = param.merchantUrl;
	this.id = param.merchantUrl;
    this.numberOfPages = 1;
    this.numberOfItems = 0;
}

// Inherit from EventEmitter
Searcher.prototype = new process.EventEmitter;

Searcher.prototype.search = function(query, collector) {
	var self = this;
	var url = self.getSearchUrl(query);

	self.makeRequest(url, true);

    self.on('first_page_complete', function(param) {
        if (param.searcher.numberOfPages > 1) {
            for (var i=2;i<=param.searcher.numberOfPages;i++) {
                url = self.getSearchUrl(query, i);
                self.makeRequest(url, false);
            }
        }
        self.onComplete({searcher: self});
    })

    self.on('complete', function(param) {
        console.log('NUMBER OF CIGARS SMOKED: '+ param.searcher.numberOfItems);
    })
}


Searcher.prototype.makeRequest = function(url, getNumberOfPages) {
    var self = this;
    console.log('Connecting to... ' + url);

    request({href: url, method: 'GET', headers: self.headers, timeout: 10000}, function(err, response, html) {
        if (err) {
            self.onError({error: err, searcher: self});
            self.onComplete({searcher: self});
        } else {
            console.log('Fetched content from... ' + url);
            // create DOM window from HTML data
            var window = jsdom.jsdom(html).createWindow();
            // load jquery with DOM window and call the parser!
            jsdom.jQueryify(window, jQueryPath, function() {
                self.parseHTML(window);
                if (getNumberOfPages) {
                    self.numberOfPages =  self.getNumberOfPages(window);
                    self.onFirstPageComplete({searcher: self});
                }
            });
        }
    });
}

Searcher.prototype.parseHTML = function(window) {
	throw "parseForBook() is unimplemented!";
}

Searcher.prototype.onItem = function(item) {
	this.emit('item', item);
}

Searcher.prototype.onFirstPageComplete = function(searcher) {
    console.log('First page complete!');
    this.emit('first_page_complete', searcher);
}

Searcher.prototype.onComplete = function(searcher) {
    console.log('Process complete!');
	this.emit('complete', searcher);
}

Searcher.prototype.onError = function(error) {
	console.log(error);
    this.emit('error', error);
}

Searcher.prototype.toString = function() {
	return this.merchantName + "(" + this.merchantUrl + ")";
}

Searcher.prototype.trim = function(text) {
	return text.trim().replace(/\n/g, "");
}

var searcher = new Searcher({
    merchantUrl: 'http://www.cigargeeks.com'
});

module.exports = searcher;

searcher.getSearchUrl = function(query, pageNumber) {
    if (!pageNumber) {
        pageNumber = 1;
    }
    return this.merchantUrl + "/cigardb/default.asp?action=srchrslt&page="+pageNumber+"&cigar_brand=" + encodeURIComponent(query);
}

searcher.getNumberOfPages = function(window) {
    var self = this;
    var numberOfPages = 1;
    window.$('font a').each(function() {
        var theLink = window.$(this);
        if (theLink.text() == 'Last >>') {
            numberOfPages = theLink.attr("href").match(/page=([0-9]+)/)[1];
            return numberOfPages;
        }
    });
    return numberOfPages;
}

searcher.parseHTML = function(window) {
    var self = this;
    //console.log('in parseHTML');


    window.$('table.bbstable tr').each(function(){
        //console.log('New TR');
        var theTR  = window.$(this);
        var name, length, ring_gauge, country, filler, wrapper, color,
            attributes = new Array(),
            attr_count=0;

        theTR.find('td.messagecellbody').not('[colspan]').each(function() {
            var theTD  = window.$(this);
            //console.log('------ New TD ' + attr_count);
            attributes[attr_count++] = theTD.text();
        });


        if (attributes[0] != undefined) {
            var theItem =  {
                name: attributes[0],
                length: attributes[1],
                ring_gauge: attributes[2],
                country: attributes[3],
                filler: attributes[4],
                wrapper: attributes[5],
                color: attributes[6]
            }
            self.numberOfItems++;
            console.log(theItem);
            self.onItem(theItem);
        }



    });
}

var cgCodeTranslation = new Array();
cgCodeTranslation['DR'] = 'Dominican Republic';
cgCodeTranslation['CTB/USA'] = 'Connecticut Broadleaf United States';
cgCodeTranslation['CT/USA'] = 'Connecticut United States';
cgCodeTranslation['CAM'] = 'Cameroon';
cgCodeTranslation['ECU'] = 'Ecuador';
cgCodeTranslation['CTS'] = 'Connecticut Shade';
cgCodeTranslation['HON'] = 'Honduras'



searcher.search('Arturo Fuente');