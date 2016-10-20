$(function () {
    function doIt(searchTerm) {
        var urlBase = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=20&prop=pageimages|extracts&pilimit=max&pithumbsize=200&exintro&explaintext&exsentences=2&exlimit=max&origin=*&gsrsearch=' +
            searchTerm;
        $.ajax({
            url: urlBase,
            dataType: 'json',
            type: 'get',
            cache: false,
            success: displayContent,
            error: errHandler
        });

        function displayContent(data) {
            if (data['query']) {
                for (key in data['query']['pages']) {

                    if (data['query']['pages'][key]['pageimage'] === undefined) {
                        continue;
                    } else {

                        document.getElementsByClassName('wrapper')[0].innerHTML += '<li class="clearfix">' + '<img class="thumbnail" src="' + data['query']['pages'][key]['thumbnail']['source'] + '">' + data['query']['pages'][key]['extract'] + '</li>';
                    }
                }
            } else {
                document.getElementsByClassName('wrapper')[0].innerHTML = 'error';
            }

        }

        function errHandler(err) {
            console.log('error: ', err);
        }
    }

    $('.search-wiki').keydown(function () {
        $('.search-wiki').autocomplete({
            source: autoTerms
        });
        var val = $('.search-wiki').val();
        if (event.keyCode == 13) {
            document.getElementsByClassName('wrapper')[0].innerHTML = '';
            doIt(val);
        }



    });

    function autoTerms(request, response) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            minLength: 4,
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function (data) {
                response(data[1]);
            }
        });
    }




});
