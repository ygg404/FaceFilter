$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;

    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        if(this.value<50){
           $input.css( 'background', '#fad1f0');
            $input.css( 'background-size', this.value + '% 50%' );

        }
        else{
            $input.css( 'background', '#fa13f6');
            $input.css( 'background-size', '50% ' +this.value + '%' );

        }
        //background: linear-gradient(to right, #fad1f0, #ffa7f7 100%, #ffa7f7);
        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};
