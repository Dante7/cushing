#encoding:utf-8

def OpcionesNumericas():
	opciones = []
	for x in xrange(0,99):
		opciones.append((str(x), x)) 
		pass
	opciones.append(('999',999))
	return opciones


a = OpcionesNumericas()

print a