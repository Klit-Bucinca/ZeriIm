import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../api/postService';
import { createComment } from '../../api/commentService';
import VoteButtons from '../../components/posts/VoteButtons';

const currentUserId = '00000000-0000-0000-0000-000000000001';

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

const CommentForm = ({ onSubmit, submitting, placeholder }) => {
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
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Duke derguar...' : 'Dërgo'}
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
}) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.Id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.AuthorName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.CreatedAt).toLocaleString('sq-AL')}
                {comment.IsEdited ? ' (redaktuar)' : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onReply(comment.Id)}
              disabled={submitting}
              className="text-sm font-medium text-primary hover:underline"
            >
              Pergjigju
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
            {comment.Content}
          </p>

          {activeReplyId === comment.Id && (
            <div className="mt-3">
              <CommentForm
                submitting={submitting}
                placeholder="Shkruaj pergjigjen..."
                onSubmit={(content, reset) =>
                  onSubmitReply(comment.Id, content, reset)
                }
              />
            </div>
          )}

          {comment.Replies && comment.Replies.length > 0 && (
            <div className="mt-4 border-l border-gray-200 pl-4 dark:border-gray-700">
              <CommentThread
                comments={comment.Replies}
                activeReplyId={activeReplyId}
                onReply={onReply}
                submitting={submitting}
                onSubmitReply={onSubmitReply}
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
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [score, setScore] = useState(0);

  const loadPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await getPostById(postId);
      setPost(data);
      setScore(data?.Score ?? data?.score ?? 0);
    } catch {
      setError('Nuk u gjet postimi ose pati nje problem.');
      setPost(null);
      setScore(0);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleCreateComment = async (content, reset) => {
    if (!postId) return;
    setCommentSubmitting(true);
    try {
      await createComment({
        PostId: postId,
        AuthorId: currentUserId,
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
    if (!postId || !parentId) return;
    setCommentSubmitting(true);
    try {
      await createComment({
        PostId: postId,
        AuthorId: currentUserId,
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
            {postId && (
              <VoteButtons
                postId={postId}
                currentScore={score}
                initialVote={0}
                onScoreChange={setScore}
              />
            )}
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
        />

        <div className="mt-6">
          {post.Comments && post.Comments.length > 0 ? (
            <CommentThread
              comments={post.Comments}
              activeReplyId={replyingTo}
              onReply={(id) =>
                setReplyingTo((prev) => (prev === id ? null : id))
              }
              submitting={commentSubmitting}
              onSubmitReply={handleReply}
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
