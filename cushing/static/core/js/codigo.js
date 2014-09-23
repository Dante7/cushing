var JsonTx = [];
var JsonLab = [];

$(document).ready(function() {

	// Formulario de tratamientos

	$('.multi').click(function() {
		var control = $(this).val();
		var valor = $(this).attr("name");
		var pos = valor.search("_");
		var clase = valor.substring(0,pos);
		var valor = valor.substring(pos+1);
		var pos = valor.search("_");
		var nom = valor.substring(0,pos);
		var temp = valor.substring(pos+1);
		clase_str = ObtenClase(clase);
		var n_tx = $("#id_" + clase + "_" + nom + "_cuantos").val();
		if (n_tx == undefined) 
		{
			n_tx = 1; 
		};

		if (control == 1) {
			CreaRow(n_tx);
			var tx = Tratamiento(nom,clase);
			$('#TxModal').modal('show');
			Validar(clase_str,tx,temp);
		};
	});

	$('#GuardarModal').click(function() {
		//var hidden
		var clase = $('#clase').val();
		var tx = $('#tratamiento').val();
		var temp = $('#temp').val();
		//var no hidden
		var fecha = $('#fecha').val();
		var dosis = $('#dosis').val();
		var c_horas = $('#c_horas').val();
		var d_horas = $('#d_horas').val();
		var intervalos = $('#intervalos').val();
		var n_ciclos = $('#n_ciclos').val();

		var cateter = $('#cateterismo').is(':checked');

		//var arr = [tx + "_" + temp];
		var nuevo = {
					"clase":clase,
					"tx":tx,
					"temp":temp,
					"fecha":fecha,
					"dosis":dosis,
					"c_horas":c_horas,
					"d_horas":d_horas,
					"intervalos":intervalos,
					"n_ciclos":n_ciclos,
					"cateter":cateter
				};

		console.log(nuevo);
		//arr.push(nuevo);
		JsonTx.push(nuevo);

		$("#id_tx").val(JSON.stringify(JsonTx));
		$('#TxModal').modal('hide')


	});

	$('#TxModal').on('hide.bs.modal', function (e) {
		// do something...
		EliminaRowTx();
	});


	// Formulario Laboratorio

	$('.lab').change(function() {
		var control = $(this).val();		
		var valor = $(this).attr("name");
		var pos = valor.search("_");
		var nom = valor.substring(0,pos);

		var mes = valor.substring(pos+4)
		mes = mes.replace("_mes","")

		if (control != 0) {
			if (nom == 'clo') {
				var nombre = 'Cortisol libre en orina';
			}else if (nom = 'ha') {
				var nombre = 'Hormona adrenocorticotrópica';
			};

			CreaRowLab(control,nombre,mes);
			$('#LabModal').modal('show');
			$('#PruebaLab').val(nombre);
		};
	});

	$('#GuardarModalLab').click(function() {

			$('#Laboratorio > tbody  > tr').each(function(){
				var fila = $(this)
				var valor = fila.children().children();

				var prueba_ctrl = valor[0];
				var mes_ctrl = valor[1];
				var fecha_ctrl = valor[2];
				var result_ctrl = valor[3];

				var prueba = $(prueba_ctrl).val();
				var mes = $(mes_ctrl).val();
				var fecha = $(fecha_ctrl).val();
				var result = $(result_ctrl).val();

				if (prueba != undefined ) {
					var nuevo = {"prueba":prueba,"mes":mes,"fecha":fecha,"result":result};
					JsonLab.push(nuevo);
				};

			EliminaRowClase();
			$("#id_lab").val(JSON.stringify(JsonLab));
			$('#mymodal').modal('hide')
			});
	});

	$('#CierraModalLab').click(function() {
		// body...
		EliminaRowClase();
	});

	$('#LabModal').on('hide.bs.modal', function (e) {
		// do something...
		EliminaRowClase();
	});


	$('.multi_lab').click(function() {
		// body...
		var valor = $(this).val();
		var nombre = $(this).attr("id");
		nombre = nombre.replace("_si_","_pruebas_");
		nombre = nombre.replace("_0","");
		nombre = nombre.replace("_1","");

		if (valor == 1) {
			$(nombre).prop("disabled", false);
		}else{
			$(nombre).prop("disabled", true);
		};

	})

});


function Tratamiento(nom,clase) {
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

	var tratamientos_ot = {
						'otro1':'Otro',
						'otro2':'Otro',
						'otro3':'Otro',
						'sepsis':'Sepsis',
						'neumonia':'Neumonía',
						'vias':'Vías urinarias',
						'ptb':'Piel y tejidos blandos',
						'fungi':'Fúngicas',
						'depre':'Depresión',
						'ansi':'Ansiedad',
						'psico':'Psicosis',
						'cr':'Cálculos renales'
					}

	if (tratamientos[nom] != undefined) {
		tx = tratamientos[nom];
		$("#tratamiento").attr('disabled','disabled');
	};
	return tx
}

function ObtenClase(cls) {

	var clase
	var clases = {
						'ec':'Enfermedad de Cushing',
						'diab':'Diabetes',
						'car':'Cardiovasculares',
						'inf':'Infecciones',
						'ment':'Mentales',
						'ot':'Otras'
					}

	clase = clases[cls];

	return clase
}

function CreaRow(prods) {
	console.log(prods);
	for (i = 0; i < prods; i++) {

		$("#tratamientos").find('tbody')
		.append($('<tr>')
			.attr('id','temporal')
			//Input de clase y temps
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'hidden',
						id: 'clase',
						disabled: 'disabled',
					})
				)
				.append($('<input>')
					.attr({
						type:'hidden',
						id: 'temp',
						disabled: 'disabled',
					})
				)
			)
			//Input de tratamiento
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'tratamiento',
						class: 'tx'
					})
				)
			)
			//Input de fecha
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'fecha',
						class: 'fecha_tx'
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
			//Input de cada cuantas horas
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'c_horas',
						class: 'habilitado'
					})
				)
			)
			//Input de durante cuantas horas
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'd_horas',
						class: 'habilitado'
					})
				)
			)
			//Input de intervalos entre ciclos
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'intervalos',
						class: 'habilitado'
					})
				)
			)
			//Input de ciclos anuales
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'n_ciclos',
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
						class: 'check'
					})
				)
			)
		);
	};
}

function NewRow(clase,tx,temp) {
	// body...
	$('#clase').val(clase);
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

function Validar(clase,tx,temp) {
	// body...
	var vacio = Object.keys(JsonTx).length
	if (vacio != 0) {
		for (var key in JsonTx) {
			if (JsonTx[key].tx == tx && JsonTx[key].temp == temp) {
				ExistRow(JsonTx[key]);
			}else{
				NewRow(clase,tx,temp);
			};
		};
	}else{
		NewRow(clase,tx,temp);
	};
}



// Laboratorio

function CreaRowLab (pruebas,nombre,mes) {
	// body..

	for (var i = 0; i < pruebas; i++) {

		$("#Laboratorio").find('tbody')
		.append($('<tr>')
			.attr({
				id:'temporal_' + i,
				class: 'temporal'
			})
			//Input de PruebaLab
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						disabled: 'disabled',
						class: 'PruebaLab'
					})
					.val(nombre)
				)
			)
			//Input de Mes
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						disabled: 'disabled',
						class: 'MesLab'
					})
					.val(mes)
				)
			)
			//Input de FechaLab
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						class: 'FechaLab'
					})
				)
			)
			//Input de ResultadoLab
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						class: 'ResultadoLab'
					})
				)
			)
		)
	}
}

function EliminaRowClase () {
	// body...
	$('table > tbody  > tr.temporal').each(
		function(){
			var tr = $(this);
			tr.remove();
		}
	);
}

function EliminaRowTx () {
	// body...
	$('#tratamientos > tbody  > tr').each(
		function(){
			var tr = $(this);
			tr.remove();
		}
	);
}