$(function () {
    function doIt(searchTerm) {
        var urlBase = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=20&prop=pageimages|extracts&pilimit=max&pithumbsize=300&exintro&explaintext&exsentences=2&exlimit=max&origin=*&gsrsearch=' +
            searchTerm;
        $.ajax({
            url: urlBase,
            dataType: 'json',
            type: 'get',
            cache: false,
            success: displayContent,
            error: errHandler
        });

        function addNode(el, txt, par, cla, inx, num) {
            var newEl = document.createElement(el);
            newEl.appendChild(txt);
            document.getElementsByClassName(par)[inx].appendChild(newEl);
            if (num === 1) {
                $(newEl).addClass(cla + '_' + inx);
            } else if (num === 0) {
                $(newEl).addClass(cla);
            } else {
                return;
            }
        }

        function displayContent(data) {

            //            var liTextNode = document.createTextNode();
            if (data['query']) {
                var counter = 0;
                for (key in data['query']['pages']) {

                    if (data['query']['pages'][key]['pageimage'] === undefined) {
                        continue;
                    } else {

                        var extractTxt = document.createTextNode(data['query']['pages'][key]['extract']);
                        var titleTxt = document.createTextNode(data['query']['pages'][key]['title']);
                        var imgSrcTxt = data['query']['pages'][key]['thumbnail']['source'];
                        var emptyTxtNode = document.createTextNode('');
                        addNode('li', emptyTxtNode, 'articles-list', 'list', 0, 0);
                        addNode('div', emptyTxtNode, 'list', 'cont', counter, 0);
                        addNode('div', emptyTxtNode, 'cont', 'img-cont', counter, 0);
                        addNode('img', emptyTxtNode, 'img-cont', 'thumb', counter, 1);
                        addNode('div', emptyTxtNode, 'cont', 'cont-ext', counter, 0);
                        $('.thumb_' + counter).attr("src", imgSrcTxt).addClass('thumb'); //adds src attributte to image and classes .thumb_(inx) and .thumb
                        $('.cont').addClass('clearfix');
                        addNode('h3', titleTxt, 'cont-ext', 'title', counter, 3);
                        addNode('span', extractTxt, 'cont-ext', 'extract', counter, 0);
                        counter = counter + 1;
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
