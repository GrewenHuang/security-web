/**
 * 工具类  Update by Neil 2020-8-25 
 */
var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'

function padding(s, len) {
    let l = len - (s + '').length
    for (var i = 0; i < l; i++) {
        s = '0' + s
    }
    return s
};

export default {
    scrollTop(callback) {
        // 页面总高
        var totalH = document.body.scrollHeight || document.documentElement.scrollHeight;
        // 可视高
        var clientH = window.innerHeight || document.documentElement.clientHeight;
        var result = {}
        window.addEventListener('scroll', function (e) {
            // 计算有效高
            var validH = totalH - clientH
            // 滚动条卷去高度
            var scrollH = document.body.scrollTop || document.documentElement.scrollTop
            // 百分比
            result.percentage = (scrollH / validH * 100).toFixed(2)
            result.scrollH = scrollH;
            callback && callback(result)
        })
    },
    getQueryStringByName: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        var context = ''
        if (r != null) {
            context = r[2]
        }
        reg = null
        r = null
        return context === null || context === '' || context === 'undefined' ? '' : context
    },
    getSubUrl: function () {
        return window.location.host.split('.')[0];
    },
    getOssKey: function (enterpriseName, type, file) {
        let key = "";
        key = key + type + "/";
        key += enterpriseName + "/";
        let nowDate = new Date();
        key = key + nowDate.getFullYear();
        key = key + "-" + (nowDate.getMonth() + 1);
        key = key + "-" + nowDate.getDate();
        key = key + "/" + nowDate.getTime() + file.name;
        return key;
    },
    dateFormat(examSecond) {
        let result = parseInt(examSecond)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result /
            60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        let res = '';
        if (h !== '00') res += `${h}${flag?':':'时'}`;
        if (m !== '00') res += `${m}${flag?':':'分'}`;
        res += `${s}${flag?'':'秒'}`;
        return res;
    },
    durationFormat(duration, flag) {
        let result = parseInt(duration)
        let h =
            Math.floor(result / 3600) < 10
                ? "0" + Math.floor(result / 3600)
                : Math.floor(result / 3600);
        let m =
            Math.floor((result / 60) % 60) < 10
                ? "0" + Math.floor((result / 60) % 60)
                : Math.floor((result / 60) % 60);
        let s =
            Math.floor(result % 60) < 10
                ? "0" + Math.floor(result % 60)
                : Math.floor(result % 60);
        let res = "";
        if (h !== "00") res += `${h}时`;
        if (m !== "00") res += `${m}分`;
        res += `${s}秒`;
        return res;
    },
    formatDate: {
        format: function (date, pattern) {
            if (typeof date == 'string') {
                date = new Date(date);
            }
            pattern = pattern || DEFAULT_PATTERN
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y':
                        return padding(date.getFullYear(), $0.length)
                    case 'M':
                        return padding(date.getMonth() + 1, $0.length)
                    case 'd':
                        return padding(date.getDate(), $0.length)
                    case 'w':
                        return date.getDay() + 1
                    case 'h':
                        return padding(date.getHours(), $0.length)
                    case 'm':
                        return padding(date.getMinutes(), $0.length)
                    case 's':
                        return padding(date.getSeconds(), $0.length)
                }
            })
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP)
            var matchs2 = dateString.match(/(\d)+/g)
            if (matchs1.length === matchs2.length) {
                var _date = new Date(1970, 0, 1)
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i])
                    var sign = matchs1[i]
                    switch (sign.charAt(0)) {
                        case 'y':
                            _date.setFullYear(_int);
                            break
                        case 'M':
                            _date.setMonth(_int - 1);
                            break
                        case 'd':
                            _date.setDate(_int);
                            break
                        case 'h':
                            _date.setHours(_int);
                            break
                        case 'm':
                            _date.setMinutes(_int);
                            break
                        case 's':
                            _date.setSeconds(_int);
                            break
                    }
                }
                return _date
            }
            return null
        }

    },
    getLoginUrl() {
        let subUrl = this.getSubUrl();
        let loginUrl = '/rb-login'; // 系统默认登录页
        // /login 集团
        // let port = location.port;
        // if (subUrl == 'xtbus' || port == 8082 || port == 8090) { 
        //     // 公交
        //     loginUrl = '/bus-login';
        // } else if (subUrl == 'xtroad' || port == 8083 || port == 8810) { 
        //     // 路桥
        //     loginUrl = '/rb-login';
        // }
        return loginUrl;
    },
    change_size(filesize) {
        var size = "";
        if (filesize < 0.1 * 1024) {                         //小于0.1KB，则转化成B
            size = filesize.toFixed(2) + "B"
        } else if (filesize < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
            size = (filesize / 1024).toFixed(2) + "KB"
        } else if (filesize < 0.1 * 1024 * 1024 * 1024) {     //小于0.1GB，则转化成MB
            size = (filesize / (1024 * 1024)).toFixed(2) + "MB"
        } else {                                            //其余转化成GB
            size = (filesize / (1024 * 1024 * 1024)).toFixed(2) + "GB"
        }
        var sizeStr = size + "";                        //转成字符串
        var index = sizeStr.indexOf(".");                    //获取小数点处的索引
        var dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
        if (dou == "00") {                                //判断后两位是否为00，如果是则删除00
            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
        }
        return size;
    },
    openFile(url) {
        if(url.indexOf('http')==-1){
            this.Get("/GetOssUrl", {key:url}).then((result) => {
                window.open(result.data.url);
            });
        }else{
            window.open(url);
        }
    }

}
