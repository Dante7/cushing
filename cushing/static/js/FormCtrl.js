$(document).ready(function() {

	function Limpiar () {
		$("#menu li").each(function( index ) {
			$(this).removeClass('active');
		});
	}

	$('#menu li').click(function (e) {
		var clase = $(this).attr('class')
		alert($(this).attr('class'));
		Limpiar();
		if (clase != 'disabled') {
			$(this).addClass('active');
		};
	});


	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '<Ant',
		nextText: 'Sig>',
		currentText: 'Hoy',
		monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
		dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};

	$.datepicker.setDefaults($.datepicker.regional['es']);
	$(function () {
		$("#fecha").datepicker();
	});

	$.datepicker.setDefaults( $.datepicker.regional[ "es" ] );
	$( "#id_fecha_diag" ).datepicker({ 
		dateFormat: "dd/mm/yy",
		changeMonth: true,
		changeYear: true
	});

	$( "#id_fecha_llenado" ).datepicker({ 
		dateFormat: "dd/mm/yy",
		changeMonth: true,
		changeYear: true
	});

	
	$('#id_folio_principal').NumBox({type: 'integer'});
});