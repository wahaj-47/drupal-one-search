<?php

namespace Drupal\one_search\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * @Block(
 *   id = "one_search_filters_block",
 *   admin_label = @Translation("One Search Filters"),
 *   category = @Translation("Custom")
 * )
 */
class OneSearchFiltersBlock extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        return [
            '#theme' => 'one_search_filters',
            '#attached' => [
                'library' => ['one_search/filters'],
            ],
        ];
    }
}
