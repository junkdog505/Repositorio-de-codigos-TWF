# Prompt Maestro: Astro SSG + WordPress Headless Full Client-Side Dynamic

> Este prompt describe una arquitectura completa para sitios Astro desplegados en hosting compartido (Apache) que consumen WordPress via REST API. Permite que TODO el sitio (posts, categorías, etiquetas, autores, busquedas) se actualice dinámicamente sin necesidad de rebuilds constantes.

---

## 1. Contexto y Restricciones

- **Stack**: Astro (modo `static`), React, Tailwind CSS.
- **Backend**: WordPress Headless (WP REST API v2).
- **Hosting**: Compartido (Apache), sin Node.js server-side, sin SSR/ISR.
- **Problema**: Al publicar contenido nuevo en WordPress, el sitio estático no lo muestra hasta el próximo build manual.
- **Objetivo**: Que todo contenido nuevo (posts, taxonomías, autores) aparezca automáticamente mediante fetching client-side, manteniendo la velocidad y SEO del contenido pre-existente.

---

## 2. Arquitectura de Solución: "Static First, Dynamic Refresh"

La estrategia consiste en hidratar todas las páginas estáticas con datos frescos del cliente y usar "shell pages" (páginas vacías con lógica de carga) para URLs que aún no existen en el build.

### A. Listados (Home, Archivo, Taxonomías)
1. **Build time**: Se obtienen los datos y se renderizan como HTML estático (SEO, carga rápida).
2. **Run time (Cliente)**: Un componente React monta sobre el contenido estático, hace fetch a la API en segundo plano, y actualiza la vista si hay datos nuevos.

### B. Páginas de Detalle (Single Post, Category, Tag, Author)
1. **Contenido existente**: Se sirve HTML estático pre-renderizado.
2. **Contenido nuevo (404 virtual)**: Apache intercepta la URL inexistente y sirve internamente una página "shell" (`dynamic.astro`).
3. **Shell Page**: Contiene un componente React que lee el slug de la URL, llama a la API, y renderiza la página completa en el navegador.

---

## 3. Componentes React Requeridos

Crea los siguientes componentes en `src/components/`:

### 3.1. `DynamicSnippetList.tsx` (Listado de Posts)
- **Props**:
  - `staticSnippets`: Array de posts pre-renderizados (fallback).
  - `limit`: Número máximo de items.
  - `apiParams`: Objeto para filtrar API (ej: `{ 'snippet-categories': 12, author: 5 }`).
  - `emptyMessage`: Texto para estado vacío.
- **Lógica**:
  - Estado inicial = `staticSnippets`.
  - `useEffect`: Fetch a `/wp-json/wp/v2/posts` con los `apiParams`.
  - Si fetch exitoso → actualiza estado. Si falla → mantiene `staticSnippets`.
  - Renderiza grid de cards.

### 3.2. `DynamicTaxonomyList.tsx` (Listado de Taxonomías)
- **Props**:
  - `type`: 'categories' | 'tags'.
  - `staticItems`: Array de términos pre-renderizados.
- **Lógica**:
  - Similar a `DynamicSnippetList`.
  - Fetch a `/wp-json/wp/v2/categories` o `/tags`.
  - Renderiza grid de categorías o nube de etiquetas.

### 3.3. `DynamicSnippetPage.tsx` (Detalle de Post)
- **Lógica**:
  - Lee slug de `window.location.pathname`.
  - Fetch a `/wp-json/wp/v2/posts?slug=EL_SLUG`.
  - Si encuentra post: renderiza header, contenido (usando `BlockRendererReact`), sidebar, etc.
  - Si no encuentra: renderiza UI de 404.
  - Actualiza `document.title`.

### 3.4. `DynamicCategoryPage.tsx` / `DynamicTagPage.tsx` / `DynamicAuthorPage.tsx`
- **Lógica**:
  - Lee slug/ID de la URL.
  - Fetch a la API correspondiente (categoría, tag o usuario).
  - Renderiza header de la taxonomía (título, descripción).
  - Incluye `<DynamicSnippetList />` pasando el ID filtrado en `apiParams`.

### 3.5. `BlockRendererReact.tsx`
- Renderizador de bloques (Gutenberg/ACF) para el cliente.
- Debe soportar todos los tipos de bloques usados (texto, código con highlighting, imagen, alerta, etc.).

---

## 4. Páginas Astro "Shell" (Fallbacks)

Crea estas páginas en `src/pages/` para servir de punto de entrada a contenido nuevo:

- `src/pages/codes/dynamic.astro` → Monta `<DynamicSnippetPage client:load />`
- `src/pages/category/dynamic.astro` → Monta `<DynamicCategoryPage client:load />`
- `src/pages/tag/dynamic.astro` → Monta `<DynamicTagPage client:load />`
- `src/pages/author/dynamic.astro` → Monta `<DynamicAuthorPage client:load />`

*Nota: Todas deben usar el Layout principal.*

---

## 5. Configuración Apache (.htaccess)

El archivo mágico que hace funcionar los URLs de contenido nuevo. Colocar en `public/.htaccess`:

```apache
RewriteEngine On
RewriteBase /

# 1. Fallback para Posts nuevos (/codes/[slug])
RewriteCond %{REQUEST_URI} ^/codes/([^/]+)/?$
RewriteCond %{REQUEST_URI} !^/codes/dynamic
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html !-f
RewriteRule ^codes/([^/]+)/?$ /codes/dynamic/index.html [L]

# 2. Fallback para Categorías nuevas (/category/[slug])
RewriteCond %{REQUEST_URI} ^/category/([^/]+)/?$
RewriteCond %{REQUEST_URI} !^/category/dynamic
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html !-f
RewriteRule ^category/([^/]+)/?$ /category/dynamic/index.html [L]

# 3. Fallback para Etiquetas nuevas (/tag/[slug])
RewriteCond %{REQUEST_URI} ^/tag/([^/]+)/?$
RewriteCond %{REQUEST_URI} !^/tag/dynamic
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html !-f
RewriteRule ^tag/([^/]+)/?$ /tag/dynamic/index.html [L]

# 4. Fallback para Autores nuevos (/author/[id])
RewriteCond %{REQUEST_URI} ^/author/([^/]+)/?$
RewriteCond %{REQUEST_URI} !^/author/dynamic
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html !-f
RewriteRule ^author/([^/]+)/?$ /author/dynamic/index.html [L]

# Reglas estándar Astro SSG
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)/$ $1/index.html [L]

ErrorDocument 404 /404.html
```

---

## 6. Integración en Páginas Existentes

Actualiza tus páginas `.astro` para usar los componentes dinámicos en lugar de renderizado estático puro:

- **Home / Archivo**: Usar `<DynamicSnippetList staticSnippets={posts} client:load />`
- **Índice de Categorías**: Usar `<DynamicTaxonomyList type="categories" staticItems={cats} client:load />`
- **Detalle de Categoría (`[slug].astro`)**: Usar `<DynamicSnippetList apiParams={{'categories': id}} staticSnippets={posts} client:load />`

---

## Resumen del Flujo

1.  **Usuario entra a Home**: Ve posts estáticos al instante → React carga en background → Aparecen posts nuevos.
2.  **Usuario clic en Post Nuevo**: Navega a `/codes/nuevo-post`.
3.  **Apache**: No ve archivo físico → Sirve `/codes/dynamic`.
4.  **React (DynamicSnippetPage)**: Carga, pide datos a WP API, renderiza el post.
5.  **Usuario entra a Categoría Nueva**: Navega a `/category/nueva`.
6.  **Apache**: Sirve `/category/dynamic`.
7.  **React (DynamicCategoryPage)**: Carga datos de categoría + listado de posts filtrados.

Esta arquitectura garantiza que tu sitio sea **100% autogestionable** desde WordPress sin tocar código ni hacer deploys, manteniendo la performance de un sitio estático.
