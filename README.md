# 📖 Biblia Reina Valera 1960 - Web App

Esta es una aplicación web de la Biblia optimizada para la lectura, el estudio y la integración en proyectos digitales. Cuenta con una separación clara de versículos, numeración precisa, funcionalidad de búsqueda y una navegación intuitiva.

> **Propósito:** Pensado especialmente para el desarrollo de aplicaciones en iglesias, grupos de estudio y uso personal gratuito.

## ✨ Características

* **Lectura Optimizada:** Cada versículo está separado visualmente y numerado para facilitar la lectura.
* **Navegación Intuitiva:** Selección ágil de Libros y Capítulos, con clara distinción entre el Antiguo y Nuevo Testamento.
* **Buscador Potente:** Herramienta integrada que permite filtrar resultados por versículos específicos o palabras clave.
* **Diseño Responsivo:** Interfaz moderna construida con **Tailwind CSS**, adaptable a dispositivos móviles, tablets y escritorio.

## 📂 Estructura del Proyecto

* `index.html`: Estructura semántica principal de la página.
* `app.js`: Lógica de la aplicación (control de navegación, renderizado dinámico y motor de búsqueda).
* `bible_data.js`: Base de datos en formato JSON que contiene los textos bíblicos.

## 🚀 Cómo usar

1.  **Descargar:** Clone o descargue este repositorio.
2.  **Ejecutar:** Abra el archivo `index.html` en su navegador web favorito.
3.  **Navegar:**
    * Utilice la **barra lateral** para seleccionar un libro.
    * Use el **selector superior** o los botones de "Siguiente/Anterior" para cambiar de capítulo.
    * Utilice la **barra de búsqueda** para localizar versículos o temas específicos.

## 🌐 Desarrollo y Multi-idioma

Actualmente, el proyecto utiliza `bible_data.js` para el contenido en español.

**¿Quieres colaborar?**
Si deseas ayudarnos a traducir la aplicación o añadir nuevos idiomas, sugerimos la siguiente estructura de archivos (ej. `en_bible_data.js` para inglés):

### Formato de Datos (JSON)
Para agregar libros o modificar el contenido, edite el array `bibleData` siguiendo estrictamente este formato:

```javascript
{
    name: "Nombre del Libro",      // Ej: "Génesis"
    abbrev: "Abr",                 // Ej: "Gn"
    testament: "Antiguo",          // Opciones: "Antiguo" | "Nuevo"
    chapters: [
        // Capítulo 1
        [
            "Versículo 1: En el principio...",
            "Versículo 2: Y la tierra estaba desordenada...",
        ],
        // Capítulo 2
        [
            "Versículo 1: Fueron, pues, acabados los cielos...",
            "Versículo 2: Y acabó Dios...",
        ]
    ]
}
