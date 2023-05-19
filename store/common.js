const MENUS_UPDATED = 'MENUS_UPDATED';

const state = () => ({
  menus: [
    {
      title: 'Users',
      icon: 'mdi-account-multiple',
      link: null,
      status: 'active',
      children: [
        {
          title: 'Users',
          icon: 'mdi-account-multiple',
          link: '/users',
          status: 'active',
        },
      ],
    },
  ],
});

const getters = {
  menus: (state) => state.menus,
};

const mutations = {
  [MENUS_UPDATED](state, payload) {
    state.menus = payload;
  },
};

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await this.$axios.$get(`menus`);
      console.log(data);
      // commit(MENUS_UPDATED, data);
    } catch (e) {}
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
