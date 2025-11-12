(function ($, Drupal) {
    Drupal.behaviors.oneSearchSortableFilters = {
        attach: function (context, settings) {
            const filters = $('#one-search-filters-options');

            once('one-search-sortable-filters', '.one-search-target', context).forEach(function (el) {
                const view = $(el);

                const title = view.find(".bento-title-text").text();
                const count = view.find('.view-summary').data('total');

                const viewId = view.closest('.views-element-container').attr('id');

                const filter = $("<div></div>").addClass("form-check form-switch");
                const checkbox = $("<input>", {
                    type: 'checkbox',
                    role: 'switch',
                    checked: true,
                    id: `filter-${viewId}`,
                    'data-target': `#${viewId}`,
                    class: "form-check-input"
                })

                const label = $("<label></label>", {
                    for: `filter-${viewId}`,
                    text: title,
                    class: "form-check-label"
                });

                const total = $("<span></span>", {
                    class: "filter-total numBento",
                    text: ` ${count}`
                });

                const handle = $("<i></i>", {
                    class: "fas fa-arrows-alt-v"
                })

                label.append(total);
                filter.append(checkbox, label, handle);
                filters.append(filter);

            });

            const sortable = new Sortable(filters[0], { animation: 150 });

            filters.on('change', 'input[type="checkbox"]', function () {
                const targetSelector = $(this).data('target');
                const target = $(targetSelector);
                if ($(this).is(':checked')) {
                    target.show();
                } else {
                    target.hide();
                }
            });

            $(document).on('ajaxComplete', function (e) {
                $('#one-search-filters-options .form-check').each(function () {
                    const newfilterCount = $(this).find('.filter-total').text();
                    if (newfilterCount == '0') {
                        $(this).addClass('emptyFilter');
                    } else {
                        $(this).removeClass('emptyFilter');
                    }
                });


                $('.one-search-target').each(function () {
                    const view = $(this);
                    const viewId = view.closest('.views-element-container').attr('id');
                    const newCount = view.find('.view-summary').data('total');

                    $(`#filter-${viewId}`)
                        .siblings('label')
                        .find('.filter-total')
                        .text(`${newCount || 0}`);

                });
            });
        }
    }
})(jQuery, Drupal);