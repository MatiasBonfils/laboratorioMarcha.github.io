Prototipo de software para el estudio de la postura y la marcha humana

Este repositorio contiene el código fuente del prototipo de software desarrollado como parte del proyecto integrador de la carrera de Ingeniería Biomédica de la Universidad Nacional de Córdoba. El software, escrito en JavaScript, tiene como objetivo analizar la postura y la marcha humana a partir de videos.

//------------------------------------------------------------------------------------------------------------------------------------//
## Licencia / Términos de Uso

Este código no está bajo una licencia de código abierto o de libre uso. El uso y la distribución de este código están restringidos y solo se permite a personas específicas o para fines particulares. No otorgamos permiso para utilizar, modificar o distribuir este código a menos que se obtenga una autorización explícita por escrito de los propietarios o mantenedores del proyecto.

Para más detalles sobre los términos de uso, por favor contactarnos a matias.bonfils@mi.unc.edu.ar .

® Matías Bonfils - 2023
//------------------------------------------------------------------------------------------------------------------------------------//
Estructura del proyecto

El proyecto se divide en tres partes principales:

    Parte 1 - Análisis: Esta sección del código, compuesta por los archivos script.js, index.html y style.css, se encarga de realizar el análisis biomecánico a partir de videos. Haciendo uso de la biblioteca Mediapipe, se detecta la pose humana y se calculan diversos parámetros como ángulos e inclinaciones,  y también toma  capturas de pantalla.

    Parte 2 - Visualización: La segunda parte del proyecto, implementada en los archivos analizar.js, analizar.html y analizar.css, permite visualizar los datos obtenidos en la primera parte. Aquí se presentan los ángulos calculados y las capturas de pantalla de manera interactiva.

    Parte 3 - Generación de informes: En la tercera parte del proyecto, implementada en los archivos guardar_analisis.js, guardar_analisis.html y guardar_analisis.css, se genera un informe técnico en formato PDF. Los datos recopilados durante el análisis se presentan de manera estructurada y listos para su impresión.

Uso del software

Manual de Uso:

    Decisión de los videos a analizar:

    a. Si deseas analizar videos a partir de un archivo importado, dirígete al panel de control y selecciona el icono con la flecha hacia arriba.

    Selección de la prueba a analizar:

    a. Elige el interruptor correspondiente a la prueba que deseas analizar, como "Análisis del Valgo/Varo", "Análisis de la postura frontal" o "Análisis de la postura sagital", "Rotación interna o externa de cadera" o "Análisis de la marcha".

    b. Para pruebas posturales, se recomienda que el paciente se coloque de frente (para postura frontal y valgo/varo) o a 90 grados con respecto a la cámara en postura sagital.

    c. Si se trata de rotación interna y externa de cadera, el usuario debe sentarse de frente a la cámara y girar la parte inferior de la pierna sin levantar la parte superior.

    d. Para el análisis de la marcha, se recomienda utilizar videos importados y que el paciente comience a caminar con el talón del pie más cercano a la cámara. Para medir distancias, es necesario colocar previamente puntos de referencia en el escenario.

    Activación del guardado de datos:

    Una vez seleccionada la prueba, activa el interruptor "Guardar datos" para que el software guarde los valores recopilados durante el tiempo de funcionamiento. Si deseas tomar capturas de pantalla, simplemente presiona el botón con el mismo nombre.

    Procedimiento para analizar:

    Una vez que los datos hayan sido guardados, presiona el botón "Analizar" ubicado en la esquina superior para avanzar a la siguiente página.

    Selección de la prueba realizada:

    En la nueva página, selecciona el chip/botón correspondiente a la prueba realizada anteriormente. Puede ser "Análisis postural y rotación interna y externa", "Análisis de la marcha del lado izquierdo" o "Análisis de la marcha del lado derecho".

    Guardado de datos:

    Después de haber seleccionado la prueba correspondiente y verificado la precisión de los datos, presiona el botón "Guardar".

    Completar datos personales:

    En la última página, completa los datos personales requeridos y presiona el botón "Generar PDF" para crear un archivo .PDF con la ficha técnica.

Contenidos del codigo
La parte más importante del software es la primera, que debe ejecutarse en primer lugar. Esta sección del código se basa en la demo online de Mediapipe, que permite la detección de la pose humana utilizando el siguiente enlace: https://codepen.io/mediapipe/pen/jOMbvxw. Sobre este código base, se realizaron modificaciones y se agregaron nuevos elementos para adaptarlo a los requerimientos del proyecto.

En la primera parte del software, se pueden observar los siguientes elementos visuales:

    Pantalla de video: Permite la visualización del video, el cual puede provenir de la cámara de la computadora o ser importado desde un archivo.
    Panel de control: Contiene diversas funcionalidades, como importar un video, pausar/reproducir el video, mostrar los FPS del video, ajustar la complejidad del esqueleto generado, activar/desactivar la superposición de líneas en el video, mostrar rectángulos con los valores de los ángulos calculados y habilitar la función de guardar los datos generados durante el análisis.
    Botones adicionales: Se incluyen botones para realizar capturas de pantalla, medir distancias y avanzar a la siguiente página.
 
Parte 1 - Análisis

La primera parte del código está organizada en los siguientes módulos:

   Gestión del video: Incluye el código relacionado con la visualización del video, tamaño de la pantalla y ubicación.
   
   Definición de variables: Estas variables se presentan en el panel de control, incluyendo sus nombres y estados iniciales.
   
   Funcionalidades de captura de pantalla: Se implementan las funciones necesarias para realizar y almacenar capturas de pantalla para su posterior visualización.
   
   Funcionalidades de medición de distancias: Se incluyen las funciones relacionadas con la medición de distancias en el video.
   
   Detección de la pose: Se abordan las funcionalidades relacionadas con la detección de la pose humana, como el color del esqueleto, la visualización de líneas auxiliares y el cálculo de ángulos utilizando la posición de los puntos del esqueleto.
   
   Control del panel: Se implementan las funciones necesarias para posicionar el panel de control en la pantalla y realizar cambios en la reproducción del video.

Parte 2 - Visualización

En la segunda parte del código, se han organizado los siguientes módulos:

    Muestra de capturas: Este módulo incluye las funcionalidades necesarias para mostrar en pantalla las capturas tomadas en la página anterior. Permite al usuario revisar visualmente las imágenes capturadas durante el análisis.

    Funcionalidades visuales: Este módulo se encarga de definir qué elementos deben aparecer en pantalla y cuáles deben ocultarse, según el tipo de prueba realizado. Proporciona una interfaz intuitiva y adaptada para visualizar los resultados de manera adecuada.

    Funcionalidades de gráficas: En este módulo, se implementan las funcionalidades necesarias para mostrar gráficas que representen los datos obtenidos en la página anterior. Estas gráficas ayudan a visualizar patrones o tendencias en los resultados del análisis.

    Funcionalidades de valores: Este módulo se encarga de mostrar los valores obtenidos en la página anterior, como los ángulos o la distancia medida. Proporciona una presentación clara y legible de estos datos para que el usuario pueda interpretarlos de manera efectiva.

    Botones de navegación: Se incluyen botones que permiten al usuario avanzar a la siguiente página o volver a la página anterior. Estos botones facilitan la navegación entre las diferentes secciones del software y proporcionan una experiencia fluida al usuario.

Parte 3 - Generación de informes

En la tercera parte del código, se han organizado los siguientes módulos:

    Carga de datos: Este módulo permite al usuario cargar datos como el nombre, la edad o algunas observaciones relevantes. Proporciona campos de entrada de texto y opciones desplegables para recopilar la información necesaria para el informe.

    Generación de PDF: Este módulo permite al usuario generar un archivo PDF que contenga los datos cargados y los resultados obtenidos en las etapas anteriores. Al tocar un botón específico, se crea automáticamente el archivo PDF que se puede guardar o imprimir según sea necesario.

    Muestra de capturas: En este módulo, se incluyen las funcionalidades necesarias para mostrar en pantalla las capturas tomadas en la página anterior. Permite al usuario revisar visualmente las imágenes capturadas durante el análisis y asegurarse de que estén correctamente incluidas en el informe.

    Funcionalidades de gráficas: En este módulo, se implementan las funcionalidades necesarias para mostrar gráficas que representen los datos obtenidos en la página anterior. Estas gráficas ayudan a visualizar patrones o tendencias en los resultados del análisis y enriquecen el informe con información visualmente atractiva.

    Funcionalidades de valores: Este módulo se encarga de mostrar los valores obtenidos en la página anterior, como los ángulos o la distancia medida. Proporciona una presentación clara y legible de estos datos para que el usuario pueda interpretarlos de manera efectiva. Estos valores se incluirán en el informe generado para brindar información detallada sobre los resultados obtenidos.


