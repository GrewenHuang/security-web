import Vue from 'vue';
import ChooseSpecialConstruction from './index.vue';
const chooseSpecialConstruction = Vue.extend(ChooseSpecialConstruction);
ChooseSpecialConstruction.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new chooseSpecialConstruction({
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
export default ChooseSpecialConstruction.newInstance;