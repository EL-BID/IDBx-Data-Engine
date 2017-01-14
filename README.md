# ETL de datos de edX
Este repositorio sirve para llevar a cabo un proceso de Extracción Transformación y Carga (ETL) sobre los datos generados por los usuarios de la plataforma edX.

Actualmente el BID dispone de más de 20 cursos masivos online (MOOCS) con los que llega a más de 400.000 personas en distintas partes del mundo. El departamento de Conocimiento y Aprendizaje utiliza el software de este repositorio para analizar los datos y mejorar cada vez más su oferta educativa.
## Visión general
La siguiente imagen muestra de manera general el proceso que siguen los datos en el sitema.

![N|Solid](https://github.com/EL-BID/edX-Data-Model/blob/master/img/Esquema%20general.png?raw=true)
Para conocer en más detalle el proceso, leer el archivo 
## Cómo instalar
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
License
----

