	var GameScene = Hilo.Class.create({
	    Extends: Hilo.Container,
	    constructor: function(properties){
	        GameScene.superclass.constructor.call(this, properties);
	    },
	    count: 0,
	    timer: null,
	    packCount: 5,
	    startTime: 0,
	    useTime: 0,
	    start: function(properties) {
	    	var stage = this.getStage();
	    	var $winWidth = stage.width,
	    		$winHeight = stage.height;

			var slogan = ['汉', '腾', '汽', '车', '粽', '享', '端', '午'];
			
			var $liArr = $('.light-box li'),
				$packCount = $('#pack-count');
			// 初始化红包数
			$packCount.text(0);
			// 初始化下面图标点亮状态
			$liArr.removeClass('active');

			var _this = this;
			_this.startTime = performance.now();
			var createPack = function() {
				[1, 1].forEach(function() {
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
				rect: [0, 0, 109, 113]
			});

	    	bird.width = 70;
	    	bird.height = 73;

			// 随机
			if(~~(Math.random() * 10) % 5 == 0) {
				bird.drawable.rect = [0, 113, 109, 113];
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
				bird.drawable.rect = [0, 226, 109, 113];

				if(bird.isIcon) {
					setTimeout(function() {
						_this.removeChild(bird);
					}, 300);
					if(_this.count < 8) {
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
						var teen = Hilo.Tween.to(textIcon, { x: offset.left, y: offset.top }, { duration: 1000, onComplete: function() {
							_this.removeChild(textIcon);
							$target.addClass('active');

							if(_this.count == 8) {
								_this.onGameOver();
							}
						}});
					}
				}
				else if(bird.isPack && _this.packCount > 0) {
					bird.setImage( 'images/pack.png', [0, 0, 62, 71]);
					bird.width = 31;
	    			bird.height = 35;
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
			// 飘动动画结束
			var teen = Hilo.Tween.to(bird, { y: $winHeight + 20 }, { duration: 4000, onComplete: function() {
				_this.removeChild(bird);
			}});
			// var teen = Hilo.Tween.to(bird, { x: (right - Math.random() * $winWidth), y: $winHeight + 20 }, { duration: 4000, onComplete: function() {
			// 	_this.removeChild(bird);
			// }});
	    },
	    onGameOver: function() {
	    	var _this = this;
	    	var useTime = ~~((performance.now() - _this.startTime) / 1000);
	    	_this.useTime = useTime;
	    	// 游戏结束
			clearInterval(_this.timer);
			_this.removeAllChildren();
			// 清零
			_this.count = 0;
			// 
			$(document).off('touchstart');
	    	$.getJSON('http://192.168.31.152:8360/packer/index/rank', {useTime: useTime}, function(json) {
	    		if(json.errno != 0)
	    			return alert(json.errmsg);
	    		// 
	    		$('#rank-number').text(json.data);
	    		if(json.data > 5) {
	    			$('#then1').hide();
	    			$('#then5').show();
	    		} else {
	    			var text = '';
	    			// 显示花费时间
	    			var second = ~~(useTime % 60);
	    			var minute = (useTime - second) / 60;
	    			minute && (text += minute + '分');
	    			second && (text += second + '秒');
	    			$('#useTime').text(text);
	    			$('#then1').show();
	    			$('#then5').hide();
	    		}
				$('.game-over-dialog').show();
				// $('.big-car').css('right', 0);
				
	    	});
	    	
	    }
	});
