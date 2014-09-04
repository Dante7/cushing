from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'cushing.views.home', name='home'),
    # url(r'^cushing/', include('cushing.foo.urls')),

    url(r'^$', 'captura.views.Main', name='main'),
    url(r'^menu/', 'captura.views.Menu', name='menu'),

    url(r'^captura/', 'captura.views.Captura', name='captura'),

    url(r'^entrevistado/', 'captura.views.CapEntrev', name='entrevistado'),
    url(r'^seleccion/', 'captura.views.CapSelec', name='seleccion'),
    url(r'^control/', 'captura.views.CapControl', name='control'),
    url(r'^generales/', 'captura.views.CapGenerales', name='generales'),
    url(r'^sintomas/', 'captura.views.CapSintomas', name='sintomas'),
    url(r'^comorbilidades/', 'captura.views.CapComorb', name='comorbilidades'),
    url(r'^especialista/', 'captura.views.CapEspe', name='especialista'),
    url(r'^hospitalizacion/', 'captura.views.CapHosp', name='hospitalizacion'),
    url(r'^laboratorio/', 'captura.views.CapLab', name='laboratorio'),
    url(r'^intervenciones/', 'captura.views.CapInter', name='intervenciones'),
    url(r'^tratamiento/', 'captura.views.CapTx', name='tratamiento'),
    url(r'^comorb_tx/', 'captura.views.CapComorbTx', name='comorbilidades'),
    url(r'^complicaciones/', 'captura.views.CapComp', name='complicaciones'),

    (r'^logout$', 'django.contrib.auth.views.logout', {'next_page': '/'}),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
