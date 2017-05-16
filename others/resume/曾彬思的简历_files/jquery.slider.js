;(function($, window, document, undefined) {
    var HwSlider = function(ele, opt){
        var self = this;
        self.$element = ele,
        self.defaults = {
            width: 840, //��ʼ���
            height: 256, //��ʼ�߶�
            start: 1, //��ʼ����λ�ã��ӵڼ�����ʼ����
            speed: 400, //�����ٶȣ���λms
            interval: 3000, //���ʱ�䣬��λms
            autoPlay: false,  //�Ƿ��Զ�����
            dotShow: true, //�Ƿ���ʾԲ�㵼��
            navShow: true, //�Ƿ����ֵ���
            arrShow: true, //�Ƿ���ʾ���ҷ����ͷ����
            touch: true, //�Ƿ�֧�ִ�������
            effect: 'slide',//Ĭ����slideЧ������չ��֧��fadeЧ��
			fadeOut: true,//���ⶨ�ƣ����fadeʱ���Ƿ����һ��Ԫ��ִ��fadeOut��false ���� ֱ�� hide
            afterSlider: function(){}
        },
        self.clickable = true,  //�Ƿ��Ѿ�����˻���������������
        self.options = $.extend({}, self.defaults, opt)
    }
    HwSlider.prototype = {
        init: function(){
            var self = this,
                ele = self.$element;

            var sliderInder = ele.children('ul')
            var hwsliderLi = sliderInder.children('li');
            var hwsliderSize = hwsliderLi.length;  //������ܸ���
            var index = self.options.start;
            var touchStartY = 0,touchStartX = 0;

            //��ʾ���ҷ����
            if(self.options.arrShow){
                var arrElement = '<a href="javascript:;" class="btn-direction btn-prev"></a><a href="javascript:;" class="btn-direction btn-next"></a>';
                ele.append(arrElement);
            }

            for(i=1;i<=hwsliderSize;i++){
                if(index==i) hwsliderLi.eq(index-1).addClass('cur');
            }

            //��ʾԲ�㵼��
            if(self.options.dotShow){
                var dot = '';
                for(i=1;i<=hwsliderSize;i++){
                    if(index==i){
                        dot += '<i data-index="'+i+'" class="cur"></i>';
                    }else{
                        dot += '<i data-index="'+i+'"></i>';
                    }
                }
                var dotElement = '<div class="slider-dot">'+dot+'</div>';
                ele.append(dotElement);
            }

            //��ʼ�����
            var resize = function(){
                var sWidth = ele.width();
                //���ݻ����ȵȱ������Ÿ߶�
                var sHeight = self.options.height/self.options.width*sWidth;
                ele.css('height',sHeight); 

                /*if(self.options.arrShow){
                    var arrOffset = (sHeight-40)/2;
                    ele.find(".btn-direction").css('top',arrOffset+'px'); //������ͷλ��
                }
                if(self.options.dotShow){
                    var dotWidth = hwsliderSize*20;
                    var dotOffset = (sWidth-dotWidth)/2;
                    ele.find(".slider-dot").css('left',dotOffset+'px'); //����Բ��λ��
                }*/
            }

            ele.css('height',self.options.height);
            resize();

            //���ڴ�С�任ʱ����Ӧ
            $(window).resize(function(){
              resize();
            });


            if(self.options.arrShow){
                //����Ҽ�ͷ
                ele.find('.next').on('click', function(event) {
                    event.preventDefault();
                    if(self.clickable){
                        if(index >= hwsliderSize){
                            index = 1;
                        }else{
                            index += 1;
                        }
                        self.moveTo(index,'next');
                    }
                });

                //������ͷ
                ele.find(".prev").on('click', function(event) {
                    event.preventDefault();
                    if(self.clickable){
                        if(index == 1){
                            index = hwsliderSize;
                        }else{
                            index -= 1;
                        }

                        self.moveTo(index,'prev');
                    }
                    
                });
            }

            //�������Բ��
            if(self.options.dotShow){
                ele.find(".slider-dot i").on('mouseover',  function(event) {
                    event.preventDefault();
                    
                    if(self.clickable){
                        var dotIndex = $(this).data('index');
                        if(dotIndex > index){
                            dir = 'next';
                        }else{
                            dir = 'prev';
                        }
                        if(dotIndex != index){
                            index = dotIndex;
                            self.moveTo(index, dir);
                        }
                    }
                });
            }
            //������ֵ���
            if(self.options.navShow){
                ele.parent().find(".slider-nav a").on('mouseover',  function(event) {
                    event.preventDefault();
                    if(self.clickable){
                        var navIndex = $(this).data('index');
                        if(navIndex > index){
                            dir = 'next';
                        }else{
                            dir = 'prev';
                        }
                        if(navIndex != index){
                            index = navIndex;
                            self.moveTo(index, dir);
                        }
                    }
                });
            }

            //�Զ�����
            if(self.options.autoPlay){
                var timer;
                var play = function(){
                    index++;
                    if(index > hwsliderSize){
                        index = 1;
                    }
                    self.moveTo(index, 'next');
                }
                timer = setInterval(play, self.options.interval); //���ö�ʱ��

                //��껬��ʱ��ͣ
                ele.hover(function() {
                    timer = clearInterval(timer);
                }, function() {
                    timer = setInterval(play, self.options.interval);
                });
            };

            //��������
            if(self.options.touch){
                hwsliderLi.on({
                    //���ؿ�ʼ
                    'touchstart': function(e) {
                        touchStartY = e.originalEvent.touches[0].clientY;
                        touchStartX = e.originalEvent.touches[0].clientX;
                    },

                    //���ؽ���
                    'touchend': function(e) {
                        var touchEndY = e.originalEvent.changedTouches[0].clientY,
                            touchEndX = e.originalEvent.changedTouches[0].clientX,
                            yDiff = touchStartY - touchEndY,
                            xDiff = touchStartX - touchEndX;

                        
                        //�жϻ�������
                        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
                            if ( xDiff > 5 ) {
                                if(index >= hwsliderSize){
                                    index = 1;
                                }else{
                                    index += 1;
                                }
                                self.moveTo(index,'next');
                            } else {
                                if(index == 1){
                                    index = hwsliderSize;
                                }else{
                                    index -= 1;
                                }
                                self.moveTo(index,'prev');
                            }                       
                        }
                        touchStartY = null;
                        touchStartX = null;
                    },

                    //�����ƶ�
                    'touchmove': function(e) {
                        if(e.preventDefault) { e.preventDefault(); }

                    }
                });
            }
        },

        //�����ƶ�
        moveTo: function(index,dir){ 
            var self = this,
                ele = self.$element;
            var clickable = self.clickable;
            var dots = ele.find(".slider-dot i");
            var navEls = ele.parent().find(".slider-nav a");
            var sliderInder = ele.children('ul');
            var hwsliderLi = sliderInder.children('li');
            
            if(clickable){
                self.clickable = false;
                
                if(self.options.effect == 'fade'){
					if(self.options.fadeOut == true){
						sliderInder.children('.cur').fadeOut(function() {
							$(this).removeClass('cur');
						});
					} else {
						sliderInder.children('.cur').hide().removeClass('cur');
					}
                    
                    hwsliderLi.eq(index-1).fadeIn(function() {
						$(this).addClass('cur');
                        self.clickable = true;
                    });
                } else {
                
                    //λ�ƾ���
                    var offset = ele.width();
                    if(dir == 'prev'){
                        offset = -1*offset;
                    }
                    //��ǰ���鶯��
                    sliderInder.children('.cur').stop().animate({
                        left: -offset},
                        self.options.speed,
                         function() {
                            $(this).removeClass('cur');
                    });
                    //��һ�����鶯��
                    hwsliderLi.eq(index-1).css('left', offset + 'px').addClass('cur').stop().animate({
                        left: 0}, 
                        self.options.speed,
                        function(){
                            self.clickable = true;
                    });
                }

                self.options.afterSlider.call(self);
                //��ʾ���л���Բ��
                dots.removeClass('cur');
                dots.eq(index-1).addClass('cur');
                navEls.removeClass('cur');
                navEls.eq(index-1).addClass('cur');
                
            }else{
                return false;
            }
        }
        
    }
    

    $.fn.hwSlider = function(options) {
        var hwSlider = new HwSlider(this, options);
        return this.each(function () {
            hwSlider.init();
        });
    };
})(jQuery, window, document);