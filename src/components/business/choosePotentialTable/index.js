import Vue from 'vue';
import ChoosePotentialTable from './index.vue';
const choosePotentialTable = Vue.extend(ChoosePotentialTable);
ChoosePotentialTable.newInstance = properties => {
    return new Promise((resolve, reject) => {
        const props = JSON.parse(JSON.stringify(properties || {}));
        const Instance = new choosePotentialTable({
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
export default ChoosePotentialTable.newInstance;