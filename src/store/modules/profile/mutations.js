export default {
  SET_FETCHING(state, status) {
    state.fetching = status;
  },

  SET_USER(state, user) {
    state.user = user;
  },

  SET_POSTS(state, posts) {
    state.posts = posts;
  },

  ADD_POST(state, post) {
    state.posts.unshift(post);
  },

  SET_LIKES({ posts }, { postId, likes }) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (~postIndex) {
      posts[postIndex].likes = likes;
    }
  },

  SET_COMMENTS({ posts }, { postId, comments }) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (~postIndex) {
      posts.splice(postIndex, 1, {
        ...posts[postIndex],
        comments,
      });
    }
  },

  ADD_COMMENT({ posts }, { postId, comment }) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (~postIndex) {
      posts[postIndex].comments.push(comment);
    }
  },

  DELETE_POST({ posts }, postId) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (~postIndex) {
      posts.splice(postIndex, 1);
    }
  },

  UPDATE_POST({ posts }, { postId, text }) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (~postIndex) {
      posts.splice(postIndex, 1, {
        ...posts[postIndex],
        text,
      });
    }
  },

  DELETE_COMMENT({ posts }, commentId) {
    let commentIdx = -1;
    const comments = posts.find(post => {
      if (post.comments) {
        commentIdx = post.comments.findIndex(comment => comment.id === commentId);
        return ~commentIdx;
      }
      return false;
    })?.comments;
    if (~commentIdx) {
      comments.splice(commentIdx, 1);
    }
  },

  UPDATE_COMMENT({ posts }, { commentId, text }) {
    let commentIdx = -1;
    const comments = posts.find(post => {
      if (post.comments) {
        commentIdx = post.comments.findIndex(comment => comment.id === commentId);
        return ~commentIdx;
      }
      return false;
    })?.comments;
    if (comments) {
      comments.splice(commentIdx, 1, {
        ...comments[commentIdx],
        text,
      });
    }
  },

  TOGGLE_SUBSCRIBE(state, { status, user }) {
    if (status) {
      state.user.subscribers.push(user);
    } else {
      const userIdx = state.user.subscribers.findIndex(item => item.id === user.id);
      if (!userIdx) {
        state.user.subscribers.splice(userIdx, 1);
      }
    }
  },
};
