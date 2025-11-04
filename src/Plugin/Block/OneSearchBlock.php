<?php

namespace Drupal\one_search\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * @Block(
 *   id = "one_search_block",
 *   admin_label = @Translation("One Search"),
 *   category = @Translation("Custom")
 * )
 */
class OneSearchBlock extends BlockBase
{
    /**
     * {@inheritdoc}
     */
    public function defaultConfiguration()
    {
        return [
            'target_route' => '<front>', // default View route
            'placeholder' => $this->t('Search everything...'),
            'filter_identifier' => $this->t('search')
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function blockForm($form, FormStateInterface $form_state)
    {
        $form['target_route'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Target route or path'),
            '#description' => $this->t('Enter a route name (e.g. view.search_page.page_1) or a custom path (e.g. /search).'),
            '#default_value' => $this->configuration['target_route'],
            '#required' => TRUE,
        ];

        $form['placeholder'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Placeholder text'),
            '#default_value' => $this->configuration['placeholder'],
        ];

        $form['filter_identifier'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Filter Identifier'),
            '#description' => $this->t('This will appear in the URL after the ? to identify this filter. Cannot be blank. Only letters, digits and the dot ("."), hyphen ("-"), underscore ("_"), and tilde ("~") characters are allowed. "value", "q", "destination", "_format", "_wrapper_format", "token" are reserved words and cannot be used.'),
            '#default_value' => $this->configuration['filter_identifier'],
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function blockSubmit($form, FormStateInterface $form_state)
    {
        $this->configuration['target_route'] = $form_state->getValue('target_route');
        $this->configuration['placeholder'] = $form_state->getValue('placeholder');
        $this->configuration['filter_identifier'] = $form_state->getValue('filter_identifier');
    }

    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $target = $this->configuration['target_route'];
        $url = $target;

        try {
            if (!str_starts_with($target, '/')) $url = Url::fromRoute($target, [], ['absolute' => TRUE])->toString();
            else $url = Url::fromUserInput($target, ['absolute' => TRUE])->toString();
        } catch (\Exception $e) {
            $url = Url::fromRoute('<front>', [], ['absolute' => TRUE])->toString();
            \Drupal::logger('one_search')->warning('Invalid target route/path: @target', ['@target' => $target]);
        }

        return [
            '#theme' => 'one_search',
            '#attached' => [
                'library' => ['one_search/main'],
                'drupalSettings' => [
                    'one_search' => [
                        'filterIdentifier' => $this->configuration['filter_identifier'],
                    ],
                ],
            ],
            '#action' => $url,
            '#placeholder' => $this->configuration['placeholder'],
            '#filter_identifier' => $this->configuration['filter_identifier']
        ];
    }
}
