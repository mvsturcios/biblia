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
    *   *Nota*: Actualmente contiene una muestra (Génesis, Éxodo, Salmos, Mateo, Juan). Para agregar la Biblia completa, se debe poblar este archivo manteniendo la estructura JSON.

## Cómo usar

1.  Abra el archivo `index.html` en su navegador web.
2.  Use la barra lateral para seleccionar un libro.
3.  Use el selector superior o los botones inferiores para cambiar de capítulo.
4.  Use la barra de búsqueda para encontrar palabras clave.

## Cómo agregar más libros

Edite el archivo `bible_data.js` y agregue objetos al array `bibleData` siguiendo este formato:

```javascript
{
    name: "Nombre del Libro",
    abbrev: "Abr",
    testament: "Antiguo" | "Nuevo",
    chapters: [
        [ "Versículo 1", "Versículo 2", ... ], // Capítulo 1
        [ "Versículo 1", ... ] // Capítulo 2
    ]
}
```
