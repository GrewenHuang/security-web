function getNoParamsPath(path) {
    return path.replace(/\=.+&{0,}/ , '')
}
export default {
    addTab(state, arg) {
        for (let i = 0; i < state.tabnavBox.length; i++) {
            if (getNoParamsPath(state.tabnavBox[i].path) === getNoParamsPath(arg.path)) {
                return false
            }
        }
        state.tabnavBox.push({
            title: arg.title,
            path: arg.path
        });
        localStorage.setItem('tabnavBox', JSON.stringify(state.tabnavBox));
    },
    openMenu(state, arg) {
        state.rightNav = arg
    },
    removeTab(state, arg) {
        let index = state.tabnavBox.findIndex(function (value, key) {
            return value.path === arg.tabItem.path
        })
        state.tabnavBox.splice(index, 1)
        
        if (getNoParamsPath(arg.tabItem.path) === getNoParamsPath(arg.fullPath)) { // 移除当前导航时
            let tabActive = state.tabnavBox[index] || state.tabnavBox[index - 1]
            arg.router.push(tabActive.path)
        }
        localStorage.setItem('tabnavBox', JSON.stringify(state.tabnavBox));
    },
    removeOtherTab(state, arg) {
        state.tabnavBox = [{
            title: '首页',
            path: '/dashboard'
        }]
        if (arg.all) {
            arg.router.push('/dashboard')
            localStorage.setItem('tabnavBox', JSON.stringify(state.tabnavBox));
            return false
        }
        state.tabnavBox.push(arg.tabItem)
        arg.router.push(arg.tabItem.path)
        localStorage.setItem('tabnavBox', JSON.stringify(state.tabnavBox));
    },
    collapse(state, arg) {
        state.isCollapse = !state.isCollapse
        if (state.logoShow) {
            setTimeout(function () {
                state.logoShow = false
            }, 300)
        } else {
            state.logoShow = true
        }
    },
    clearTab(state) {
        state.tabnavBox.splice(1, state.tabnavBox.length);
    },
    addIndustryCode(state, arg) {
        state.industryCode = arg;
    },
    addStatusList(state, arg) {
        state.statusList = arg;
    },
    addDrivingLineTypes(state, arg) {
        state.drivingLineTypes = arg;
    },
    addTaskTypes(state, arg) {
        state.taskTypes = arg;
    },
    addDictionaryData(state, arg) {
        state.dictionaryData = arg;
    },
}