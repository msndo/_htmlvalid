(function($) {
	// ============================================================= Main Routine
	$(function() {
		var $elemList = $('#list-url');

		// 「バリデーション」ボタン動作
		$elemList.find('.bt-submit-validation').getHtmlValidtion().triggerMarkCurrentRow();

		// 「すべてのエラーを受信」動作
		$('#ctrl-condition-allerror .ctrl-checkbox').toggleModeShowAllError();

		// 連続バリデーション送信 初期化
		bindMovementAutoTrigger();
	});

	// ============================================================= Sub Routines - Screen & UI Function
	$.fn.toggleModeShowAllError = function(options) {
		var settings = {
			nameDataAttr: 'data-status-ctrl',
			classnameContextActv: 'condition-allerror-actv',
			$elemHoldContext: $('body')
		};
		$.extend(settings, options);

		var $elemCtrl = this;

		$elemCtrl.on('click.toggleStatus', function(ev) {
			var settings = {
				nameDataAttr: 'data-status-ctrl',
				classnameContextActv: 'condition-allerror-actv',
				$elemHoldContext: $('body')
			};

			ev.stopPropagation();
			var $listElemCtrl = $(this);

			$listElemCtrl.each(function() {
				var $elemCtrl = $(this);
				var domElemCtrl = $elemCtrl.get(0);
				var statusCtrl = domElemCtrl.getAttribute(settings.nameDataAttr);

				if(statusCtrl == 'inact') {
					domElemCtrl.setAttribute(settings.nameDataAttr, 'actv');
					settings.$elemHoldContext.addClass(settings.classnameContextActv);
				}
				else {
					domElemCtrl.setAttribute(settings.nameDataAttr, 'inact');
					settings.$elemHoldContext.removeClass(settings.classnameContextActv);
				}
			});

			return false;
		});

		return this;
	};

	$.fn.triggerMarkCurrentRow = function() {
		var classnameClicked  = 'current-selected';
		var $elemList = $('#list-url');

		var $listElemCtrl = this;

		$listElemCtrl.each(function(ix) {
			var $elemCtrl = $(this);
			$elemCtrl.on('click.markClicked', function(ev) {
				var $elemCtrl = $(this);
				var $elemRow = $elemCtrl.closest('tr');

				$elemCtrl.markCurrentRow({ $elemRange: $elemList, classnameClicked: classnameClicked });
				$elemList.find('.' + classnameClicked).removeClass(classnameClicked);
				$elemRow.addClass(classnameClicked);
			});
		})

		return this;
	}

	$.fn.markCurrentRow = function(options) {
		var settings = {
			$elemRange: null,
			classnameClicked: 'current-selected'
		};
		$.extend(settings, options);

		var $elemCtrl = this;
		var $elemRow = $elemCtrl.closest('tr');

		settings.$elemRange.find('.' + settings.classnameClicked).removeClass(settings.classnameClicked);
		$elemRow.addClass(settings.classnameClicked);

		return this;
	}

	function bindMovementAutoTrigger(options) {
		var settings = {
			intervalAutoTrigger: 2500,
			durationFade: 300,
			classnameStatusInUse: 'in-use'
		}

		$('#toggle-ctrl-autotrigger').on('click.toggle', function(ev) {
			ev.stopPropagation();

			$('.section-menu-transport').fadeOut(settings.durationFade, function() {
				var $elemTarg = $(this).closest('th').find('.section-ctrl-autotrigger').first();
				$elemTarg.slideToggle();
			});

			return false;
		});

		var $listBtTarget = $('#list-url tbody .col-submit .bt-submit-validation');

		// 開始コントロール
		var $elemBtStartOnAll = $('.section-menu-start-on-all');
		var $listElemBtStartFromSelected = $('.ctrl-autotrigger-from');

		// 終了・中断コントロール
		var $elemMenuTransport = $elemBtStartOnAll.closest('.section-ctrl-autotrigger').find('.section-menu-transport');
		var $elemCtrlStart = $elemMenuTransport.find('.section-menu-start a');
		var $elemCtrlPause = $elemMenuTransport.find('.section-menu-pause a');
		var $elemCtrlBreak = $elemMenuTransport.find('.section-menu-break a');
		var $seriesElemCtrl = $elemCtrlStart.add($elemCtrlPause).add($elemCtrlBreak);

		// ループ制御 共用リスト
		var loopCtrl = { ixLoop: 0, timer: null };

		// Bind実行
		// 'Validate All'
		$elemBtStartOnAll.on('click.start', function() {
			var $elemTrigger = $(this);
			loopCtrl['ixLoop'] = 0;
			bindMovementAutoTrigger($elemTrigger, loopCtrl);
		});
		// '連続' 途中からループ
		$listElemBtStartFromSelected.on('click.start', function() {
			var $elemTrigger = $(this);
			loopCtrl['ixLoop'] = $listElemBtStartFromSelected.index(this);
			bindMovementAutoTrigger($elemTrigger, loopCtrl);
		});

		// 再生停止パネル
		$elemCtrlStart.on('click.start', function() {
			if($(this).hasClass(settings.classnameStatusInUse)) { return; }

			clearTimeout(loopCtrl['timer']);
			$seriesElemCtrl.removeClass(settings.classnameStatusInUse);

			$(this).addClass(settings.classnameStatusInUse);	
			startAutoTirgger($listBtTarget, loopCtrl, $elemMenuTransport);
		});
		$elemCtrlPause.on('click.pause', function() {
			$seriesElemCtrl.removeClass(settings.classnameStatusInUse);
			$(this).addClass(settings.classnameStatusInUse);
			clearTimeout(loopCtrl['timer']);
			$elemMenuTransport.fadeOutWithWait();
		});
		$elemCtrlBreak.on('click.break', function() {
			$seriesElemCtrl.removeClass(settings.classnameStatusInUse);
			$(this).addClass(settings.classnameStatusInUse);
			clearTimeout(loopCtrl['timer']);
			loopCtrl['ixLoop'] = 0;
			$elemMenuTransport.fadeOutWithWait();
		});

		function bindMovementAutoTrigger($elemTrigger, loopCtrl) {
			clearTimeout(loopCtrl.timer);

			$seriesElemCtrl.removeClass(settings.classnameStatusInUse);
			$elemCtrlStart.addClass(settings.classnameStatusInUse);

			$elemMenuTransport.fadeIn(settings.durationFade, (function() {
				startAutoTirgger($listBtTarget, loopCtrl, $elemMenuTransport);
			}));
		}

		function startAutoTirgger($listBtTarget, loopCtrl, $elemMenuTransport) {
			// 初回
			$listBtTarget.eq(loopCtrl['ixLoop']).trigger('click');
			loopCtrl['ixLoop'] ++;

			loopCtrl['timer'] = setInterval(function() {
				if(loopCtrl['ixLoop'] >= $listBtTarget.length) {
					$elemMenuTransport.fadeOut(settings.durationFade);
					clearTimeout(loopCtrl['timer']);
					return false;
				}

				$listBtTarget.eq(loopCtrl['ixLoop']).trigger('click');

				loopCtrl['ixLoop'] ++;
			}, settings.intervalAutoTrigger);
		}
	}

	function buildMessageIgnore(listMessageIgnoreOverride) {
		var listMessageIgnore = confGlobal['listMessageIgnore'];
		$.extend(listMessageIgnoreOverride, listMessageIgnore);

		if($('#ctrl-condition-allerror').find('.ctrl-checkbox').first().get(0).getAttribute('data-status-ctrl') === 'actv') {
			listMessageIgnore = [];
		}
		return listMessageIgnore;
	}

	$.fn.getHtmlValidtion = function(options) {
		var responseValidation;
		var settings = {
		};
		$.extend(settings, options);

		var $listElemCtrl = $(this);
		$listElemCtrl.each(function() {
			$(this).triggerGetHtmlValidation();
		});

		return this;
	}

	// レポート取得開始
	$.fn.triggerGetHtmlValidation = function(options) {
		var settings = {
			urlGateway: './gw.php'
		};
		$.extend(settings, options);

		var $elemTrigger = this;
		$elemTrigger.on('click.startValidation', function(ev) {
			var $elemCtrl = $(this);
			var $elemContainer = $elemCtrl.closest('tr');
			var urlTarg = $elemContainer.find('.col-data').text();
			var contentHtml;
			var $elemRenderHtmlResult = $elemCtrl.closest('tr').find('.col-result');

			showIconLoading();
			$elemRenderHtmlResult.movementGetHtmlValidation({ $elemContainer: $elemContainer, urlTarg: urlTarg, urlGateway: settings.urlGateway });
		});
	};

	$.fn.movementGetHtmlValidation = function(options) {
		var settings = {
			$elemContainer: null,
			urlTarg: '',
			urlGateway: ''
		};
		$.extend(settings, options);

		$elemRenderHtmlResult = this;

		var defr = $.Deferred();

		$.ajax({
			type: 'GET',
			url: settings.urlGateway + '?url=' + settings.urlTarg,
			dataType: 'html',
			success: function(data) {
				getValidationReport(data).done(function(result) {
					hideIconLoading();
					responseValidation = result;
					renderHtmlResultValidation(responseValidation, $elemRenderHtmlResult);
					scrollToElemDest($elemRenderHtmlResult);
					defr.resolve();
				}).
				error(function() {
					$elemRenderHtmlResult.text('Connection Error or Server Error: Failed to Recieve Validation Response.');
					hideIconLoading();
					scrollToElemDest($elemRenderHtmlResult);
					defr.reject();
				});
			}
		});

		return defr.promise();
	};

	function renderHtmlResultValidation(listResultSrc, $cellDest, listMessageIgnoreOverride) {
		var listResult = contentForHtmlResultValidation(listResultSrc, listMessageIgnoreOverride);

		var tmplHtmlList = '<ul class="list-result-validation">__contentRecord__</ul>';
		var tmplHtmlRecord = '<li class="status-__type__"><span class="indication indication-ix">__ix__</span><span class="indication indication-status">__type__</span><span class="indication">__message__</span></li>'

		var htmlContentList = '';
		$.each(listResult, function(ix, result) {
			var htmlRecord = tmplHtmlRecord;

			htmlRecord = htmlRecord.replace(/__ix__/g, ix + 1); // 連番部

			$.each(result, function(keyResult, valueResult) { // 明細部
				var regexpCondMatch = new RegExp('__' + keyResult + '__', 'g');
				htmlRecord = htmlRecord.replace(regexpCondMatch, valueResult ? escapeEntities(valueResult.toString()) : '-');
			});

			htmlContentList = htmlContentList + htmlRecord;
		})

		$cellDest.html(tmplHtmlList.replace(/__contentRecord__/g, htmlContentList));
	}

	// レポート結果表示用のデータを構築する。無視メッセージリストが有効であればその分は結果表示対象から除外。
	function contentForHtmlResultValidation(listResultSrc, listMessageIgnoreOverride) {
		var listResult = [];

		var listMessageIgnore = buildMessageIgnore(listMessageIgnoreOverride);

		if(listMessageIgnore.length) {
			$.each(listResultSrc['messages'], function(ix, result) {
				var countMatch = 0;

				$.each(listMessageIgnore, function(ix, messageIgnore) {
					var regexp = messageIgnore;

					if(result['message'] === (regexp)) {
						countMatch ++;
					}
				});

				if(countMatch <= 0) { listResult.push(result); }
			});
		}
		else {
			listResult = listResultSrc['messages'];
		}

		if(! listResult.length) {
			listResult = [{
				'type': 'NORM',
				'message': '0 Errors/Warnings'
			}];
		}

		return listResult;
	}

	function getValidationReport(html) {

		return $.ajax({
			type: 'POST',
			url: confGlobal['urlValidator'],
			contentType: 'text/html; charset=utf-8',
			data: html,
			dataType: 'json'
		});
	}

	// ============================================================= Sub Routines - Utility
	function scrollToElemDest($elemDest) {
		var settings = {
			offsetMarginTop: 150,
			durationScroll: 700
		};
		var locationHorizDest = $elemDest.offset().top  - settings.offsetMarginTop;
		$('html, body').animate({ scrollTop: locationHorizDest + 'px' }, settings.durationScroll, 'easeOutExpo')

		// マウスホイール割り込みがあればスクロール停止
		var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).on(mousewheelevent,function(e){
			$('html, body').stop();
		});
	};

	$.fn.fadeOutWithWait = function(options) {
		var settings = {
			timeWait: 2000,
			timeFade: 300
		}
		$.extend(settings, options);

		$elemTarg = this;

		setTimeout(function() { $elemTarg.fadeOut(settings.timeFade); }, settings.timeWait);

		return this;
	}

	function showIconLoading() {
		var $elemIconLoading = $('.section-icon-loading').first();
		var $domElemTarg = $('body').get(0);

		if(! $domElemTarg.getAttribute('data-count_connection')) { $domElemTarg.setAttribute('data-count_connection', 0); }
		$domElemTarg.setAttribute('data-count_connection', Number($domElemTarg.getAttribute('data-count_connection')) + 1);
		$elemIconLoading.show();
	}
	function hideIconLoading() {
		var $elemIconLoading = $('.section-icon-loading').first();
		var $domElemTarg = $('body').get(0);

		$domElemTarg.setAttribute('data-count_connection',  Number($domElemTarg.getAttribute('data-count_connection')) - 1);
		if(Number($domElemTarg.getAttribute('data-count_connection')) <= 0) {
			$elemIconLoading.hide();
		}
	}

	function escapeEntities(html) {
		var TABLE_FOR_ESCAPE_HTML = {
			"&": "&amp;",
 			"\"": "&quot;",
 			"<": "&lt;",
 			">": "&gt;"
  		};

		return html.replace(/[&"<>]/g, function(match) {
			return TABLE_FOR_ESCAPE_HTML[match];
		});
	}
})(jQuery);
