import { useEffect, useState } from 'react';
import { vote, removeVote } from '../../api/voteService';
import { useAuth } from '../../context/AuthContext';

const VoteButtons = ({
  postId,
  currentScore = 0,
  initialVote = 0,
  onScoreChange,
}) => {
  const { isAuthenticated, userId } = useAuth();
  const [score, setScore] = useState(currentScore);
  const [userVote, setUserVote] = useState(initialVote); // 1 | -1 | 0
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScore(currentScore);
  }, [currentScore]);

  useEffect(() => {
    setUserVote(initialVote);
  }, [initialVote]);

  const handleUpvote = async () => {
    if (!postId || !isAuthenticated || !userId) return;
    setLoading(true);
    try {
      const { data } =
        userVote === 1
          ? await removeVote({ PostId: postId, UserId: userId })
          : await vote({ PostId: postId, UserId: userId, Type: 1 });
      setScore(data?.score ?? score);
      setUserVote(data?.vote ?? (userVote === 1 ? 0 : 1));
      onScoreChange?.(data?.score ?? score);
    } catch {
      // ignore errors for now
    } finally {
      setLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (!postId || !isAuthenticated || !userId) return;
    setLoading(true);
    try {
      const { data } =
        userVote === -1
          ? await removeVote({ PostId: postId, UserId: userId })
          : await vote({ PostId: postId, UserId: userId, Type: -1 });
      setScore(data?.score ?? score);
      setUserVote(data?.vote ?? (userVote === -1 ? 0 : -1));
      onScoreChange?.(data?.score ?? score);
    } catch {
      // ignore errors for now
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !isAuthenticated || !userId;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleUpvote}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          userVote === 1
            ? 'border-green-600 bg-green-600 text-white'
            : 'border-gray-300 text-gray-800 hover:bg-green-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        } disabled:cursor-not-allowed disabled:opacity-60`}
        title={!isAuthenticated ? 'Vetëm shikim si mysafir' : ''}
      >
        <span className="text-lg">↑</span>
        <span>Voto lart</span>
      </button>
      <button
        type="button"
        onClick={handleDownvote}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          userVote === -1
            ? 'border-red-600 bg-red-600 text-white'
            : 'border-gray-300 text-gray-800 hover:bg-red-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        } disabled:cursor-not-allowed disabled:opacity-60`}
        title={!isAuthenticated ? 'Vetëm shikim si mysafir' : ''}
      >
        <span className="text-lg">↓</span>
        <span>Voto poshtë</span>
      </button>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {score} vota
      </span>
    </div>
  );
};

export default VoteButtons;
export { VoteButtons };
