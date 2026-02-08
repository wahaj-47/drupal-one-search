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
                        const faqHref = 'https://askus.lib.lsu.edu/search/?t=0&g%5B%5D=10606&g%5B%5D=9630&g%5B%5D=287&g%5B%5D=8979&g%5B%5D=10636&g%5B%5D=9629&g%5B%5D=12395&g%5B%5D=9631&g%5B%5D=10637&g%5B%5D=4711&q=' + encodeURIComponent(searchTerm);
                        const dataHref = 'https://guides.lib.lsu.edu/az.php?q=' + encodeURIComponent(searchTerm);
                        const discoveryHref = `https://libezp.lib.lsu.edu/login?url=https://search.ebscohost.com/login.aspx?direct=true&site=eds-live&scope=site&type=0&mode=and&lang=en&bquery=${searchTerm}`


                        $('a.catalogExternal').attr('href', newHref);
                        $('a.guideExternal').attr('href', guideHref);
                        $('a.srExternal').attr('href', srHref);
                        $('a.faqExternal').attr('href', faqHref);
                        $('a.discExternal').attr('href', discoveryHref);
                        $('a.dataExternal').attr('href', dataHref);
                        $('a.discoveryExternal').attr("href", discoveryHref)

                        //change h4 to show summary
                        $('h4.bentoSubtitle').html('Your search for <span class="searchInput">' + searchTerm + '</span> came up with <span class="searchInput">' + totalResults + '</span> results');
                        //add class to body to allow for styling
                        $('body').addClass('search-loaded');
                        //change bradcrumb to show summary
                        $('.breadcrumb.end').html('<i>"' + searchTerm + '"</i>');
                        //add class to parent of summary to allow for styling
                        $('.bentoControls').parent().addClass('bentoBar');
                    }

                    // Trigger event to allow other modules to listen for it
                    $(document).trigger('one-search-summary-ready', { totalResults, searchTerm })
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