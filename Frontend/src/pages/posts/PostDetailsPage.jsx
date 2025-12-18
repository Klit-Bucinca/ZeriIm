import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, deletePost } from '../../api/postService';
import { createComment, deleteComment } from '../../api/commentService';
import VoteButtons from '../../components/posts/VoteButtons';
import { useAuth } from '../../context/AuthContext';

const PostImagesGallery = ({ images }) => {
  if (!images || images.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((url) => (
        <div
          key={url}
          className="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700"
        >
          <img
            src={url}
            alt="Foto e postimit"
            className="h-64 w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const CommentForm = ({
  onSubmit,
  submitting,
  placeholder,
  canSubmit = true,
  disabledText,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), () => setContent(''));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[96px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-theme-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {!canSubmit ? disabledText || 'Duhet të kyçeni për të komentuar.' : null}
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim() || !canSubmit}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
            canSubmit
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-500'
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {submitting ? 'Duke derguar...' : canSubmit ? 'Komento' : 'Kyçu për të komentuar'}
        </button>
      </div>
    </form>
  );
};

const CommentThread = ({
  comments,
  activeReplyId,
  onReply,
  onSubmitReply,
  submitting,
  onDelete,
  userId,
  currentUserName,
}) => {
  if (!comments || comments.length === 0) return null;

  const getReplies = (c) => c.Replies || c.replies || [];

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.Id || comment.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.AuthorName ||
                  comment.authorName ||
                  comment.AuthorDisplayName ||
                  comment.authorDisplayName ||
                  comment.UserName ||
                  comment.username ||
                  comment.Email ||
                  comment.email ||
                  ((comment.AuthorId === userId ||
                    comment.authorId === userId ||
                    comment.UserId === userId ||
                    comment.userId === userId) &&
                    (currentUserName || 'Ti')) ||
                  'Anonim'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.CreatedAt || comment.createdAt).toLocaleString('sq-AL')}
                {(comment.IsEdited || comment.isEdited) ? ' (redaktuar)' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onReply(comment.Id || comment.id)}
                disabled={submitting}
                className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-primary transition hover:bg-blue-100 disabled:opacity-60"
              >
                Pergjigju
              </button>
              {(isAdmin ||
                userId &&
                  (comment.AuthorId === userId ||
                    comment.authorId === userId ||
                    comment.UserId === userId ||
                    comment.userId === userId)) && (
                  <button
                    type="button"
                    onClick={() => onDelete?.(comment.Id || comment.id)}
                    disabled={submitting}
                    className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    Fshi
                  </button>
                )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
            {comment.Content || comment.content}
          </p>

          {activeReplyId === (comment.Id || comment.id) && (
            <div className="mt-3">
              <CommentForm
                submitting={submitting}
                placeholder="Shkruaj pergjigjen..."
                onSubmit={(content, reset) =>
                  onSubmitReply(comment.Id || comment.id, content, reset)
                }
              />
            </div>
          )}

          {getReplies(comment).length > 0 && (
            <div className="mt-4 border-l border-gray-200 pl-4 dark:border-gray-700">
              <CommentThread
                comments={getReplies(comment)}
                activeReplyId={activeReplyId}
                onReply={onReply}
                submitting={submitting}
                onSubmitReply={onSubmitReply}
                onDelete={onDelete}
                userId={userId}
                currentUserName={currentUserName}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PostDetailsPage = () => {
  const { id: postId } = useParams();
  const { userId, isAuthenticated, user, isAdmin } = useAuth();
  const currentUserName = user?.username || user?.email || user?.name || null;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [score, setScore] = useState(0);
  const [deletingPost, setDeletingPost] = useState(false);

  const loadPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await getPostById(postId, {
        currentUserId: userId || undefined,
      });
      setPost(data);
      setScore(data?.Score ?? data?.score ?? 0);
    } catch {
      setError('Nuk u gjet postimi ose pati nje problem.');
      setPost(null);
      setScore(0);
    } finally {
      setLoading(false);
    }
  }, [postId, userId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleCreateComment = async (content, reset) => {
    if (!postId || !userId || !isAuthenticated) return;
    setCommentSubmitting(true);
    try {
      await createComment({
        PostId: postId,
        AuthorId: userId,
        AuthorName: currentUserName || undefined,
        Content: content,
        ParentCommentId: null,
      });
      reset?.();
      await loadPost();
    } catch {
      // ignore for now
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleReply = async (parentId, content, reset) => {
    if (!postId || !parentId || !userId || !isAuthenticated) return;
    setCommentSubmitting(true);
    try {
      await createComment({
        PostId: postId,
        AuthorId: userId,
        AuthorName: currentUserName || undefined,
        Content: content,
        ParentCommentId: parentId,
      });
      reset?.();
      setReplyingTo(null);
      await loadPost();
    } catch {
      // ignore for now
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId || !userId || !isAuthenticated) return;
    setCommentSubmitting(true);
    try {
      await deleteComment(commentId, {
        currentUserId: userId,
      });
      await loadPost();
    } catch {
      // ignore
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postId || !userId || !isAuthenticated) return;
    if (!window.confirm('Fshi këtë postim?')) return;
    setDeletingPost(true);
    try {
      await deletePost(postId, { currentUserId: userId });
      window.location.href = '/posts';
    } catch {
      // ignore
    } finally {
      setDeletingPost(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-200">
        Duke ngarkuar postimin...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-200">
        Nuk u gjet postimi.
      </div>
    );
  }

  const heading =
    post?.Title && post.Title.trim().length > 0 ? post.Title : post?.Content;

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.Municipality} - {post.CategoryName}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {heading}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Publikuar me {new Date(post.CreatedAt).toLocaleDateString('sq-AL')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {postId && (
              <VoteButtons
                postId={postId}
                currentScore={score}
                initialVote={
                  Number.isFinite(post.UserVote)
                    ? post.UserVote
                    : Number.isFinite(post.userVote)
                    ? post.userVote
                    : 0
                }
                onScoreChange={setScore}
              />
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleDeletePost}
                  disabled={deletingPost}
                  className="rounded-md border border-red-500 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/70 dark:text-red-300 dark:hover:bg-red-900/30 disabled:opacity-60"
                >
                  {deletingPost ? 'Duke fshirë...' : 'Fshi postimin'}
                </button>
              )}
            </div>
          </div>

          <PostImagesGallery images={post?.ImageUrls} />

          <div className="prose max-w-none text-gray-800 dark:prose-invert dark:text-gray-100">
            {post.Content}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Komentet
        </h2>
        <CommentForm
          onSubmit={handleCreateComment}
          submitting={commentSubmitting}
          placeholder="Shkruaj nje koment..."
          canSubmit={Boolean(isAuthenticated && userId)}
          disabledText="Kyçu për të komentuar dhe shtuar një koment."
        />

        <div className="mt-6">
          {(post.Comments || post.comments)?.length > 0 ? (
            <CommentThread
              comments={post.Comments || post.comments}
              activeReplyId={replyingTo}
              onReply={(id) =>
                setReplyingTo((prev) => (prev === id ? null : id))
              }
              submitting={commentSubmitting}
              onSubmitReply={handleReply}
              onDelete={handleDeleteComment}
              userId={userId}
              currentUserName={currentUserName}
            />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ende nuk ka komente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
export { PostDetailsPage };
