(function ($, Drupal) {
    Drupal.behaviors.globalSearchRedirect = {
        attach(context, settings) {
            once('one-search-form', '#one-search', context).forEach((form) => {
                // Optional enhancement: intercept Enter key to add custom logic
                $(form).on('submit', function (e) {
                    e.preventDefault();
                    const filterIdentifier = settings.one_search.filterIdentifier;
                    const term = $(form).find(`input[name="${filterIdentifier}"]`).val() || '';

                    const views = $('.one-search-target', context)

                    views.each(function () {
                        const view = $(this);
                        const input = view.find(`[name="${filterIdentifier}"]`)
                        const submit = view.find('.view-filters .form-submit')
                        input.val(term);
                        submit.click();
                    })
                });
            });
        }
    };
})(jQuery, Drupal);