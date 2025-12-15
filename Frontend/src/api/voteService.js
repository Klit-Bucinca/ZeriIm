import axiosClient from './axiosClient';

export const vote = (payload) => axiosClient.post('/api/Votes', payload);

export const removeVote = ({ PostId, UserId }) =>
  axiosClient.delete('/api/Votes', {
    params: { postId: PostId, userId: UserId },
  });

export default {
  vote,
  removeVote,
};
