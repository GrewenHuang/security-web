let list = JSON.parse(localStorage.getItem('tabnavBox') || '[]');
let tabnavBox = list.length ? list : [
    {
        title: '首页',
        path: '/dashboard'
    }
];
export default {
    userInfo: null,
    loading: false,
    isCollapse: false,
    logoShow: false,
    uniquerouter: true,
    menus: [],
    rightNav: {},
    noMenuPages: [ // 没有菜单的页面
        { path: '/dashboard', title: '首页' },
        { path: '/user/profile', title: '个人信息' },
        { path: '/user/changepwd', title: '修改密码' },
        { path: '/Mail', title: '待办事项' },
    ],
    tabnavBox: tabnavBox,
    industryCode: [], // 公司行业
    statusList: [], // 状态字典
    drivingLineTypes: [], // 线路类别
    taskTypes: [], // 任务类型
    dictionaryData: {}, // 字段中的数据
}