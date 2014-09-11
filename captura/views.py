#encoding:utf-8

# Create your views here.

from captura.models import *
from captura.forms import *
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from django.views.decorators.csrf import csrf_protect
from django.contrib import auth
from django.contrib.auth.decorators import login_required
import time

def GuardaTratamientos(tx, folio):
	tx = json.loads(tx)
	for item in tx:
		farma = TxCompleto()
		farma.folio = folio
		farma.tratamiento = item['tx']
		farma.meses = item['temp']
		farma.dosis = item['dosis']
		farma.ciclo = item['ciclo']
		farma.intervalos = item['inter']
		farma.ciclos = item['ciclos']
		farma.cateterismo = item['cateter']
		farma.save()
	pass


def ValidaReg(datos):
	valor = 'No'

	if datos['espe_medica'] == u'Endocrinología':
		if int(datos['tiempo_endo']) > 3 and int(datos['tiempo_endo']) < 36:
			if int(datos['cushing_actual_tx']) >= 2:
				if int(datos['cushing_cm_12m']) >= 2:
					total_exam = int(datos['examen_orina_2']) + int(datos['examen_orina_1']) + int(datos['examen_orina_0'])
					if total_exam > 2:
						valor = 'Si'
						print valor
						pass
					pass
				pass
			pass
		pass
	
	return valor
		

# Vista principal
@csrf_protect
def Main(request):
	template = 'inicio.html'
	reultado = {}

	if request.method=='POST':
		username = request.POST['usuario']
		password = request.POST['password']
		ip = request.META.get('REMOTE_ADDR')
		user = auth.authenticate(username=username, password=password)

		if user is not None and user.is_active:
		# Correct password, and the user is marked "active"
			auth.login(request, user)
			# Redirect to a success page.
			#resultado = {'estado':'correcto','mensaje':'Su registro fue correcto'}
			#Guarda entrada
			fecha = time.strftime("%d/%m/%Y")
			hora = time.strftime("%H:%M:%S")

			resultado = {'estado':'correcto','mensaje':'Entrada registrada'} 
			a = RegEnt()
			a.usuario = username
			a.fecha_registro = fecha
			a.hora_registro = hora
			a.ip = ip
			a.tipo_registro = 'entrada'
			a.save()
			request.session['usuario'] = username
			request.session['staff'] = user.is_staff

			return HttpResponseRedirect('/menu')
		else:
		# Show an error page
			resultado = {'estado':'incorrecto','mensaje':'Sus datos no coinciden favor de verificarlos'}
			return render_to_response(template, resultado, context_instance=RequestContext(request))

	return render_to_response(template, context_instance=RequestContext(request))

@login_required(login_url='/')
def Captura(request):
	template = 'captura.html'
	if request.session['staff']:
		registros = Entrevistado.objects.all()
	else:
		registros = Entrevistado.objects.filter(monitor_clinico=request.session['usuario'])
	resultado = {'registros': registros}
	return render_to_response(template, resultado, context_instance=RequestContext(request))


@login_required(login_url='/')
def Menu(request):
	template = 'menu.html'
	return render_to_response(template, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapEntrev(request,folio=''):
	template = 'formsEntre.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmEntrevistado(request.POST)
		if formulario.is_valid():
			formulario.save()

			reg = Entrevistado.objects.filter(monitor_clinico=request.session['usuario']).latest('hora_guardado')

			fol = Entrevistado.objects.get(id=reg.id)
			fol.folio_principal = reg.id
			fol.save()


			request.session['folio'] = reg.id
			request.session['espe'] = request.POST['especialidad']
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio'], 'espe': request.session['espe']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Entrevistado.objects.get(folio_principal=folio)
			request.session['folio'] = folio
			request.session['espe'] = registro.especialidad
			formulario = FrmEntrevistado(instance=registro)
			msg = 'true'
			pass
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio'], 'usuario': request.session['usuario'], 'espe': request.session['espe']}
		except:
			formulario = FrmEntrevistado()
			pass
			resultado = {'form':formulario, 'msg':msg,'usuario': request.session['usuario']}
	
	return render_to_response(template, resultado, context_instance=RequestContext(request))


@login_required(login_url='/')
def CapSelec(request):
	template = 'formsSeleccion.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmSeleccion(request.POST)
		if formulario.is_valid():
			formulario.save()

			# Asignacion de valores para validación
			datos = {}
			datos['espe_medica'] = request.POST['espe_medica']
			datos['tiempo_endo'] = request.POST['tiempo_endo']
			datos['cushing_actual_tx'] = request.POST['cushing_actual_tx']
			datos['cushing_cm_12m'] = request.POST['cushing_cm_12m']
			datos['examen_orina_2'] = request.POST['examen_orina_2']
			datos['examen_orina_1'] = request.POST['examen_orina_1']
			datos['examen_orina_0'] = request.POST['examen_orina_0']

			a = ValidaReg(datos)
			request.session['candidato'] = a
			inst_sel = Seleccion.objects.get(folio=request.session['folio'])
			inst_sel.espe_medica = request.session['espe']
			inst_sel.es_candidato = a
			inst_sel.save()

			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio'], 'candidato':request.session['candidato']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Seleccion.objects.get(folio=request.session['folio'])
			formulario = FrmSeleccion(instance=registro)
			request.session['candidato'] = registro.es_candidato
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio'], 'espe': request.session['espe'], 'candidato':request.session['candidato']}
			pass
		except: 
			formulario = FrmSeleccion()
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio'], 'espe': request.session['espe']}
			pass
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapControl(request):
	template = 'forms1.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmControl(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Control.objects.get(folio=request.session['folio'])
			formulario = FrmControl(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmControl()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapGenerales(request):
	template = 'forms2.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmGenerales(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Generales.objects.get(folio=request.session['folio'])
			formulario = FrmGenerales(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmGenerales()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapSintomas(request):
	template = 'forms3.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmSintomas(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Sintomas.objects.get(folio=request.session['folio'])
			formulario = FrmSintomas(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmSintomas()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapComorb(request):
	template = 'forms4.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmComorbilidades(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Comorbilidades.objects.get(folio=request.session['folio'])
			formulario = FrmComorbilidades(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmComorbilidades()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapEspe(request):
	template = 'forms5.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmEspecialista(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Especialista.objects.get(folio=request.session['folio'])
			formulario = FrmEspecialista(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmEspecialista()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapHosp(request):
	template = 'forms6.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmHospitalizacion(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Hospitalizacion.objects.get(folio=request.session['folio'])
			formulario = FrmHospitalizacion(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmHospitalizacion()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapLab(request):
	template = 'forms7.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmLaboratorio(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Laboratorio.objects.get(folio=request.session['folio'])
			formulario = FrmLaboratorio(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmLaboratorio()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapInter(request):
	template = 'forms8.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmIntervenciones(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Intervenciones.objects.get(folio=request.session['folio'])
			formulario = FrmIntervenciones(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmIntervenciones()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))

@login_required(login_url='/')
def CapTx(request):
	template = 'forms9.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmTratamiento(request.POST)
		print formulario.is_valid()
		if formulario.is_valid():
			print request.session['folio']
			formulario.save()
			msg = 'true'
			try:
				GuardaTratamientos(request.POST['valores'], request.POST['folio'])
				pass
			except:
				pass
			
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Tratamiento.objects.get(folio=request.session['folio'])
			formulario = FrmTratamiento(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmTratamiento()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))


@login_required(login_url='/')
def CapComorbTx(request):
	template = 'forms10.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmComorbilidadesTx(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = ComorbilidadesTx.objects.get(folio=request.session['folio'])
			formulario = FrmComorbilidadesTx(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmComorbilidadesTx()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))


@login_required(login_url='/')
def CapComp(request):
	template = 'forms11.html'
	msg = 'false'
	if request.method=='POST':
		formulario = FrmComplicaciones(request.POST)
		if formulario.is_valid():
			formulario.save()
			msg = 'true'
			resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
			return render_to_response(template, resultado, context_instance=RequestContext(request))
	else:
		try:
			registro = Complicaciones.objects.get(folio=request.session['folio'])
			formulario = FrmComplicaciones(instance=registro)
			msg = 'true'
			pass
		except: 
			formulario = FrmComplicaciones()
			pass
	resultado = {'form':formulario, 'msg':msg, 'folio': request.session['folio']}
	return render_to_response(template, resultado, context_instance=RequestContext(request))