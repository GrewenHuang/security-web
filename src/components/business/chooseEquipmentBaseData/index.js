import Vue from 'vue';
import ChooseEquipmentBaseData from './index.vue';
const chooseEquipmentBaseData = Vue.extend(ChooseEquipmentBaseData);
ChooseEquipmentBaseData.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new chooseEquipmentBaseData({
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
export default ChooseEquipmentBaseData.newInstance;