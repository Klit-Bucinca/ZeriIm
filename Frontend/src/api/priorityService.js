import createApiClient from './apiFactory';

const priorityApi = createApiClient('/api/Priority');

const normalizeItem = (item) => ({
  municipality: item.Municipality || item.municipality || 'Të panjohur',
  posts: (item.Posts || item.posts || []).map((p, idx) => ({
    id: p.Id || p.id || idx,
    title: p.Title || p.title || '',
    content: p.Content || p.content || '',
    categoryName: p.CategoryName || p.categoryName || '—',
    score: p.Score ?? p.score ?? 0,
    createdAt: p.CreatedAt || p.createdAt,
    thumbnailUrl: p.ThumbnailUrl || p.thumbnailUrl || '',
  })),
});

export const getTopPriority = (params) => priorityApi.get('/top', { params });

export const getTopPriorityNormalized = async (params) => {
  const { data } = await getTopPriority(params);
  const items = data?.Items || data?.items || [];
  return items.map(normalizeItem);
};

export default {
  getTopPriority,
  getTopPriorityNormalized,
};
