var JsonTx = {}
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

		Tratamiento(nom,temp);

		if (control == 1) {
			$('#mymodal').modal();
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

		var nuevo = {
						'temporalidad' : temp,
						'dosis' : dosis,
						'ciclo': ciclo,
						'intervalos': inter,
						'ciclos': ciclos,
						'cateterismo': cateter
					}
		JsonTx[tx] = nuevo;
	});

});


function botones(valor) {
	if (valor) {
		$('#btn_guardar').prop("disabled", true);
		$('#btn_siguiente').prop("disabled", false);
	}else{
		$('#btn_guardar').prop("disabled", false);
		$('#btn_siguiente').prop("disabled", true);
	};
}

function Tratamiento(nom,temp) {

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

	if (tratamientos[nom] == '') {
		var id = "#id_" + nom + "_cual";
		tx = $(id).val();
	}else{
		tx = tratamientos[nom];
	};

	console.log(nom);

	$("#tratamientos").find('tbody')
	.append($('<tr>')
		//Input de tratamiento
		.append($('<td>')
			.append($('<input>')
				.attr({
					type:'text',
					id: 'tratamiento',
					disabled: 'disabled',
					class: 'tratamiento'
				})
				.val(tx)
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
				.val(temp)
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