import store from '@/vuex/store.js';
import request from '@/api/index';

function requestGet(url, data) {
    return request({
        url: url,
        method: 'get',
        data
    })
}
function requestPost(url, data) {
    return request({
        url: url,
        method: 'post',
        data
    })
}

/**
 * 获取所属行业
 */
 requestGet('/GetIndustryCode').then(res => {
    store.dispatch('addIndustryCode', res.data);
}).catch(err => {
    console.error(err)
})

/**
 * 获取状态字典
 */
 requestGet('/GetStatusCom').then(res => {
    store.dispatch('addStatusList', res.data);
}).catch(err => {
    console.error(err)
})

/**
 * 获取任务类型
 */
 requestGet('/GetTaskTypeEnumCom').then(res => {
    store.dispatch('addTaskTypes', res.data);
}).catch(err => {
    console.error(err)
})