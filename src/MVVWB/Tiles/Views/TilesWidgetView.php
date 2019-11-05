<nav class="tiles<?=esc_attr($tilesClass)?>"
     style="<?=esc_attr($tilesStyle)?>"
     aria-label="<?=esc_attr__('Recent Posts', 'mvvwb-tiles')?>">
    <div class="tiles-inner">
        <?php foreach ($tiles as $tile): ?>
            <?php if ($tile['url']): ?>
                <a class="tile<?=esc_attr($tile['class'])?>"
                   style="<?=esc_attr($tile['style'])?>"
                   href="<?=esc_url($tile['url'])?>" <?=$tile['title']?>>
                </a>
            <?php else: ?>
                <div class="tile<?=esc_attr($tile['class'])?>"
                     style="<?=esc_attr($tile['style'])?>">
                </div>
            <?php endif ?>
        <?php endforeach ?>
    </div>
</nav>
