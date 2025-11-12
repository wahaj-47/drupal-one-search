(function ($, Drupal) {
    Drupal.behaviors.onesSearchSummary = {
        attach: function (context, settings) {
            once('one-search-summary', 'body', context).forEach(() => {
                function summarize() {
                    const views = $('.one-search-target', context)
                    const summaries = views.find('.view-summary');
                    const totalResults = summaries.toArray().reduce((acc, curr) => { return acc + (parseInt($(curr).data('total')) || 0) }, 0);
                    $('#one-search-total').text(totalResults);

                    const filterIdentifier = settings.one_search.filterIdentifier;
                    const queryString = window.location.search;
                    const params = new URLSearchParams(queryString);
                    const searchTerm = params.get(filterIdentifier) || settings.one_search.searchTerm;

                    
                    if (searchTerm) {
                        
                        $('#one-search-term').text(searchTerm);
                        //use searchTerm for external catalog search link
                        const base = 'https://lsu.ent.sirsi.net/client/en_US/lsu/search/results';
                        const params = [
                            'user_id=',
                            'qu=' + encodeURIComponent(searchTerm),
                            'rt=Keyword',
                            'qf=ALL'
                        ].join('&');
                        const newHref = base + '?' + params;
                        const guideHref = 'https://guides.lib.lsu.edu/srch.php?q=' + encodeURIComponent(searchTerm);
                        const srHref = 'https://repository.lsu.edu/do/search/?q=' + encodeURIComponent(searchTerm) + '&start=0&context=8403704';
                        $('a.catalogExternal').attr('href', newHref);
                        $('a.guideExternal').attr('href', guideHref);
                        $('a.srExternal').attr('href', srHref);
                        //wahaj, please write an equivalent for an external discovery search link

                        //change h4 to show summary
                        $('h4.bentoSubtitle').html('Your search for <span class="searchInput">'+ searchTerm +'</span> came up with <span class="searchInput">' + totalResults + '</span> results');
                        //$('a.discoveryExternal') will need the new href
                    }

                }

                // Called once on page load
                summarize();

                // Then called on all subsequent AJAX requests
                $(document).on('ajaxComplete', function (e) {
                    summarize()
                });
            });
        }
    };
})(jQuery, Drupal);