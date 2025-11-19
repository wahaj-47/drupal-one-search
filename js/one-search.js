(function ($, Drupal) {
    Drupal.behaviors.oneSearch = {
        attach: function (context, settings) {

            once('one-search-form', '#one-search', context).forEach((form) => {
                $(form).on('submit', function (e) {
                    const { protocol, host, pathname } = location;

                    const action = settings.one_search.action;
                    const actionUrl = new URL(action, `${protocol}//${host}`);

                    const filterIdentifier = settings.one_search.filterIdentifier;
                    const term = $(form).find(`input[name="${filterIdentifier}"]`).val() || '';

                    if (pathname === actionUrl.pathname) {
                        e.preventDefault();

                        const url = new URL(location);
                        url.searchParams.set(filterIdentifier, term);
                        history.pushState({}, "", url);
                    }

                    triggerViewsSearch(term, filterIdentifier, context);
                });
            });

            once('one-search-popstate', 'body', context).forEach(() => {
                window.addEventListener("popstate", function () {
                    console.log("POP STATE");

                    const filterIdentifier = settings.one_search.filterIdentifier;
                    const term = new URL(location.href).searchParams.get(filterIdentifier) || '';

                    triggerViewsSearch(term, filterIdentifier, context);
                });
            });

            function triggerViewsSearch(term, filterIdentifier, context) {
                settings.one_search.searchTerm = term;

                const views = $('.one-search-target', context);

                views.each(function () {
                    const view = $(this);
                    const input = view.find(`[name="${filterIdentifier}"]`);
                    const submit = view.find('.view-filters .form-submit');
                    input.val(term);
                    submit.click();
                });

                $('#one-search input[name="' + filterIdentifier + '"]').val(term);
            }
        }
    };
})(jQuery, Drupal);
