import Vue from 'vue';
import ChooseTechnicalDisclosure from './index.vue';
const chooseTechnicalDisclosure = Vue.extend(ChooseTechnicalDisclosure);
ChooseTechnicalDisclosure.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new chooseTechnicalDisclosure({
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
export default ChooseTechnicalDisclosure.newInstance;