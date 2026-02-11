export interface ImageSizes {
  thumbnail: string;
  medium: string;
  large: string;
  full: string;
}

export interface ImageObject {
  ID: number;
  id: number;
  title: string;
  filename: string;
  url: string;
  alt: string;
  caption: string;
  sizes: ImageSizes;
}

export interface AuthorData {
  id: number;
  nombre: string;
  avatar: string;
}

export interface TaxonomyTerm {
  id: number;
  term_id: number;
  name: string;
  slug: string;
  count: number;
}

export interface BlockText {
  acf_fc_layout: 'bloque_texto';
  texto: string;
}

export interface BlockCode {
  acf_fc_layout: 'bloque_codigo';
  codigo: string;
  lenguaje: string;
}

export interface BlockImage {
  acf_fc_layout: 'bloque_imagen';
  imagen: ImageObject;
  caption: string;
}

export interface BlockAlert {
  acf_fc_layout: 'bloque_alerta';
  contenido_alerta: string;
  tipo_alerta: 'info' | 'warning' | 'tip';
}

export interface BlockList {
  acf_fc_layout: 'bloque_lista';
  items_lista: { item: string }[];
}

export interface BlockSeparator {
  acf_fc_layout: 'bloque_separador';
  estilo: 'simple' | 'doble' | 'espaciado';
}

export type FlexibleContentBlock = 
  | BlockText 
  | BlockCode 
  | BlockImage 
  | BlockAlert 
  | BlockList 
  | BlockSeparator;

export interface ACFSnippetFields {
  extracto_corto: string;
  dificultad: 'basico' | 'intermedio' | 'avanzado';
  destacado: boolean;
  notas_internas?: string;
  contenido_snippet: FlexibleContentBlock[];
}

export interface WPCodeSnippet {
  id: number;
  date: string;
  slug: string;
  status: 'publish';
  type: 'codes';
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  acf: ACFSnippetFields;
  nombres_categorias: TaxonomyTerm[];
  nombres_tags: TaxonomyTerm[];
  datos_autor: AuthorData;
  imagen_destacada_datos: ImageSizes | null;
}
