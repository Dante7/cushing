function Begin(msj, folio, usuario, espe) {
	// body...
	Deshabilita(msj);
	
	if (folio != 0) {
		$('#id_folio').val(folio);
		$('#id_folio_principal').val(folio);
	};

	if (usuario != 'capturista') {
		$('#id_monitor_clinico').val(usuario);
	};

	if (espe != 'espe') {
		$('#id_espe_medica').val(espe);
	};
}

function Deshabilita(valor) {
	// body...
	if (valor) {
		$.each($('input'),function(){
			$(this).prop("disabled", true);
		});
		$.each($('select'),function(){
			$(this).prop("disabled", true);
		});
		$('#btn_siguiente').prop("disabled", false);
	}else{
		$.each($('input'),function(){
			$(this).prop("disabled", false);
		});
		$.each($('select'),function(){
			$(this).prop("disabled", false);
		});
		$('#btn_siguiente').prop("disabled", true);
	};
}

$(document).ready(function() {

	//$('span').tooltip();

	function Limpiar () {
		$("#menu li").each(function( index ) {
			$(this).removeClass('active');
		});
	}

	$('#menu li').click(function (e) {
		var clase = $(this).attr('class')
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
	$( ".fecha" ).datepicker({ 
		dateFormat: "dd/mm/yy",
		changeMonth: true,
		changeYear: true
	});


	//Selcccion
	$('#id_tiempo_endo').NumBox({type: 'integer'});
	$('#id_cushing_actual_tx').NumBox({type: 'integer'});
	$('#id_cushing_cm_12m').NumBox({type: 'integer'});
	$('#id_examen_orina_2').NumBox({type: 'integer'});
	$('#id_examen_orina_1').NumBox({type: 'integer'});
	$('#id_examen_orina_0').NumBox({type: 'integer'});


	//control
	$('#id_control_alto').NumBox({type: 'integer'});
	$('#id_control_bajo').NumBox({type: 'integer'});
	$('#id_control_medio').NumBox({type: 'integer'});


	//laboratorio
	$('#id_psd_pruebas_6').NumBox({type: 'integer'});
	$('#id_psd_pruebas_12').NumBox({type: 'integer'});
	$('#id_acth_pruebas_6').NumBox({type: 'integer'});
	$('#id_acth_pruebas_12').NumBox({type: 'integer'});
	$('#id_metirapona_pruebas_6').NumBox({type: 'integer'});
	$('#id_metirapona_pruebas_12').NumBox({type: 'integer'});
	$('#id_crh_pruebas_6').NumBox({type: 'integer'});
	$('#id_crh_pruebas_12').NumBox({type: 'integer'});
	$('#id_seno_petroso_pruebas_6').NumBox({type: 'integer'});
	$('#id_seno_petroso_pruebas_12').NumBox({type: 'integer'});
	$('#id_tomografia_pruebas_6').NumBox({type: 'integer'});
	$('#id_tomografia_pruebas_12').NumBox({type: 'integer'});
	$('#id_res_magnetica_pruebas_6').NumBox({type: 'integer'});
	$('#id_res_magnetica_pruebas_12').NumBox({type: 'integer'});
	$('#id_otro1_pruebas_6').NumBox({type: 'integer'});
	$('#id_otro1_pruebas_12').NumBox({type: 'integer'});
	$('#id_otro2_pruebas_6').NumBox({type: 'integer'});
	$('#id_otro2_pruebas_12').NumBox({type: 'integer'});

	//generales
	$('#id_edad').NumBox({type: 'integer'});
	$('#id_peso').NumBox({type: 'integer'});
	$('#id_talla').NumBox({type: 'integer'});


	//intervenciones
	$('#id_rx_veces_6').NumBox({type: 'integer'});
	$('#id_radiocirugia_veces_6').NumBox({type: 'integer'});
	$('#id_cirugia_veces_6').NumBox({type: 'integer'});
	$('#id_adrena_veces_6').NumBox({type: 'integer'});
	$('#id_rx_veces_12').NumBox({type: 'integer'});
	$('#id_radiocirugia_veces_12').NumBox({type: 'integer'});
	$('#id_cirugia_veces_12').NumBox({type: 'integer'});
	$('#id_adrena_veces_12').NumBox({type: 'integer'});

	
});