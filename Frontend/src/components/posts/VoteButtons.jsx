import { useEffect, useState } from 'react';
import { vote, removeVote } from '../../api/voteService';

const currentUserId = '00000000-0000-0000-0000-000000000001';

const VoteButtons = ({
  postId,
  currentScore = 0,
  initialVote = 0,
  onScoreChange,
}) => {
  const [score, setScore] = useState(currentScore);
  const [userVote, setUserVote] = useState(initialVote); // 1 | -1 | 0
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScore(currentScore);
  }, [currentScore]);

  useEffect(() => {
    setUserVote(initialVote);
  }, [initialVote]);

  const applyLocalChange = (nextVote) => {
    const previous = userVote;
    const delta =
      nextVote === previous
        ? 0
        : nextVote === 1
        ? previous === -1
          ? 2
          : 1
        : nextVote === -1
        ? previous === 1
          ? -2
          : -1
        : previous === 1
        ? -1
        : previous === -1
        ? 1
        : 0;
    setUserVote(nextVote);
    setScore((prev) => {
      const updated = prev + delta;
      onScoreChange?.(updated);
      return updated;
    });
  };

  const handleUpvote = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      if (userVote === 1) {
        await removeVote({ PostId: postId, UserId: currentUserId });
        applyLocalChange(0);
      } else {
        await vote({ PostId: postId, UserId: currentUserId, Type: 1 });
        applyLocalChange(1);
      }
    } catch {
      // ignore errors for now
    } finally {
      setLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      if (userVote === -1) {
        await removeVote({ PostId: postId, UserId: currentUserId });
        applyLocalChange(0);
      } else {
        await vote({ PostId: postId, UserId: currentUserId, Type: -1 });
        applyLocalChange(-1);
      }
    } catch {
      // ignore errors for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleUpvote}
        disabled={loading}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          userVote === 1
            ? 'border-green-600 bg-green-600 text-white'
            : 'border-gray-300 text-gray-800 hover:bg-green-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span>↑</span>
        <span>Voto lart</span>
      </button>
      <button
        type="button"
        onClick={handleDownvote}
        disabled={loading}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          userVote === -1
            ? 'border-red-600 bg-red-600 text-white'
            : 'border-gray-300 text-gray-800 hover:bg-red-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span>↓</span>
        <span>Voto poshte</span>
      </button>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {score} vota
      </span>
    </div>
  );
};

export default VoteButtons;
export { VoteButtons };
