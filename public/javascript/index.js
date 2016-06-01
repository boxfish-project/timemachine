$(function(){
	
	var opts = {
		showBoxs: {
			yearsBox: $('#years'),
			monthsBox: $('#months'),
			daysBox: $('#days'),
			hoursBox: $('#hours'),
			minutesBox: $('#minutes'),
			secondsBox: $('#seconds')
		}
	};
	var travelEntity = new Travel(opts);

	$.ajax({
		url: '/time',
		method: 'GET',
		dataType: 'JSON',
		success: function(data){
			var timeStamp = data.date;
			travelEntity.init(timeStamp);
			travelEntity.countTime();
		},
		error:function(data){
			alert(data);
		}
	});
	// travelEntity.init(1464968598251);
	// travelEntity.countTime();

	$('.show-box').keydown(function(e){
		if (e.keyCode == 13) {
			return false;
		}
	});
	$('.show-box').focus(function(){
		travelEntity.stop();
		$('#tip').hide();
		$('#frozen').show();
	});	

	$('.show-box').blur(function(){
		var strategy = $(this).data('strategy');
		var right = !/[^0-9]/.test($(this).text());
		var val = parseInt($(this).text());

		switch (strategy){
			case 'years':
				if (!/^\d{4}$/.test(val)) {
					right = false;
				}
				break;
			case 'months':
				if (!/^((0)?[1-9]|1[0-2])$/.test(val)) {
					right = false;
				}
				break;
			case 'days':
				if (!/^((0)?[1-9]|[1-2][0-9]|3[0-1])$/.test(val)) {
					right = false
				}
				break;
			case 'hours':
				if (!/^((0)?[0-9]|1[0-9]|2[0-3])$/.test(val)) {
					right = false
				}
				break;
			case 'minutes':
				if (!/^((0)?[0-9]|[1-5][0-9])$/.test(val)) {
					right = false
				}
				break;
		}

		if (!right) {
			$(this).addClass('wrong');
		}else{
			$(this).removeClass('wrong');
			$('#travel-btn').show();
		}
	});

	$('#travel-btn').click(function(){
		travelEntity.stop()
		var timeStamp = travelEntity.getTimeStamp();
		$.ajax({
			url: '/time',
			method: 'POST',
			data: {date:timeStamp},
			success: function(data){
				$('#tip').show();
				$('#frozen').hide();
				travelEntity.timeStamp = data.date;
				travelEntity.countTime();
			}
		});
	})

});
function Travel(opts){
	this.showBoxs = opts.showBoxs;
	this.years = '';
	this.months = '';
	this.days = '';
	this.hours = '';
	this.minutes = '';
	this.seconds = '';
	this.lastTime = (new Date()).getTime();
	this.timer = null;
}

Travel.prototype = {
	init: function(timeStamp){
		this.getTime(timeStamp);
		this.updateShowBox();
	},
	getTime: function(timeStamp){
		var newDate = new Date(timeStamp);
		this.timeStamp = timeStamp;
		this.updateTime(newDate);
	},
	getTimeStamp: function(){
		var tmp = this.years + '-' + this.months + '-' + this.days + " " + this.hours + ':' + this.minutes + ':' + this.seconds;
		return (new Date(tmp)).getTime();
	},
	countTime: function(){
		var now = this.now();
		this.timeStamp += (now - this.lastTime);
		var newDate = new Date(this.timeStamp);
		this.lastTime = this.now();
		this.updateTime(newDate);
		this.updateShowBox();
		this.stop();
		this.timer = setInterval(this.countTime.bind(this),1000);
	},
	updateTime: function(newDate){
		this.years = newDate.getFullYear();
		this.months = newDate.getMonth() + 1;
		this.days = newDate.getDate();
		this.hours = newDate.getHours();
		this.minutes = newDate.getMinutes();
		this.seconds = newDate.getSeconds();
	},
	updateShowBox: function(){
		var vm = this;
		this.showBoxs.yearsBox.html(vm.years);
		this.showBoxs.monthsBox.html(vm.months);
		this.showBoxs.daysBox.html(vm.days);
		this.showBoxs.hoursBox.html(vm.hours);
		this.showBoxs.minutesBox.html(vm.minutes);
		this.showBoxs.secondsBox.html(vm.seconds);
	},
	stop: function(){
		clearInterval(this.timer);
	},
	now: function(){
		return (new Date()).getTime();
	}
}