import createPersistedState from 'vuex-persistedstate';

export default ({store, req, isDev}) => {
  createPersistedState({
    key: '__CNode__',
  })(store);
};
