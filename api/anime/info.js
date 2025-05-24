import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  const { info } = c.req.query();
  if (!info) {
    return c.json({ status: 'error', error: 'Anime name is required' }, 400);
  }

  const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(info)}&page=1`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (searchData.data && searchData.data.length > 0) {
    const animeData = searchData.data[0];
    return c.json({
      status: 'success',
      title: animeData.title,
      episodes: animeData.episodes,
      genre: animeData.genres.map(g => g.name).join(', '),
      synopsis: animeData.synopsis,
      image_url: animeData.images.jpg.image_url
    }, 200);
  }

  return c.json({ status: 'error', error: 'Anime not found' }, 404);
});

export default {
  fetch: app.fetch,
};
