var page = require('webpage').create();
var Q = require('q');
var cigarBrands = ['Arturo Fuente'];
var cigars = new Array();



function getSearchUrl(query, pageNumber) {
    var baseUrl = 'http://www.cigargeeks.com';
    if (!pageNumber) {
        pageNumber = 1;
    }
    return baseUrl + "/cigardb/default.asp?action=srchrslt&page="+pageNumber+"&cigar_brand=" + encodeURIComponent(query);
}

function injectJquery() {
    page.injectJs("http://code.jquery.com/jquery-1.9.1.min.js");
}

function firstPageOfBrand() {
    console.log('FUUUUUUUUUU');

    page.includeJs("http://code.jquery.com/jquery-1.9.1.min.js", function() {
        footest = page.evaluate(function() {
            console.log('Doing First page');
            var numberOfPages = 1;
            var firstCigarLinks = new Array();
            // Do the page scraping here
            $('font a').each(function() {
                var theLink = $(this);
                if (theLink.text() == 'Last >>') {
                    numberOfPages = theLink.attr("href").match(/page=([0-9]+)/)[1];
                }
            });
            $('table.bbstable tr').each(function(){
                console.log('New TR');
                var theTR  = $(this);
                theTR.find('td.messagecellbody').not('[colspan]').first(function() {
                    var theTD  = $(this);
                    //console.log('------ New TD ' + attr_count);
                    console.log('Grabbed link: ' + theTD.find('a').first().attr('href'));
                    firstCigarLinks.push(theTD.find('a').first().attr('href'));
                })
            });

            return {
                numberOfPages: numberOfPages,
                cigarLinksArray: firstCigarLinks,
                stuffInArray: firstCigarLinks.length
            }
        });
        console.log('array' + footest.stuffInArray);
    });

    //numberOfPages = firstReturn.numberOfPages;
   // cigarLinks = cigarLinks.concat(firstReturn.cigarLinksArray);

}

page.onLoadFinished = function(status) {
      if (status == 'success') {
          if (!phantom.state) {
              firstReturn = firstPageOfBrand();
              console.log(firstReturn);
              phantom.state = 'got_pages';
          } else if(phantom.state == 'got_pages') {
             console.log('Finished First Page processing.')
          } else {
              console.log('done?');
          }
      } else {
          console.log('Connection failed!');
          phantom.exit();
      }
}

for (var i=0;cigarBrands[i];i++) {
    var cigarLinks = new Array();
    var numberOfPages = 1;
    var firstReturn,
        pageReturn = new Array(), linkReturn= new Array();
    var allTheCigars = new Array();
    console.log('Working on brand: ' + getSearchUrl(cigarBrands[i]));
    page.open(getSearchUrl(cigarBrands[i], 1));
}


    //console.log(allTheCigars);

/*if (numberOfPages > 1) {
 for (var j=2;j<=numberOfPages;j++) {
 page.open(getSearchUrl(cigarBrands[i], j), function() {
 console.log('Opening Subsequent Pages: ' + j)
 page.includeJs("http://code.jquery.com/jquery-1.9.1.min.js", function() {
 console.log('JQuery on page ' + j);
 pageReturn.push(page.evaluate(function() {
 console.log('Evaluating Subsequent');
 var otherCigarLinks = new Array();
 // Do the page scraping here
 $('table.bbstable tr').each(function(){
 //console.log('New TR');
 var theTR  = $(this);
 theTR.find('td.messagecellbody').not('[colspan]').first(function() {
 var theTD  = $(this);
 //console.log('------ New TD ' + attr_count);
 console.log('Grabbed link: ' + theTD.find('a').first().attr('href'));
 otherCigarLinks.push(theTD.find('a').first().attr('href'));
 })
 });
 return {cigarLinksArray: otherCigarLinks};
 }));
 for (var k=0;pageReturn[k];k++) {
 cigarLinks = cigarLinks.concat(pageReturn[k].cigarLinksArray);
 }
 })
 });
 }
 }
 page.release();
 for (var k=0;cigarLinks[k];k++) {
 setTimeout(function(){
 page.open(cigarLinks[k], function() {
 console.log('Opening cigar pages: '+ k);
 page.includeJs("http://code.jquery.com/jquery-1.9.1.min.js", function() {
 linkReturn.push(page.evaluate(function() {
 var cigars;
 // Do the page scraping here
 $('table.bbstable tr').each(function(){
 //console.log('New TR');
 var theTR  = $(this);
 var name, length, ring_gauge, country, filler, wrapper, binder, color, vitola,
 attributes = new Array()

 theTR.find('td.messagecellbody').not('[colspan]').last(function() {
 var theTD  = $(this);
 //console.log('------ New TD ' + attr_count);
 attributes.push(theTD.text());
 });

 if (attributes[0] != undefined) {
 var theItem =  {
 brand: attributes[0],
 name: attributes[1],
 length: attributes[2],
 ring_gauge: attributes[3],
 country: attributes[4],
 filler: attributes[5],
 binder: attributes[6],
 wrapper: attributes[7],
 color: attributes[8],
 vitola: attributes[10]
 };
 cigars.push(theItem);
 }
 });
 return {cigarData: cigars};
 }));
 for(var j=0;linkReturn[j];j++) {
 allTheCigars.push(linkReturn[j].cigarData);
 }
 })
 });
 },2000);*/


