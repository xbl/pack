	var GameScene = Hilo.Class.create({
	    Extends: Hilo.Container,
	    constructor: function(properties){
	        GameScene.superclass.constructor.call(this, properties);
	    },
	    count: 0,
	    timer: null,
	    packCount: 8,
	    start: function(properties) {
	    	var stage = this.getStage();
	    	var $winWidth = stage.width,
	    		$winHeight = stage.height;

			var countText = new Hilo.Text({ color: '#000', text: this.count });
			countText.x = $winWidth - 20;
			countText.y = 50;
			this.addChild(countText);

			
			var $liArr = $('.light-box li');
			var _this = this;
			var createPack = function() {
				[1, 1,1,1].forEach(function() {
					_this.makeBird($liArr);
				});
			};
			createPack();
			this.timer = setInterval(createPack, 1000);
			$(document).on('touchstart', function(event) {
				event.preventDefault();
			});
	    },
	    makeBird: function($liArr) {
	    	var stage = this.getStage();
	    	var $winWidth = stage.width,
	    		$winHeight = stage.height;
	    	var _this = this;
	    	var bird = new Hilo.Bitmap({
				image: 'images/zongzi.png',
				rect: [0, 0, 55, 56]
			});
			// 随机
			if(~~(Math.random() * 10) % 3 == 0) {
				bird.drawable.rect = [0, 56, 55, 56];
				bird.isPack = true;
			}
			_this.addChild(bird);
			
			var right = ~~( Math.random() * $winWidth - Math.random() * 30)
			var top = ~~( Math.random() * 30 - Math.random() * 200);
			bird.x = right;
			bird.y = top;
			// 点击
			bird.on(Hilo.event.POINTER_START, function(e) {
				bird.drawable.rect = [0, 114, 55, 56];
				setTimeout(function() {
					_this.removeChild(bird);
				}, 300);
				if(!bird.isPack)
					return ;
				if(_this.count < 8) {
					$($liArr.get(_this.count)).addClass('active');
					_this.count++;
					if(_this.count == 8) {
						clearInterval(_this.timer);
						_this.removeAllChildren();
						// 清零
						_this.count = 0;
						// 
						$(document).off('touchstart');
					}
				}
			});
			// 动画结束
			var teen = Hilo.Tween.to(bird, { x: (right - Math.random() * $winWidth), y: $winHeight + 20 }, { duration: 4000, onComplete: function() {
				_this.removeChild(bird);
			}});
	    }
	});
