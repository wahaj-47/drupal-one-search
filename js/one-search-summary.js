(function ($, Drupal) {
    Drupal.behaviors.onesSearchSummary = {
        attach(context, settings) {
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
                    if (searchTerm) $('#one-search-term').text(searchTerm);
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