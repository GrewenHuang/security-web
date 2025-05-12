/**
 * 表格合并行
 * 
 * 使用方法：
    // 页面调用方法
    
    add({item, levelIndex, index}) {
        // 合并的列 1 2 对应级别
        let rowspanByColIndexs = {
            1: '0|3', 
            2: '1'
        }
        this.__addTableItem({
            item: item, // 当前列
            index: index, // 当前下标
            defaultItem: _extends(defaultMaintainItem), // 默认字段
            list: this.info.SpotCheckItemList, // 表数据
            rowspanByColIndexs, // 需要合并的列
            levelIndex: levelIndex, // 第几级
            levelLength: 3, // 合并列共几级
        });
    },
    
    remove(item, index, levelIndex) {
        this.__removeTableItem({item, index, list: this.info.MaintainItemList, levelIndex});
    },

    // 接口请求数据需要构建合并行相关字段
    this.__generateSpanData({levelKeys: {1: 'Position', 2: 'Standard'},rowspanByColIndexs: {1: '0|3', 2: '1'}, levelLength: 3, list: res.data.SpotCheckItemList});

    // 同步相同行公共字段值
    this.__syncField({1: ['Position'], 2: ['Standard']}, this.info.SpotCheckItemList);
 */
function comparison(list1, list2, i) {
    return list1.slice(0, i).join('-') == list2.slice(0, i).join('-')
}
export default {
    data() {
        return {
            incrementID__: 0
        }
    },
    methods: {
        __addTableItem({item, index, list, levelIndex, rowspanByColIndexs, levelLength, defaultItem}) {
            let obj = {
                ...defaultItem,
                id: ''
            }
            
            for(let i = 1; i < levelLength; i++) {
                obj['rowspan' + i] = levelIndex == 1 ? 1 : 0;
                obj['levelIndex' + i] = i;
                if (rowspanByColIndexs[i]) {
                    obj['rowspanByColIndexs' + i] = rowspanByColIndexs[i];
                }
            }
            if (levelIndex == 1) {
                let ids = new Array(levelLength - 1).fill(1);;
                ids.unshift(++this.incrementID__);
                obj.id = ids.join('-');
                obj['rowspan' + levelIndex] = 1;
                if (index !== undefined) {
                    let insertIndex = index;
                    if (item) {
                        insertIndex = list.findLastIndex(cItem => cItem.id.split('-')[0] == item.id.split('-')[0]);
                    }
                    list.splice(insertIndex + 1, 0, obj);
                    
                } else {
                    list.push(obj);
                }
            } else {
                let ids = item.id.split('-');
                let lastLevelIndex = levelIndex - 1;
                for (let i = 0; i < ids.slice(0, lastLevelIndex).length; i++) {
                    let id = ids[i];
                    let sameLevelList = list.filter(cItem => {
                        let ids1 = cItem.id.split('-');
                        return ids1.slice(0, i).join('-') == ids.slice(0, i).join('-');
                    });
                    let rowspanKey = 'rowspan' + (i + 1);
                    let rowspanByColIndexsKey = 'rowspanByColIndexs' + (i + 1);
                    let levelIndexKey = 'levelIndex' + (i + 1);
                    let levelItem = sameLevelList.find(cItem => {
                        let ids1 = cItem.id.split('-');
                        return ids1[i] == id;
                    });
                    if (levelItem) {
                        levelItem[rowspanKey]++;
                        obj[rowspanByColIndexsKey] = levelItem[rowspanByColIndexsKey];
                        obj[levelIndexKey] = levelItem[levelIndexKey];
                    }
                    obj[rowspanKey] = 0;
                }
                if (ids.slice(levelIndex, levelLength).length > 0) {
                    obj['rowspan' + levelIndex] = 1;
                }
                let sameLevelList = list.filter(cItem => {
                    let ids1 = cItem.id.split('-');
                    return ids1.slice(0, lastLevelIndex).join('-') == ids.slice(0, lastLevelIndex).join('-');
                });
                let id = 1;
                for (let cItem of sameLevelList) {
                    let otherId = cItem.id.split('-').slice(levelIndex - 1, levelIndex)[0];
                    id = Math.max(id, otherId);
                }
                let newIds = [];
                for (let i = 0; i < levelLength; i++) {
                    if (i == lastLevelIndex) {
                        newIds.push(++id);
                    } else if (lastLevelIndex < i) {
                        newIds.push(1);
                    } else {
                        newIds.push(ids[i]);
                    }
                }
                obj.id = newIds.join('-');
                
                let insertIndex = index;
                if (item) {
                    insertIndex = list.findLastIndex(cItem => {
                        let ids1 = cItem.id.split('-');
                        return ids1.slice(0, levelIndex).join('-') == ids.slice(0, levelIndex).join('-');
                    });
                }
                list.splice(insertIndex + 1, 0, obj);
                this.$forceUpdate();
            }

        },
        __removeTableItem({item, index, list, levelIndex}) {
            let ids = item.id.split('-');
            let removeLength = 1;
            // 当前删除包含子项，子项都需要删除
            if (item['rowspan' + levelIndex] > 0) {
                // 找到所有同级
                let sameList = list.filter(cItem => comparison(cItem.id.split('-'), ids, levelIndex));
                // 同级的最后一个下标
                let startIndex = list.findIndex(cItem => comparison(cItem.id.split('-'), ids, levelIndex));
                list.splice(startIndex, sameList.length);
                removeLength = sameList.length;
            } else {
                // 仅删除自身
                list.splice(index, 1);
            }
            // 更新 rowspan
            for(let j = 1; j < levelIndex; j++) {
                // 上级的 rowspan 是否有值，有值需要转到下一个同级上
                if (item['rowspan' + j] > 0) {
                    let nextItem = list[index];
                    if (nextItem && comparison(nextItem.id.split('-'), ids, j)) {
                        nextItem['rowspan' + j] = item['rowspan' + j];
                    }
                }
                // 找到上级
                let parentItem = list.find(cItem => {
                    return comparison(cItem.id.split('-'), ids, j) && cItem['rowspan' + j] > 0;
                });
                if (parentItem) {
                    parentItem['rowspan' + j] -= removeLength;
                }
            }
        },
        __handlerMergeSpan({ row, column, rowIndex, columnIndex }) {
            let ids = row.id.split('-');
            for (let i = 1; i < ids.length; i++) {
                let regStr = row['rowspanByColIndexs' + row['levelIndex' + i]] || null;
                let reg = new RegExp(regStr);
                if (reg.test(columnIndex)) {
                    let rowspan = row['rowspan' + row['levelIndex' + i]];
                    return {
                        rowspan: rowspan,
                        colspan: rowspan > 0 ? 1 : 0,
                    };
                }
            }
        },
        __syncField(joinKeys, list) {
            if (!list.length) return;
            /**
             * joinKeys = {
             *     1: ['key1'], // 1 表示第几级，数组的每项表示要同步的字段
             * }
             */
            for (let levelIndex in joinKeys) {
                //  将同级别的项进行分组
                let arr = list.reduce((a,b) => {
                    for(let i = 0; i < a.length; i++) {
                        let list = a[i]
                        if (list.find(item => comparison(item.id.split('-'), b.id.split('-'), levelIndex))) {
                            list.push(b);
                            return a;
                        }
                    }
                    a[a.length] = [b];
                    return a;
                }, []);
                // 关联的字段进行赋值
                arr.forEach(list => {
                    let item = list.find(item => item['rowspan' + levelIndex] > 0);
                    joinKeys[levelIndex].forEach(key => {
                        list.filter(cItem => cItem.id != item.id).forEach(cItem => {
                            cItem[key] = item[key];
                        });
                    })
                });
            }
        },
        __generateSpanData({levelKeys, rowspanByColIndexs, levelLength, list}) {
            if (!list.length) return;
            list.forEach(item => {
                let initIds = new Array(levelLength-1).fill(0);
                initIds.push(1)
                item.id = initIds.join('-');
                ++this.incrementID__;
            })
            for (let i = 1; i < levelLength; i++) {
                let level = i - 1;
                let rowspanKey = 'rowspan' + i;
                let spanFirstItem = list[0];
                spanFirstItem[rowspanKey] = 1;
                list.forEach((item, index) => {
                    let preItem = list[index - 1];
                    let ids = item.id.split('-');
                    if (spanFirstItem != item) {
                        item[rowspanKey] = 0;
                        ids[i-1] = spanFirstItem.id.split('-')[i-1];
                    }
                    item['levelIndex' + i] = i;
                    item['rowspanByColIndexs' + i] = rowspanByColIndexs[i];
                    if (preItem) {
                        let flag = true;
                        // 判断字段值是否相同
                        for (let j = 1; j < i + 1; j++) {
                            let key = levelKeys[j];
                            if (preItem[key] != item[key]) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            spanFirstItem[rowspanKey]++;
                            let preIds = preItem.id.split('-');
                            ids[levelLength - 1] = +preIds[levelLength - 1] + 1;
                        } else {
                            let spanFirstItemIds = spanFirstItem.id.split('-');
                            ids[i-1] = +spanFirstItemIds[i -1] + 1;
                            spanFirstItem = item;
                            item[rowspanKey] = 1;
                            ids[levelLength - 1] = 1;
                        }
                    } else {
                        ids[i-1]++;
                    }
                    item.id = ids.join('-');
                });
            }
        }
    },
  }
  