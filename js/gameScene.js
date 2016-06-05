	var GameScene = Hilo.Class.create({
	    Extends: Hilo.Container,
	    constructor: function(properties){
	        GameScene.superclass.constructor.call(this, properties);
	    },
	    count: 0,
	    timer: null,
	    packCount: 5,
	    start: function(properties) {
	    	var stage = this.getStage();
	    	var $winWidth = stage.width,
	    		$winHeight = stage.height;

			var countText = new Hilo.Text({ color: '#000', text: this.count });
			countText.x = $winWidth - 20;
			countText.y = 50;
			this.addChild(countText);

			var slogan = ['汉', '腾', '汽', '车', '粽', '享', '端', '午'];
			
			var $liArr = $('.light-box li');
			var _this = this;
			var createPack = function() {
				[1, 1,1,1].forEach(function() {
					_this.makeBird($liArr, slogan);
				});
			};
			createPack();
			this.timer = setInterval(createPack, 1000);
			$(document).on('touchstart', function(event) {
				event.preventDefault();
			});
	    },
	    makeBird: function($liArr, slogan) {
	    	var stage = this.getStage();
	    	var $winWidth = stage.width,
	    		$winHeight = stage.height;
	    	var _this = this;
	    	var bird = new Hilo.Bitmap({
				image: 'images/zongzi.png',
				rect: [0, 0, 55, 56]
			});
			// 随机
			if(~~(Math.random() * 10) % 5 == 0) {
				bird.drawable.rect = [0, 56, 55, 56];
				bird.isIcon = true;
				if(~~(Math.random() * 10) % 2 == 0) {
					// bird.drawable.rect = [0, 56, 55, 56];
					bird.isPack = true;
					bird.isIcon = false;
				}
			}

			_this.addChild(bird);
			
			var right = ~~( Math.random() * $winWidth - Math.random() * 30)
			var top = ~~( Math.random() * 30 - Math.random() * 200);
			bird.x = right;
			bird.y = top;
			// 点击
			bird.on(Hilo.event.POINTER_START, function(e) {
				bird.drawable.rect = [0, 114, 55, 56];

				if(bird.isIcon) {
					if(_this.count < 8) {
						// var fontIcon = new Container({

						// });
						// var textIcon = new Hilo.Text({
						// 	text: '汗',
						// 	textAlign: 'center',
						// 	textVAlign: 'middle',
						// 	textWidth: 55,
						// 	textHeight: 56,
						// 	background: 'red',
						// 	x: bird.x,
						// 	y: bird.y
						// });
						// textIcon.rotation = 30;
						// textIcon.setFont('font-size: 14px;');
						// 
						
						var node = $('<div class="text-icon" />').text(slogan[_this.count]);
						var textIcon = new Hilo.DOMElement({
							element: node[0],
							width: 24,
							height: 24,
							x: bird.x,
							y: bird.y
						});
						textIcon.rotation = 15;
						_this.addChild(textIcon);

						var $target = $($liArr.get(_this.count)),
							offset = $target.offset();
						_this.count++;
						// 动画结束
						var teen = Hilo.Tween.to(textIcon, { x: offset.left, y: offset.top }, { duration: 1000, ease: Ease.Quart, onComplete: function() {
							_this.removeChild(textIcon);
							$target.addClass('active');

							if(_this.count == 8) {
								clearInterval(_this.timer);
								_this.removeAllChildren();
								// 清零
								_this.count = 0;
								// 
								$(document).off('touchstart');
							}
						}});
					}
				}
				else if(bird.isPack && _this.packCount > 0) {
					bird.setImage( 'images/pack.png', [0, 0, 29, 35]);
					_this.packCount--;
					var $packCount = $('#pack-count');
					$packCount.text(~~($packCount.text()) + 1);
				}
				else {
					setTimeout(function() {
						_this.removeChild(bird);
					}, 300);
				}
			});
			// 动画结束
			var teen = Hilo.Tween.to(bird, { x: (right - Math.random() * $winWidth), y: $winHeight + 20 }, { duration: 4000, onComplete: function() {
				_this.removeChild(bird);
			}});
	    }
	});
