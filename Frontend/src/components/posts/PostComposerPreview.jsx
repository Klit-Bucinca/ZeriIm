const PostComposerPreview = ({ onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-theme-sm transition hover:-translate-y-[1px] hover:shadow-theme-md focus:outline-none focus-visible:ring focus-visible:ring-primary/30 dark:border-gray-700 dark:bg-gray-800"
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {/* Simple avatar placeholder */}
        <span className="text-sm font-semibold">P</span>
      </div>
      <div className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 transition dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        Çfarë keni në mendje?
      </div>
    </div>
  </button>
);

export default PostComposerPreview;
export { PostComposerPreview };
