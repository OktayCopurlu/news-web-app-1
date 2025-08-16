import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import NewsCard from '../../src/components/NewsCard';
import { UserContext } from '../../src/contexts/UserContext';

function renderWithUser(ui: React.ReactElement, user: any = null) {
  return renderToString(
    <MemoryRouter>
      <UserContext.Provider
        value={{
          user,
          loading: false,
          signUp: async () => ({ user: null, error: null }),
          signIn: async () => ({ user: null, error: null }),
          signOut: async () => {},
          updatePreferences: async () => ({ error: null }),
        }}
      >
        {ui}
      </UserContext.Provider>
    </MemoryRouter>
  );
}

let baseArticle = {
  id: 'c1',
  title: 'Title',
  summary: 'Summary',
  published_at: new Date().toISOString(),
  reading_time: 3,
  category: 'general',
  language: 'de',
  source: 'Source',
  source_url: 'https://example.com',
  image_url: '',
  tags: ['world'],
};

describe('NewsCard badge', () => {
  beforeEach(() => {
    baseArticle = { ...baseArticle, id: 'c1' };
  });

  it('shows translating label when status=pending', () => {
    const html = renderWithUser(
      <NewsCard article={{ ...baseArticle, translation_status: 'pending' } as any} />, 
      { preferences: { audioPreferences: false, biasAnalysis: false } }
    );
    expect(html).toContain('Translated soon');
  });

  it('does not show translating label when status=ready', () => {
    const html = renderWithUser(
      <NewsCard article={{ ...baseArticle, translation_status: 'ready' } as any} />, 
      { preferences: { audioPreferences: false, biasAnalysis: false } }
    );
    expect(html).not.toContain('Translated soon');
  });
});
