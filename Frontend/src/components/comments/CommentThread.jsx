const noop = () => {};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('sq-AL');
};

const CommentThread = ({
  comments = [],
  onReply = noop,
  onEdit = noop,
  onDelete = noop,
}) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.Id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.AuthorName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.CreatedAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onReply(comment)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Pergjigju
              </button>
              <button
                type="button"
                onClick={() => onEdit(comment)}
                className="text-xs font-medium text-primary hover:underline"
              >
                Redakto
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment)}
                className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
              >
                Fshij
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
            {comment.Content}
          </p>

          {comment.Replies && comment.Replies.length > 0 && (
            <div className="mt-4 border-l border-gray-200 pl-4 dark:border-gray-700">
              <CommentThread
                comments={comment.Replies}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentThread;
export { CommentThread };
