import store from '@/vuex/store.js';
export default {
    getDictionaryById: (state) => {
        return async (id) => {
            if (state.dictionaryData[id]) {
                return state.dictionaryData[id];
            } else {
                return await store.dispatch('addDictionaryData', id);
            }
        }
    }
}