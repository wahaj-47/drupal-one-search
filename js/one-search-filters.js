(function ($, Drupal) {
    function sort(items) {
        items.each((i, el) => {
            $($(el).data('target')).css({ order: i });
        });
    }

    Drupal.behaviors.oneSearchSortableFilters = {
        attach: function (context, settings) {
            const filters = $('#one-search-filters-options');

            once('one-search-sortable-filters', '.one-search-target', context).forEach(function (el, index) {
                const view = $(el);

                const title = view.find(".bento-title-text").text();
                const count = view.find('.view-summary').data('total');

                const container = view.closest('.views-element-container');
                const viewId = container.attr('id');
                console.log(viewId)

                const filter = $("<div></div>", {
                    class: "form-check form-switch",
                    'data-target': `#${viewId}`,
                    'data-id': `#filter-${viewId}`
                })

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

            const sortable = new Sortable(filters[0], {
                animation: 150,
                onUpdate: function (evt) {
                    sort($(evt.to).children())
                },
                group: "bento-filters",
                store: {
                    /**
                     * Get the order of elements. Called once during initialization.
                     * @param   {Sortable}  sortable
                     * @returns {Array}
                     */
                    get: function (sortable) {
                        const order = localStorage.getItem(sortable.options.group.name);
                        return order ? order.split('|') : [];
                    },

                    /**
                     * Save the order of elements. Called onEnd (when the item is dropped).
                     * @param {Sortable}  sortable
                     */
                    set: function (sortable) {
                        const order = sortable.toArray();
                        localStorage.setItem(sortable.options.group.name, order.join('|'));
                    }
                }
            });

            sort(filters.children())

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

            once('one-search-reset-filters', '#one-search-reset-filter-button', context).forEach(function (el) {
                $(el).on("click", function () {
                    const order = []
                    const views = $('.one-search-target');
                    views.each(function (index, view) {
                        const container = $(view).closest('.views-element-container');
                        const viewId = container.attr('id');
                        order.push(`#filter-${viewId}`)
                    })
                    if (!sortable) return;
                    sortable.sort(order, true);
                    sort(filters.children());
                    sortable.save()
                })
            })
        }
    }
})(jQuery, Drupal);