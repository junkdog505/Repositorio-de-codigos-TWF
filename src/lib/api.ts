import type { WPCodeSnippet, TaxonomyTerm, AuthorData } from '../types/wp';

const API_BASE = 'https://code.amsot.net/wp-json/wp/v2';

export async function getSnippets(params: Record<string, string | number | number[]> = {}): Promise<WPCodeSnippet[]> {
  const url = new URL(`${API_BASE}/codes`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      url.searchParams.append(key, value.join(','));
    } else {
      url.searchParams.append(key, String(value));
    }
  });

  if (!params.per_page) {
    url.searchParams.append('per_page', '100');
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch snippets: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getSnippetBySlug(slug: string): Promise<WPCodeSnippet | null> {
  const snippets = await getSnippets({ slug });
  return snippets.length > 0 ? snippets[0] : null;
}

export async function getCategories(): Promise<TaxonomyTerm[]> {
  const url = `${API_BASE}/snippet-categories?per_page=100&hide_empty=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getTags(): Promise<TaxonomyTerm[]> {
  const url = `${API_BASE}/snippet-tags?per_page=100&hide_empty=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch tags');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getUsers(): Promise<AuthorData[]> {
    const url = `${API_BASE}/users?per_page=100`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch users');
        const users = await res.json();
        return users.map((u: any) => ({
            id: u.id,
            nombre: u.name,
            avatar: u.avatar_urls?.['96'] || '' 
        }));
    } catch (error) {
        return [];
    }
}
