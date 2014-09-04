var JsonTx = [];


$(document).ready(function() {

	function Limpiar () {
		$("#menu li").each(function( index ) {
			$(this).removeClass('active');
		});
	}

	$('#menu li').click(function (e) {
		var clase = $(this).attr('class')
		Limpiar();
		$(this).addClass('active');
	})

	$('.multi').click(function() {
		// body...
		var control = $(this).val();
		var valor = $(this).attr("name");
		var pos = valor.search("_");
		var nom = valor.substring(0,pos);
		var temp = valor.substring(pos+1);

		if (control == 1) {
			$('#mymodal').modal('show');
			var tx = Tratamiento(nom);
			CreaRow();
			Validar(tx,temp);
		};
	});

	$('#GuardarModal').click(function() {
		var tx = $('#tratamiento').val();
		var temp = $('#temp').val();
		var dosis = $('#dosis').val();
		var ciclo = $('#ciclo').val();
		var inter = $('#intervalos').val();
		var ciclos = $('#ciclos').val();
		var cateter = $('#cateterismo').is(':checked');

		//var arr = [tx + "_" + temp];
		var nuevo = {"tx":tx,"temp":temp,"dosis":dosis,"ciclo":ciclo,"inter":inter,"ciclos":ciclos,"cateter":cateter};
		//arr.push(nuevo);
		JsonTx.push(nuevo);

		EliminaRow('temporal');
		$("#valores").val(JSON.stringify(JsonTx));
		$('#mymodal').modal('hide')


	});
	$('#CierraModal').click(function() {
		// body...
		EliminaRow('temporal');
	});

});


function botones(valor) {
	if (valor) {
		$('#btn_guardar').prop("disabled", true);
		$('#btn_siguiente').prop("disabled", false);
	}else{
		$('#btn_guardar').prop("disabled", false);
		$('#btn_siguiente').prop("disabled", false);
	};
}

function Deshabilita(valor) {
	// body...
	if (valor) {
		$.each($('input'),function(){
			$(this).prop("disabled", true);
		});
		$('#btn_siguiente').prop("disabled", false);
	}else{
		$.each($('input'),function(){
			$(this).prop("disabled", false);
		});
		$('#btn_siguiente').prop("disabled", true);
	};
}

function Tratamiento(nom) {

	var tx
	var tratamientos = {
						'keto':'Ketoconazol',
						'caber':'Cabergolina',
						'mife':'Mifepristona',
						'metfo':'Metforminas',
						'sulfo':'Sulfonilureas',
						'tiazo':'Tiazolidinedionas',
						'dpp4':'Inhibidores DPP-4',
						'glp1':'Análogos del GLP-1',
						'insu_rapida':'Insulinas de acción rápida',
						'insu_lenta':'Insulinas de acción lenta',
						'ieca':'Inhibidores enzima convertidora angiotensina',
						'bra':'Bloqueadores receptores de la angiotensina',
						'beta_bloq':'Beta bloqueadores',
						'fibratos':'Fibratos',
						'bcc':'Bloqueadores de los canales de calcio',
						'diuretico':'Diurético',
						'iac':'Inhibidores de la absorción del colesterol',
						'vit':'Niacina (Vitamina B3)',
						'nitrato':'Nitratos',
						'antiplaq':'Antiplaquetarios',
						'acido_acetil':'Ácido acetilsalicílico',
						'estatina':'Estatinas',
						'sab':'Secuestrantes de ácidos biliares (resinas)'
					}

	if (tratamientos[nom] == undefined) {
		var id = "#id_" + nom + "_cual";
		console.log(id);
		tx = $(id).val();
	}else{
		tx = tratamientos[nom];
	};
	return tx
}

function CreaRow(tx,temp) {

	$("#tratamientos").find('tbody')
	.append($('<tr>')
		.attr('id','temporal')
		//Input de tratamiento
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'tratamiento',
					disabled: 'disabled',
					class: 'tratamiento'
				})
			)
		)
		//Input de temporalidad
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'temp',
					disabled: 'disabled',
					class: 'habilitado'
				})
			)
		)
		//Input de dosis
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'dosis',
					class: 'habilitado'
				})
			)
		)
		//Input de ciclo
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'ciclo',
					class: 'habilitado'
				})
			)
		)
		//Input de intervalos
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'intervalos',
					class: 'habilitado'
				})
			)
		)
		//Input de ciclos
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'ciclos',
					class: 'habilitado'
				})
			)
		)
		//Input de cateterismo
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'checkbox',
					id: 'cateterismo',
					class: 'habilitado'
				})
			)
		)
	);
}

function NewRow(tx,temp) {
	// body...
	$('#tratamiento').val(tx);
	$('#temp').val(temp);
}

function ExistRow(array) {
	// body...
	$('#tratamiento').val(array.tx);
	$('#temp').val(array.temp);
	$('#dosis').val(array.dosis);
	$('#ciclo').val(array.ciclo);
	$('#intervalos').val(array.inter);
	$('#ciclos').val(array.ciclos);
	$('#cateterismo').attr('checked',array.cateter);
}

function EliminaRow(id) {
	// body...
	var tabla = document.getElementById(id).parentNode;
	tabla.removeChild(document.getElementById(id));
}

function Validar(tx,temp) {
	// body...
	var vacio = Object.keys(JsonTx).length
	if (vacio != 0) {
		for (var key in JsonTx) {
			if (JsonTx[key].tx == tx && JsonTx[key].temp == temp) {
				ExistRow(JsonTx[key]);
			}else{
				NewRow(tx,temp);
			};
		};
	}else{
		NewRow(tx,temp);
	};
}

function Start() {
	window.location.href='/entrevistado';
}