<?php

namespace Drupal\one_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

class OneSearchController extends ControllerBase
{
    public function content($block_id)
    {
        $block = \Drupal::entityTypeManager()
            ->getStorage('block')
            ->load($block_id);

        $build = \Drupal::entityTypeManager()
            ->getViewBuilder('block')
            ->view($block);

        // Disable page chrome; just render HTML of the block.
        $output = \Drupal::service('renderer')->renderRoot($build);

        return new Response($output);
    }
}
