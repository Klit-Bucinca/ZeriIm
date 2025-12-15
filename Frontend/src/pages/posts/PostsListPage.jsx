import { useCallback, useEffect, useState } from 'react';
import { getPosts } from '../../api/postService';
import PostCard from '../../components/posts/PostCard';
import PostComposerPreview from '../../components/posts/PostComposerPreview';
import CreatePostModal from '../../components/posts/CreatePostModal';

const PAGE_SIZE = 10;

const Pagination = ({ page, pageSize, totalCount, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  const handleChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    onPageChange(nextPage);
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => handleChange(page - 1)}
        disabled={page === 1}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Me pare
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Faqja {page} nga {totalPages}
      </span>
      <button
        type="button"
        onClick={() => handleChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Tjetra
      </button>
    </div>
  );
};

const PostsListPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const fetchPosts = useCallback(
    async (pageToLoad) => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getPosts({
          Page: pageToLoad,
          PageSize: PAGE_SIZE,
          CategoryId: categoryId || undefined,
          Municipality: municipality || undefined,
          SearchTerm: searchTerm || undefined,
          SortBy: sortBy,
        });

        const items = data?.Items ?? data?.items ?? [];
        const total = data?.TotalCount ?? data?.totalCount ?? 0;
        setPosts(items);
        setTotalCount(total);
      } catch (err) {
        setError('Nuk mund te ngarkohen postimet per momentin.');
        setPosts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, municipality, searchTerm, sortBy]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handleSearchChange = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  const handleMunicipalityChange = (e) => {
    setPage(1);
    setMunicipality(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setPage(1);
    setCategoryId(e.target.value);
  };

  const handleSortChange = (e) => {
    setPage(1);
    setSortBy(e.target.value);
  };

  const handlePostCreated = () => {
    setPage(1);
    fetchPosts(1);
    setIsComposerOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Postimet
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Shkruaj nje postim te ri dhe shfleto fluksin e postimeve.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <PostComposerPreview onOpen={() => setIsComposerOpen(true)} />
      </div>

      <CreatePostModal
        open={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Kerko postime..."
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          value={municipality}
          onChange={handleMunicipalityChange}
          placeholder="Municipaliteti"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <select
          value={categoryId}
          onChange={handleCategoryChange}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="" disabled>
            Zgjidh kategorine (placeholder)
          </option>
        </select>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="Newest">Me te rejat</option>
          <option value="MostUpvoted">Me te votuarat</option>
        </select>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-700 dark:bg-gray-800">
        {loading && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            Duke ngarkuar postimet...
          </div>
        )}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            Nuk u gjet asnje postim.
          </div>
        )}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id ?? post.Id}
                post={post}
                onRefresh={() => fetchPosts(page)}
              />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
};

export default PostsListPage;
export { PostsListPage };
