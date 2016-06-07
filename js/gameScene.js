	var GameScene = Hilo.Class.create({
	    Extends: Hilo.Container,
	    constructor: function(properties){
	        GameScene.superclass.constructor.call(this, properties);
	    },
	    count: 0,
	    createBirdTimer: null,
	   	createPackTimer: null,
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
			this.createBirdTimer = setInterval(createPack, 1000);
			// 6秒钟创建带字的红包
			this.createPackTimer = setInterval(function() {

				_this.makeBird($liArr, slogan, false, true);
				[1,2,3].forEach(function() {
					setTimeout(function() {
						_this.makeBird($liArr, slogan, true, false);
					}, 200);
				});
			}, 6000);

			$(document).on('touchstart', function(event) {
				event.preventDefault();
			});
	    },
	    makeBird: function($liArr, slogan, isPack, isIcon) {
	    	var stage = this.getStage();
	    	var $winWidth = stage.width,
	    		$winHeight = stage.height;
	    	var _this = this;
	    	var bird = new Hilo.Bitmap({
				image: 'images/zongzi.png',
				rect: [0, 0, 109, 113]
			});

	    	bird.width = 65;
	    	bird.height = 67;
	    	// 如果是红包
	    	if(isPack) {
	    		bird.drawable.rect = [0, 113, 109, 113];
	    		bird.isPack = true;
	    	}
	    	// 点亮图标
	    	else if(isIcon) {
	    		bird.drawable.rect = [0, 113, 109, 113];
	    		bird.isIcon = true;
	    	}

			_this.addChild(bird);
			// 随机位置
			// var right = ~~( Math.random() * $winWidth - Math.random() * 30)
			var right = ~~( Math.random() * ($winWidth - bird.width));
			var top = ~~( Math.random() * 30 - Math.random() * 200);
			bird.x = right;
			bird.y = top;
			// 点击
			bird.on(Hilo.event.POINTER_START, function(e) {
				bird.drawable.rect = [0, 226, 109, 113];
				console.log(bird);
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
					var $packCount = $('#pack-count');
					// 随机钱数
					var tempMoney = 0;
					if(~~(Math.random() * 10) % 2 == 0) {
						tempMoney = 0.1;
					}
					else if(~~(Math.random() * 10) % 3 == 0) {
						tempMoney = 0.2;
					}
					else if(~~(Math.random() * 10) % 7 == 0) {
						tempMoney = 0.5;
					}
					_this.packCount -= tempMoney;
					$packCount.text((Number($packCount.text()) + tempMoney).toFixed(1));
				}
				else {
					setTimeout(function() {
						_this.removeChild(bird);
					}, 300);
				}
			});
			// 飘动动画结束
			var teen = Hilo.Tween.to(bird, { y: $winHeight + 20 }, { duration: 3000, onComplete: function() {
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
			clearInterval(_this.createBirdTimer);
			clearInterval(_this.createPackTimer);
			_this.removeAllChildren();
			// 清零
			_this.count = 0;
			// 
			$(document).off('touchstart');
	    	$.getJSON(window.baseUrl + '/packer/index/rank', {useTime: useTime}, function(json) {
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
	    	});
	    	
	    }
	});
