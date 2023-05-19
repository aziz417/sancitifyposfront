const POST_CONTENT_UPDATED = 'POST_CONTENT_UPDATED';

const state = () => ({
  postContentPagination: null,
});

const mutations = {
  [POST_CONTENT_UPDATED](state, payload) {
    state.postContentPagination = payload;
  },
};

export default {
  state,
  mutations,
};
