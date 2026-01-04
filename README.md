# Biblia Reina Valera 1960 - Web App

Esta es una aplicación web de la Biblia optimizada para lectura, con separación clara de versículos y números, funcionalidad de búsqueda y navegación intuitiva.

## Características

*   **Lectura Optimizada**: Cada versículo está separado y numerado claramente.
*   **Navegación**: Selección fácil de libros y capítulos. Separación por Antiguo y Nuevo Testamento.
*   **Búsqueda**: Buscador integrado que filtra por versículos.
*   **Diseño Responsivo**: Funciona en móviles y escritorio gracias a Tailwind CSS.

## Estructura del Proyecto

*   `index.html`: La estructura principal de la página.
*   `app.js`: La lógica de la aplicación (navegación, renderizado, búsqueda).
*   `bible_data.js`: Contiene los datos de la Biblia.
    *   *Nota*: Si nos ayudana traducir el bible_data.js seria bueno asi tendriamos multi-idiomas agregariamos un selector de idioma.
## Cómo usar

1.  Abra el archivo `index.html` en su navegador web.
2.  Use la barra lateral para seleccionar un libro.
3.  Use el selector superior o los botones inferiores para cambiar de este.
4.  Use la barra de búsqueda para encontrar palabras clave.

## Cómo cambiar idioma o más libros

Edite el archivo `bible_data.js` y agregue objetos al array `bibleData` siguiendo este formato:
antes si cambiaras el idioma debes crear un archivo llamado en_bible_data.js dependiendo extension de idioma spanish english.

```javascript
{
    name: "Nombre Antiguo Libro",
    abbrev: "Abr",
    testament: "Antiguo" | "Nuevo",
    chapters: [
        [ "Versículo 1", "Versículo 2", ... ], // Capítulo 1
        [ "Versículo 1", ... ] // Capítulo 2

```
Reescrito y diseñado por NeoPunto, conocido cómo Andrés Turcios.

Este libro es totalmente gratuito y esta prohibida su venta.

