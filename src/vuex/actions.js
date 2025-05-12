import request from '@/api/index';

function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export default {
    addTab({ commit }, arg) {
        commit('addTab', arg)
    },
    openMenu({ commit }, arg) {
        commit('openMenu', arg)
    },
    removeTab({ commit }, arg) {
        commit('removeTab', arg)
    },
    removeOtherTab({ commit }, arg) {
        commit('removeOtherTab', arg)
    },
    collapse({ commit }, arg) {
        commit('collapse', arg)
    },
    clearTab({ commit }, arg) {
        commit('clearTab', arg)
    },
    addIndustryCode({ commit }, arg) {
        commit('addIndustryCode', arg);
    },
    addStatusList({ commit }, arg) {
        commit('addStatusList', arg);
    },
    addDrivingLineTypes({ commit }, arg) {
        commit('addDrivingLineTypes', arg);
    },
    addTaskTypes({ commit }, arg) {
        commit('addTaskTypes', arg);
    },
    addDictionaryData({ commit, state }, id) {
        return new Promise((resolve, reject) => {
            let obj = _extends(state.dictionaryData);
            request({
                url: `/GetSpecialityCom?ParentCode=${id}`,
                method: 'get',
            }).then(res => {
                obj[id] = res.data;
                commit('addDictionaryData', obj);
                resolve(obj[id]);
            }).catch(err => {
                console.err(err);
                reject();
            });
        })
    },
}