*Esta herramienta digital está publicada en página web de la iniciativa [Código para el Desarrollo](http://code.iadb.org/es/repositorio/15/idbx-data-engine)*

# IDBx Data Engine
---
Este sistema extrae, analiza y consolida en una base de datos, la información de los cursos masivos y abiertos en línea del Programa IDBx, contenida en el paquete de información generada por la plataforma tecnológica edX, en donde se imparten dichos cursos.

El Instituto Interamericano para el Desarrollo Económico y Social (INDES) ha desarrollado una serie de Cursos Masivos y Abiertos en Línea (MOOCs por sus siglas en inglés), que forman parte del Programa IDBx, cuyo objetivo es promover productos de conocimiento abierto relativos al desarrollo económico y social en América Latina y el Caribe. En respuesta a la necesidad de información confiable para la gestión y mejora de la toma de decisiones del programa IDBx, el INDES puso en marcha el proyecto de datos IDBx Data Engine.
Este proceso consta de dos componentes:

1. **Proceso ETL**: Automatización del proceso de extracción, transformación y carga de los datos procedentes del paquete de información y otras fuentes proporcionadas por edX.

2. **Proceso de análisis**: Análisis y creación de indicadores que sirven de insumo para visualizaciones y gráficos de monitoreo (Dashboards). Este último componente permite el seguimiento continuo del Programa IDBx, a través del análisis de variables e indicadores clave de negocio previamente seleccionadas.

## Visión general
La siguiente imagen muestra de manera general el proceso que siguen los datos en el sitema.

![N|Solid](https://cloud.githubusercontent.com/assets/9949001/24005651/02fc1856-0a40-11e7-8d5d-c7cbbf55f5da.png)
Para conocer en más detalle el proceso, leer el archivo [Detalles_del_proceso.md](https://github.com/EL-BID/edX-Data-Model/blob/master/Detalles_del_proceso.md)
## Cómo instalar
---
### Preparación del ambiente de trabajo
Los siguientes archivos sirven para la creación e instalación de ejecutable en Docker:
-	Dockerfile
-	Makefile
-	units/*.* (archivos dentro de la carpeta units)

### Los siguientes archivos sirven para el procesamiento de datos (ETL):
-	Key-old.asc
-	Package.json
-	Run.sh
-	shell.js
-	Edx-import.js
-	commands/*.js
### Archivos de Referencia:
- Detalles_del_proces.md

De todos los archivos provistos por la plataforma Edx, este software importa, extrae y procesa los siguientes archivos para transformarlos en una base de datos no estructurada y facilitar su análisis. 
Los archivos de “course content” importados por cada curso son:
-	Auth_user-prod-analytics.sql
-	Auth_userprofile-prod-analytics.sql
-	Certificates_generatedcertificate-prod-analytics.sql
-	Courseware_studentmodule-prod-analytics.sql
-	Student_courseenrollment-prod-analytics.sql
-	User_id_map-prod-analytics.sql

Y los de “event content” son los incluidos en la siguiente carpeta:
-	Events

### Configuaración de llaves de acceso
Activar el docker y configurar las llaves de acceso a los archivos. (edX provee las llaves de acceso para cada paquete de datos)

```shell
docker run --rm \
--name edx-import \
--env AWS_ACCESS_KEY_ID=… \
--env AWS_SECRET_ACCESS_KEY=… \
--env KEY_PASSPHRASE=… \
--env STORAGE_DB=edx \
--link mongodb-storage:storage \
iadb/edx-import
```

### Sync
El proceso de sincronización de datos descargará el último paquete de datos directamente del S3 de AWS de edX. Después de  desencriptar los archivos y procesarlos, guarda los registros en una base de datos MongoDB.
```shell
docker run ... iadb/edx-import  sync
```

### Commandos
Existen diferentes scripts en la carpeta "commands". Los detalles de los mismos se encuentran ecomentados en cada archivo de comandos. La manera más fácil de ejecutarlos es:
```shell
docker run ... iadb/edx-import cmd [NAME]
```

Pasos para utilizar el software:
-	Actualización del archivo shell.js (con la metadata de cada curso).
Para poder agregar nuevos cursos en los reportes de la base de datos alojada en nuestro servidor Master, se deberá incluir la metadata del nuevo curso, en el archivo shell, indicando la siguiente información:
-	id (código del curso en la base de datos)
-	Name (nombre completo del curso)
-	Sme (departamento y/o área del Banco o outsider involucrado)
-	Start_date (Fecha de inicio)
-	End_date (Fecha de fin)

### Ejecución en segundo plano
Si se requiere, cualquier comando puede ser ejecutado en segundo plano ejecutando el siguiente código en el shell:
```shell
# Start an interactive instance as a deattached container
docker run -itd --name bg \
-v /home/core:/tmp \
--link mongodb-container:storage \
--entrypoint "/bin/bash" \
iadb/edx-import

# Start a new shell in the same container
docker exec -it bg /bin/bash

# Execute the process, send it to the background and disown
# [PROCESS HERE]...
bg && disown %1
exit
```
# Más información
----
## Licencia
[LICENSE](https://github.com/EL-BID/IDBx-Data-Engine/blob/master/LICENSE)

## Cómo contribuir
- Integración del archivo MASTERFILE en el proceso de extracción de datos.
## Autores
- [Carlos Macher Barcenas](mailto:carlosm@iadb.org)
- [Jose Luis Delgado Davara](https://twitter.com/JLdelda)
- Otros colaboradores

## Links útiles
- http://docs.edx.org/
- http://edx.readthedocs.io/projects/devdata/en/stable/index.html

