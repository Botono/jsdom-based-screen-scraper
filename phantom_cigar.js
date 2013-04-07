var page = require('webpage').create();
var baseUrl = 'http://www.cigargeeks.com';



function getSearchUrl(query, pageNumber) {
    if (!pageNumber) {
        pageNumber = 1;
    }
    return baseUrl + "/cigardb/default.asp?action=srchrslt&page="+pageNumber+"&cigar_brand=" + encodeURIComponent(query);
}


page.open('http://www.sample.com', function() {
    page.includeJs("http://code.jquery.com/jquery-1.9.1.min.js", function() {
        page.evaluate(function() {
            $("button").click();
        });
        phantom.exit()
    });
});
