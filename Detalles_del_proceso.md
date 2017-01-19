Detalles del proceso
---
Este proceso de ETL carga información automáticamente de un S3 de AWS proporcionado por la plataforma edX, desencripta y transforma la información para guardarla en una base de datos MongoDB. Finalmente, genera archivos .csv con los datos más desagregados y estructurados para que sirvan como insumos a cualquier herramienta de Business Intelligence. 

### Proceso 1: 
Proceso automatizado que se encarga de desencriptar los archivos provenientes de edX y poblar una base de datos MongoDB con esa información. Consta de dos partes:
**Proceso 1.1** – Desencriptación: Con las claves necesarias, el proceso desencripta la información para que esta pueda ser accesible. Para esto es necesario disponer de los archivos “key” proporcionados por edX.
**Proceso 1.2** – Volcado de información: Diariamente se vuelca la información de los logs a una colección de Mongo llamada “Eventos”. Por otro lado, los domingos por la noche se hace la misma operación con los datos de detalles de cada curso.
Como resultado al proceso 1 se obtiene información actualizada en la base de datos MongoDB con dos tipos de colecciones.
-	__Colecciones de cursos__: Para cada curso se obtiene información de los usuarios, su demografía, los certificados, los avances del curso, los inscritos y los ID de los usuarios. (Más información sobre esto se puede encontrar aquí.)
-	__Colección de eventos__: Información de cada log de cada usuario en la plataforma. Esta colección recoge cada movimiento de cada usuario en la plataforma. El mayor reto reside en saber extraer información de esta base de datos. (Más información sobre esto se puede encontrar aquí)

### Proceso 2: 
Procesos escritos en lenguaje python cuya función es acceder la base de datos MongoDB para generar archivos csv que sirven como insumo para los reportes. Entre ellos se encuentran:
-	__Generación de colecciones generales__: Útiles para tener información agregada de todos los cursos.
-	__Listado de usuarios activos__: Extrae un listado de todos los usuarios con el nivel de progreso de cada usuario en cada curso.
-	__Localización mediante ip__: Localización del lugar de registro del usuario mediante la ip de registro. [En desarrollo]
### Proceso 3: 
Representación de la información en gráficos. Para esto existen diversas opciones en el mercado como Tableau, PowerBI, excel… o de desarrollo propio como librerías de R, Python…
[Proceso no incluído en el repositorio. Para este proceso es necesario un sistema de Business Intelligence externo]





























![Esquema](https://github.com/EL-BID/edX-Data-Model/blob/master/img/Esquema%20general.png?raw=true)
