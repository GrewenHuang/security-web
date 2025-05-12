import Vue from 'vue';
import ChooseTask from './index.vue';
const chooseTask = Vue.extend(ChooseTask);
ChooseTask.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new chooseTask({
            data: props
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
export default ChooseTask.newInstance;