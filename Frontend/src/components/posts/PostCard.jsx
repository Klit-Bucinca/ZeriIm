import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';

const PostCard = ({ post, onRefresh }) => {
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const createdAt = useMemo(() => {
    const dateValue = post?.createdAt ?? post?.CreatedAt;
    if (!dateValue) return '';
    return new Date(dateValue).toLocaleString('sq-AL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [post]);

  const heading =
    post?.title && post.title.trim().length > 0
      ? post.title
      : post?.content || 'Postim';

  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = apiBase.replace(/\/$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  const rawImages = Array.isArray(post?.imageUrls)
    ? post.imageUrls
    : post?.ImageUrls;
  const images =
    rawImages && rawImages.length > 0
      ? rawImages.map((u) => resolveImageUrl(u))
      : post?.thumbnailUrl || post?.ThumbnailUrl
      ? [resolveImageUrl(post.thumbnailUrl ?? post.ThumbnailUrl)]
      : [];

  const handleCardClick = () => {
    const id = post?.id ?? post?.Id;
    if (id) navigate(`/posts/${id}`);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (lightboxOpen && images.length > 1) {
        if (e.key === 'ArrowRight')
          setLightboxIndex((prev) => (prev + 1) % images.length);
        if (e.key === 'ArrowLeft')
          setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, images.length]);

  const renderImages = () => {
    if (!images.length) return null;
    const limited = images.slice(0, 4);
    const extra = images.length - limited.length;

    if (limited.length === 1) {
      return (
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
          <img
            src={limited[0]}
            alt={heading}
            className="w-full max-h-[500px] aspect-[4/5] cursor-pointer object-cover transition hover:brightness-105"
            onClick={() => openLightbox(0)}
          />
        </div>
      );
    }

    if (limited.length === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {limited.map((src, idx) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700"
            >
              <img
                src={src}
                alt={heading}
                className="aspect-square w-full cursor-pointer object-cover transition hover:brightness-105"
                onClick={() => openLightbox(idx)}
              />
            </div>
          ))}
        </div>
      );
    }

    if (limited.length === 3) {
      return (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="col-span-2 relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
            <img
              src={limited[0]}
              alt={heading}
              className="aspect-square w-full cursor-pointer object-cover transition hover:brightness-105"
              onClick={() => openLightbox(0)}
            />
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-2">
            {limited.slice(1).map((src, idx) => (
              <div
                key={src}
                className="relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <img
                  src={src}
                  alt={heading}
                  className="aspect-square w-full cursor-pointer object-cover transition hover:brightness-105"
                  onClick={() => openLightbox(idx + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {limited.map((src, idx) => (
          <div
            key={src}
            className="relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700"
          >
            <img
              src={src}
              alt={heading}
              className="aspect-square w-full cursor-pointer object-cover transition hover:brightness-105"
              onClick={() => openLightbox(idx)}
            />
            {extra > 0 && idx === limited.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{extra}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderLightbox = () => {
    if (!lightboxOpen || !images.length) return null;
    const current = images[lightboxIndex];
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4"
        onClick={() => setLightboxOpen(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(false)}
      >
        <div className="relative w-full max-w-5xl">
          <img
            src={current}
            alt={heading}
            className="max-h-[80vh] w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-3 py-2 text-lg font-bold text-gray-800 hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-3 py-2 text-lg font-bold text-gray-800 hover:bg-white"
              >
                ›
              </button>
            </>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="absolute right-2 top-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gray-900 hover:bg-white"
          >
            Mbyll
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Anonim
            </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {post?.municipality && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                {post.municipality}
              </span>
            )}
            {post?.categoryName && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                {post.categoryName}
              </span>
            )}
            <span>{createdAt}</span>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {post?.score ?? post?.Score ?? 0} vota
        </div>
      </div>

      <div
        className="mt-3 cursor-pointer text-base leading-relaxed text-gray-800 dark:text-gray-100"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      >
        {post?.content ?? post?.Content ?? ''}
      </div>

      {renderImages()}

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <VoteButtons
          postId={post?.id ?? post?.Id}
          currentScore={post?.score ?? post?.Score ?? 0}
          onRefresh={onRefresh}
        />
        <Link
          to={`/posts/${post?.id ?? post?.Id}`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Komento
        </Link>
      </div>
      </div>
      {renderLightbox()}
    </>
  );
};

export default PostCard;
export { PostCard };
