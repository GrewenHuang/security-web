/*
 * @Description:
 * @Date: 2020-11-30 17:24:05
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-25 16:43:44
 * @FilePath: \zt-traffic-enterprise-view\src\mixins\request-mixin.js
 */
export default {
  data () {
    return {
    }
  },
  methods: {
    download() {
        if (!!this.selectedRow.length) {
            this.downloadmbs(100, 1002, this.selectedRow.map(item=>item.SafetyMeetingId));
            this.$refs.listTable.clearSelection();
        } else {
            this.$message.warning('请选择会议');
        }
    },
	dialogEditOpen(index, row) {
	    this.$refs.meetTableInfo.show(row)
	},
  },
  created: function () {
    var that = this;
  },
  mounted () {
    var that = this;
  },
}
