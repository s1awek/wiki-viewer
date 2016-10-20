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

                        document.getElementsByClassName('articles-list')[0].innerHTML += '<li class="clearfix">' + '<img class="thumbnail" src="' + data['query']['pages'][key]['thumbnail']['source'] + '"><span class="description"><h3>' + data['query']['pages'][key]['title'] + '</h3>' + data['query']['pages'][key]['extract'] + '</span></li>';
                    }
                }
            } else {
                //TODO add nice error handler class
                document.getElementsByClassName('articles-list')[0].innerHTML = 'error';
            }

        }

        function errHandler(err) {
            console.log('error: ', err.responseText);
            document.getElementsByTagName('body')[0].innerHTML = err.responseText;

        }
    }

    $('.search-wiki').keydown(function () {
        $('.search-wiki').autocomplete({
            source: autoTerms,
            appendTo: '.ui-front',
            minLength: 2,
            select: function (event, ui) {
                if (ui.item) {
                    $('.search-wiki').autocomplete('destroy');
                    document.getElementsByClassName('articles-list')[0].innerHTML = '';
                    doIt(ui.item.value);
                } else {
                    //TODO investigate if it's possible to even ever trigger that
                    $('body').text('<h1>error</h1>');
                }
            },
            messages: {
                noResults: '',
                results: function () {
                    return;
                }
            },
            _resizeMenu: function () {
                this.menu.element.outerWidth(300);
            }

        });
        var val = $('.search-wiki').val();
        if (event.keyCode == 13) {
            $('.search-wiki').autocomplete('destroy');
            document.getElementsByClassName('articles-list')[0].innerHTML = '';
            doIt(val);
        }



    });

    function autoTerms(request, response) {
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                'action': 'opensearch',
                'format': 'json',
                'search': request.term
            },
            success: function (data) {
                response(data[1]);
            }
        });
    }




});
