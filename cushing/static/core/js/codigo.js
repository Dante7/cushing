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
		clase_str = ObtenClase(clase,nom);
		var n_tx = $("#id_" + clase + "_" + nom + "_cuantos").val();
		if (n_tx == undefined) 
		{
			n_tx = 1; 
		};

		if (control == 1) {
			CreaRow(n_tx);
			var tx = Tratamiento(nom);
			$('#TxModal').modal('show');
			Validar(clase_str,tx,temp,n_tx,nom);
		};
	});

	$('#GuardarModal').click(function() {

		$('#tratamientos > tbody  > tr').each(function(){
			var tr = $(this);
			var elementos = []
			tr.children("td").each(function(){
				var ctrl = $(this).children("input");
				if (ctrl[0].type == "checkbox") {
					var tx_dict = {
								key: ctrl[0].id,
								value: ctrl[0].checked 
							}
				}else{
					var tx_dict = {
								key: ctrl[0].id,
								value: ctrl[0].value
							}
				};

				elementos.push(tx_dict);
			});

			//var arr = [tx + "_" + temp];
			var nuevo = {
				"clase":elementos[0].value,
				"temp":elementos[1].value,
				"tratamiento":elementos[2].value,
				"fecha":elementos[3].value,
				"dosis":elementos[4].value,
				"choras":elementos[5].value,
				"dhoras":elementos[6].value,
				"intervalos":elementos[7].value,
				"nciclos":elementos[8].value,
				"cateter":elementos[9].value
			};

			//arr.push(nuevo);
			JsonTx.push(nuevo);


		});
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
						'insuRapida':'Insulinas de acción rápida',
						'insuLenta':'Insulinas de acción lenta',
						'ieca':'Inhibidores enzima convertidora angiotensina',
						'bra':'Bloqueadores receptores de la angiotensina',
						'betaBloq':'Beta bloqueadores',
						'fibratos':'Fibratos',
						'bcc':'Bloqueadores de los canales de calcio',
						'diuretico':'Diurético',
						'iac':'Inhibidores de la absorción del colesterol',
						'vit':'Niacina (Vitamina B3)',
						'nitrato':'Nitratos',
						'antiplaq':'Antiplaquetarios',
						'acidoAcetil':'Ácido acetilsalicílico',
						'estatina':'Estatinas',
						'sab':'Secuestrantes de ácidos biliares (resinas)'
					}


	if (tratamientos[nom] != undefined) {
		tx = tratamientos[nom];
		$("#tratamiento_1").attr('disabled','disabled');
	};
	return tx
}

function ObtenClase(cls,tx) {

	var tratamiento
	var tx_ot = {
					'otro':'Otro',
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

	var clase
	var clases = {
						'ec':'Enfermedad de Cushing',
						'diab':'Diabetes',
						'car':'Cardiovasculares',
						'inf':'Infecciones',
						'ment':'Mentales',
						'ot':'Otras'
					}

	if (tx_ot[tx] != undefined) {
		clase = clases[cls] + "-" + tx_ot[tx];
	}else{
		clase = clases[cls];
	};

	return clase
}

function CreaRow(prods) {
	for (i = 1; i <= prods; i++) {

		$("#tratamientos").find('tbody')
		.append($('<tr>')
			.attr('id','temporal')
			//Input de clase y temps
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'hidden',
						id: 'clase_'+ i,
						disabled: 'disabled',
						class: 'clase'
					})
				)
			)
			//Input de temps
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'hidden',
						id: 'temp_'+i,
						disabled: 'disabled',
						class: 'temp'
					})
				)
				
			)
			//Input de tratamiento
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'tratamiento_'+i,
						class: 'tratamiento'
					})
				)
			)
			//Input de fecha
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'fecha_'+i,
						class: 'fecha_tx'
					})
				)
			)
			//Input de dosis
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'dosis_'+i,
						class: 'dosis'
					})
				)
			)
			//Input de cada cuantas horas
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'choras_'+i,
						class: 'choras'
					})
				)
			)
			//Input de durante cuantas horas
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'dhoras_'+i,
						class: 'dhoras'
					})
				)
			)
			//Input de intervalos entre ciclos
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'intervalos_'+i,
						class: 'intervalos'
					})
				)
			)
			//Input de ciclos anuales
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'text',
						id: 'nciclos_'+i,
						class: 'nciclos'
					})
				)
			)
			//Input de cateterismo
			.append($('<td>')
				.append($('<input>')
					.attr({
						type:'checkbox',
						id: 'cateterismo_'+i,
						class: 'cateterismo'
					})
				)
			)
		);
	};
}

function NewRow(clase,tx,temp,n_tx) {
	// body...
	$('input.clase').each(function(){
		$(this).val(clase);
	});
	//$('#clase').val(clase);

	$('input.tratamiento').each(function(){
		$(this).val(tx);
	});
	//$('#tratamiento').val(tx);

	$('input.temp').each(function(){
		$(this).val(temp);
	});
	//$('#temp').val(temp);
	$('#GuardarModal').removeAttr('disabled');
}

function ExistRow(array) {
	// body...
	$('#clase_1').val(array.clase);
	$('#tratamiento_1').val(array.tx);
	$('#temp_1').val(array.temp);
	$('#fecha_1').val(array.fecha);
	$('#dosis_1').val(array.dosis);
	$('#choras_1').val(array.c_horas);
	$('#dhoras_1').val(array.d_horas);
	$('#intervalos_1').val(array.intervalos);
	$('#nciclos_1').val(array.n_ciclos);
	$('#cateterismo_1').attr('checked',array.cateter);
	$('#GuardarModal').attr('disabled','disabled');
	
}

function ExistRows(array,prods) {
	// body...
	var i = 0;
		$('#tratamientos > tbody  > tr').each(function(){
			var tr = $(this);
			var elementos = []
			tr.children("td").each(function(){
				var ctrl = $(this).children("input");
				var id = ctrl[0].id;
				var clase = ctrl[0].classList[0];
				var pos = id.search("_");
				var id2 = id.substring(0,pos);
				//$("#"+id).css("background-color", "red");
				$("#"+id).val(array[i][id2]);
				//console.log(id2);
				//console.log(array[i][id2]);
			});
			i++
			//console.log(array[i]);
		});
	$('#GuardarModal').attr('disabled','disabled');
}

function Validar(clase,tx,temp,n_tx,nom) {
	// body...
	var vacio = Object.keys(JsonTx).length
	if (vacio != 0) {
		for (var key in JsonTx) {
			if (JsonTx[key].clase == clase && JsonTx[key].tratamiento == tx && JsonTx[key].temp == temp) {
				ExistRow(JsonTx[key]);
			}else if (JsonTx[key].clase == clase && tx == undefined && JsonTx[key].temp == temp){
				var Grupo = []
				Grupo.items = $.grep(JsonTx, function(element, index){
					return element.clase == clase;
				});
				var prods = Object.keys(Grupo.items).length;
				ExistRows(Grupo.items, prods);
				// Crear una nueva funcion enviando JsonTx.items similar a ExistRow
				// Con esa funcion vamos a llenar los campos creados
			}else{
				NewRow(clase,tx,temp,n_tx);
			};
		};
	}else{
		NewRow(clase,tx,temp,n_tx);
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