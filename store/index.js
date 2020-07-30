import Vue from 'vue';
import { CancelToken } from 'axios';
import { validTabs } from '~/common/constants';
import { lazy } from '~/common/utils';

export default {
  // =================================================
  // State
  // =================================================
  state: () => {
    const state = {
      items: {
        /* [id: number]: Item */
      },
      topics: {
        /* [page: number] : [ [id: number] ] */
      },
      user: null,
      users: {
        /* [id: string]: User */
      },
      createdTopics: {},
      collections: {
        /* [name: string]: User Collect */
      },
      loading: false,
      // page: '',
      messages: {
        /* [name: string]: { read: [], unread: [] } */
      }
    };

    validTabs.forEach(tab => {
      state.topics[tab] = {};
    });

    return state;
  },
  // =================================================
  // Actions
  // =================================================
  actions: {
    FETCH_ITEM({ commit, state, dispatch }, { id, mdrender = true }) {
      return lazy(
        item => commit('SET_ITEM', { item }),
        async () => {
          let item = await this.$axios.$get('/topic/' + id, {
            params: {
              mdrender,
              needAccessToken: state.user && mdrender ? true : ''
            }
          });

          if (mdrender) {
            await dispatch('FETCH_USER', { name: item.data.author.loginname });
            return item;
          } else {
            item.data.text = item.data.content;
          }

          return item;
        },
        Object.assign({ id, loading: true, replies: [] }, state.items[id])
      );
    },

    FETCH_TOPIC({ commit, state }, { tab, page, prefetch }) {
      if (state.topics[tab][page] && state.topics[tab][page].length) {
        prefetch = true;
      }

      if (!prefetch) {
        if (this.topicCancelSource) {
          this.topicCancelSource.cancel(
            'priorotize topic: ' + tab + ' page: ' + page
          );
        }
        this.topicCancelSource = CancelToken.source();
      }

      return lazy(
        items => {
          const ids = items.map(item => item.id);
          commit('SET_TOPIC', { tab, ids, page });
          commit('SET_ITEMS', { items });
        },
        () =>
          this.$axios.$get('/topics', {
            params: {
              page,
              tab,
              limit: 40,
              mdrender: true
            },
            cancelToken: this.topicCancelSource && this.topicCancelSource.token
          }),
        (state.topics[tab][page] || []).map(id => state.items[id])
      );
    },

    async FETCH_ACCESSTOKEN({ commit, state }, { accesstoken, from }) {
      let user;
      try {
        // commit('SET_STATE', { loading: true })
        let res = await this.$axios.$post('/accesstoken', { accesstoken });
        user = res;
        user.accesstoken = accesstoken;
      } catch (err) {
        user = null;
      } finally {
        commit('SET_STATE', {
          user
          // loading: false
        });

        if (user) {
          if (from) {
            window.location.href = from;
          } else {
            this.$router.push('/');
          }
        }
      }
    },

    async LOGOUT({ commit }) {
      try {
        commit('SET_STATE', { user: null });
        this.$toast.success('退出登录成功');
        setTimeout(_ => {
          this.$router.push('/');
        }, 1000);
      } catch (err) {}
    },

    FETCH_USER({ commit, state }, { name }) {
      return lazy(
        user => commit('SET_USER', { name, user }),
        () => this.$axios.$get('/user/' + name),
        Object.assign(
          { name, loading: true, replies: [], topices: [] },
          state.users[name]
        )
      );
    },

    async CREATE_TOPIC({ commit, state }, { tab, title, content }) {
      try {
        commit('SET_STATE', { loading: true });
        await this.$axios.$post('/topics', {
          tab: 'dev', // 防止误操作😆
          title,
          content,
          accesstoken: state.user.accesstoken
        });
        this.$toast.success('创建话题成功');
        setTimeout(_ => {
          this.$router.push(`/${tab}`);
        }, 1000);
      } catch (err) {
      } finally {
        commit('SET_STATE', { loading: false });
      }
    },

    async UPDATE_TOPIC({ commit, state }, { id, tab, title, content }) {
      try {
        commit('SET_STATE', { loading: true });
        await this.$axios.$post('/topics/update', {
          topic_id: id,
          tab: 'dev', // 防止误操作😆
          title,
          content,
          accesstoken: state.user.accesstoken
        });
        this.$toast.success('更新话题成功');
        setTimeout(_ => {
          this.$router.push(`/${tab}`);
        }, 1000);
      } catch (err) {
      } finally {
        commit('SET_STATE', { loading: false });
      }
    },

    async COLLECT_TOPIC({ commit, state }, { id, cancel }) {
      try {
        commit('SET_STATE', { loading: true });
        await this.$axios.$post(
          `/topic_collect/${
            cancel ? 'de_collect' : 'collect'
          }`,
          {
            topic_id: id,
            accesstoken: state.user.accesstoken
          }
        );
        this.$toast.success(`${cancel ? '取消' : ''}收藏成功`);
        commit('SET_ITEM', {
          item: Object.assign({}, state.items[id], { is_collect: !cancel })
        });
      } catch (err) {
      } finally {
        commit('SET_STATE', { loading: false });
      }
    },

    FETCH_COLLECT({ commit, state }, { name }) {
      return lazy(
        collections => commit('SET_COLLECT', { name, collections }),
        () => this.$axios.$get(`/topic_collect/${name}`),
        { loading: true }
      );
    },

    FETCH_MESSAGE({ commit, state }) {
      return lazy(
        data => commit('SET_MESSAGE', { data }),
        () => this.$axios.$get('/messages', { params: {
          accesstoken: state.user.accesstoken
        }}),
        { loading: true }
      );
    },

    async REPLY_TOPIC({ commit, state, dispatch }, { id, content, reply_id }) {
      let data = { content, accesstoken: state.user.accesstoken };
      if (reply_id) {
        data.reply_id = reply_id;
      }
      try {
        let res = await this.$axios.$post(
          `/topic/${id}/replies`,
          data
        );
        if (res.success) {
          this.$toast.success('回复话题成功');
          dispatch('FETCH_ITEM', { id });
        }
      } catch (err) {}
    },

    async STAR_TOPIC({ commit, state }, { id, reply_id }) {
      try {
        let res = await this.$axios.$post(
          `/reply/${reply_id}/ups`, {
            accesstoken: state.user.accesstoken
          }
        );
        if (res.success) {
          this.$toast.success(`${res.action === 'up' ? '' : '取消'}点赞成功`);
          commit('UPDATE_TOPIC_STAR', { id, reply_id, data: res });
        }
      } catch (err) {}
    }
  },
  // =================================================
  // Mutations
  // =================================================
  mutations: {
    SET_ITEM: (state, { item }) => {
      if (item) {
        Vue.set(state.items, item.id, item);
      }
    },

    SET_TOPIC: (state, { tab, ids, page }) => {
      Vue.set(state.topics[tab], page, ids);
    },

    SET_ITEMS: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          Vue.set(state.items, item.id, item);
        }
      });
    },

    SET_USER: (state, { name, user }) => {
      Vue.set(
        state.users,
        name,
        user || false
      ); /* false means user not found */
      if (
        user &&
        !user.loading &&
        state.user &&
        user.loginname === state.user.loginname
      ) {
        // 如果获取的是当前登录用户
        Vue.set(state, 'user', Object.assign({}, state.user, user));
      }
    },

    SET_COLLECT: (state, { name, collections }) => {
      Vue.set(state, 'loading', !!collections.loading);
      Vue.set(state.collections, name, collections);
    },

    SET_MESSAGE: (state, { data }) => {
      Vue.set(state, 'loading', !!data.loading);
      Vue.set(state.messages, 'read', data.has_read_messages);
      Vue.set(state.messages, 'unread', data.hasnot_read_messages);
    },

    UPDATE_TOPIC_STAR: (state, { id, reply_id, data }) => {
      state.items[id].replies = state.items[id].replies.map(v => {
        if (v.id === reply_id) {
          v.is_uped = data.action === 'up';
          if (v.is_uped) {
            v.ups.push(state.user.id);
          } else {
            v.ups.splice(v.ups.indexOf(state.user.id), 1);
          }
        }
        return v;
      });
    },

    SET_STATE: (state, data) => {
      if (Array.isArray(data)) {
        data.forEach(item => {
          Vue.set(state, item.type, item.value);
        });
      } else if (data.type && data.value) {
        Vue.set(state, data.type, data.value);
      } else {
        Object.keys(data).forEach(key => {
          Vue.set(state, key, data[key]);
        });
      }
    }
  }
};
