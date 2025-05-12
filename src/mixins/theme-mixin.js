import { theme, theme1, theme2, theme3} from '@/assets/styles/element-variables.module.scss';
export default {
    data() {
        return {
            themeCluster: [],
            originalCluster: [],
            headHTMLObserve: null, // 监听 head 页面变化，控制主题色
            currentCode: '5005430011',
            replaceColor: theme1,
        }
    },
    computed: {
        defaultTheme() {
            let defaultTheme = window.localStorage.getItem('defaultTheme');
            return defaultTheme || 1;
        },
        isRoadAndBridge() {
            return this.defaultTheme == 2;
        }
    },
    methods: {
        initTheme() {
            if (this.isRoadAndBridge) {
                let styles = [].slice.call(document.getElementsByTagName('style'));
                let list = styles.filter(item => {
                    const text = item.innerText;
                    item.setAttribute('data-class', 'is-update')
                    return new RegExp(theme, 'i').test(text);
                })
                this.setColor(list);
                this.createPageChange();
                this.updateLinkColor();
            }
        },
        createPageChange() {
            const observer = new MutationObserver(() => {
                this.changeTheme();
            });
            const targetNode = document.head;
            const config = {childList: true};
            observer.observe(targetNode, config);
            this.headHTMLObserve = observer;
        },
        changeTheme() {
            if (this.isRoadAndBridge) {
                this.$nextTick(() => {
                    let list = [].slice.call(document.querySelectorAll('style:not([data-class="is-update"]):not([class^=A])'));
                    this.setColor(list);
                })
            }
        },
        setColor(list) {
            list.forEach((item, index) => {
                let oldText = item.innerText.replace(/[\r\n]/g, '');
                if (typeof oldText !== 'string') return;
                let styleEl = document.createElement('style')
                let innerText = this.updateStyle(oldText, this.originalCluster, this.themeCluster);;
                styleEl.innerText = innerText;
                styleEl.setAttribute('data-class', 'is-update')
                document.body.appendChild(styleEl);
            })
        },
        updateLinkColor() {
            let link = document.querySelector('link[href^="/static"]:not([data-link="is-update"])');
            if (link) {
                link.setAttribute('data-link', 'is-update');
                let src = link.href;
                fetch(src).then(res => res.text()).then(text => {
                    let styleEl = document.createElement('style');
                    let innerText = this.updateStyle(text, this.originalCluster, this.themeCluster);;
                    styleEl.innerText = innerText;
                    styleEl.setAttribute('data-class', 'is-update')
                    document.head.appendChild(styleEl);
                });
            }
        },
        updateStyle (style, oldCluster, newCluster) {
            let newStyle = style
            let newStyleStr = newStyle.replace(new RegExp(`(${oldCluster.join(')|(')})`, 'ig'), function(text, ...arg) {
                for(let i = 0; i < arg.length - 2; i++){
                    if (arg[i]) {
                        return newCluster[i]
                    }
                }
            });
            return newStyleStr
        },
        getThemeCluster (theme) {
            const zero = function(num) {
                return num === '0' ? num + '0' : num;
            }
            const tintColor = (color, tint) => {
                let red = parseInt(color.slice(0, 2), 16)
                let green = parseInt(color.slice(2, 4), 16)
                let blue = parseInt(color.slice(4, 6), 16)

                if (tint === 0) { // when primary color is in its rgb space
                return [red, green, blue].join(',')
                } else {
                red += Math.round(tint * (255 - red))
                green += Math.round(tint * (255 - green))
                blue += Math.round(tint * (255 - blue))
                red = red.toString(16)
                green = green.toString(16)
                blue = blue.toString(16)

                return `#${zero(red)}${zero(green)}${zero(blue)}`
                }
            }

            const shadeColor = (color, shade) => {
                let red = parseInt(color.slice(0, 2), 16)
                let green = parseInt(color.slice(2, 4), 16)
                let blue = parseInt(color.slice(4, 6), 16)

                red = Math.round((1 - shade) * red)
                green = Math.round((1 - shade) * green)
                blue = Math.round((1 - shade) * blue)


                red = red.toString(16)
                green = green.toString(16)
                blue = blue.toString(16)
                return `#${zero(red)}${zero(green)}${zero(blue)}`
            }

            const clusters = [theme]
            for (let i = 0; i <= 9; i++) {
                clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
            }
            clusters.push(shadeColor(theme, 0.1))
            return clusters
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                let themeObj = {
                    1: theme1,
                    2: theme2,
                    3: theme3
                };
                this.replaceColor = themeObj[this.defaultTheme];
                this.themeCluster = this.getThemeCluster(this.replaceColor.replace('#', ''));
                this.originalCluster = this.getThemeCluster(theme.replace('#', ''));
                this.initTheme();
            }, 300);
        })
    }
}
