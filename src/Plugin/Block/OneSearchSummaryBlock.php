<?php

namespace Drupal\one_search\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * @Block(
 *   id = "one_search_summary_block",
 *   admin_label = @Translation("One Search Summary"),
 *   category = @Translation("Custom")
 * )
 */
class OneSearchSummaryBlock extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        return [
            '#theme' => 'one_search_summary',
            '#attached' => [
                'library' => ['one_search/summary'],
            ],
        ];
    }
}
