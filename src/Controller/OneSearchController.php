<?php

namespace Drupal\one_search\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

class OneSearchController extends ControllerBase
{
    public function content()
    {
        $block = \Drupal::entityTypeManager()
            ->getStorage('block')
            ->create(['plugin' => 'one_search_block']);

        $build = \Drupal::entityTypeManager()
            ->getViewBuilder('block')
            ->view($block);

        // Disable page chrome; just render HTML of the block.
        $output = \Drupal::service('renderer')->renderRoot($build);

        return new Response($output);
    }
}
