import Vue from 'vue';
import choosePosition from './index.vue';
const chooseUser = Vue.extend(choosePosition);
choosePosition.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new chooseUser({
            data: props,
        })
        const component = Instance.$mount();
        document.body.appendChild(component.$el);
        Instance.show(function (flag, ...arg) {
            document.body.removeChild(component.$el);
            Instance.$destroy();
            if (flag) {
                resolve(...arg)
            }
        });
    })
}
export default choosePosition.newInstance;