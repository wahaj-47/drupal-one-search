(function ($, Drupal) {
    Drupal.AjaxCommands.prototype.scrollTop = function () {
        // console.log('viewsScrollTop intercepted');
        return;
    }; //disable scrollTop

    Drupal.behaviors.oneSearch = {
        attach: function (context, settings) {
            once('one-search-form', '#one-search', context).forEach((form) => {
                $(form).on('submit', function (e) {
                    const { protocol, host, pathname } = location;

                    const action = settings.one_search.action;
                    const actionUrl = new URL(action, `${protocol}//${host}`);

                    const filterIdentifier = settings.one_search.filterIdentifier;
                    const term = $(form).find(`input[name="${filterIdentifier}"]`).val() || '';
                    $(form).addClass('is-loading');
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

            highlightBar();

            $(document).ajaxStop(function () { //has to run after each search
                highlightBar();
                $('.one-search-form').removeClass('is-loading');

            });

            function highlightBar() {
                $('.bentoColumn .view-content').each(function () {
                    const $view = $(this);
                    // Add highlight bar only if missing
                    if (!$view.find('.highlight-bar').length) {
                        $view.prepend('<div class="highlight-bar"></div>');
                    }

                    const $bar = $view.find('.highlight-bar');
                    const $links = $view.find('a');

                    $links.on('mouseenter', function () {
                        const $link = $(this);
                        const offsetTop = $link.position().top;
                        const height = $link.outerHeight();

                        $bar.css({
                            top: offsetTop,
                            height: height,
                            width: '10px',
                            opacity: '1',
                        });
                    });

                    $view.on('mouseleave', function () {
                        // Collapse to center
                        $bar.css({
                            width: '0px',
                            opacity: '0',
                        });
                    });
                });
            }
        }
    };
})(jQuery, Drupal);