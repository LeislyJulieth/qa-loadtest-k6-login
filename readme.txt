1. Requisitos previos

Sistema operativo: Windows 10 / Linux / macOS
Versiones utilizadas:

Node.js
K6 v0.48.0 (o superior)
Editor de texto recomendado: Visual Studio Code
Git 

2. Archivos incluidos

login-test.js - Script principal de K6.
users.csv - Archivo con los usuarios y contraseñas parametrizados.
results.json - Reporte en formato JSON (generado tras la ejecución).
conclusiones.txt  Hallazgos y observaciones de la prueba.

3. Endpoint probado

La prueba se ejecuta contra la API pública:
POST https://fakestoreapi.com/auth/login


Body esperado (JSON):
{
  "username": "usuario",
  "password": "contraseña"
}

4. Ejecución de la prueba

Abrir la terminal en la carpeta del proyecto y ejecutar:

k6 run login-test.js

Si se desea exportar los resultados a un archivo JSON:

k6 run --out json=results.json login-test.js

5. Resultados esperados

Validación de respuesta HTTP 200.
Tiempo de respuesta < 1.5s en el 95% de las solicitudes.
Respuesta en formato JSON.
Presencia de un token en la respuesta.