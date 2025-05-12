import Vue from 'vue';
import ChooseEquipment from './index.vue';
const chooseEquipment = Vue.extend(ChooseEquipment);
ChooseEquipment.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new chooseEquipment({
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
export default ChooseEquipment.newInstance;