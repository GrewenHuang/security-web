<template>
  <span>
    <span v-if="data.length<maxLen">
      <span class="tj">{{data}}</span>
    </span>
    <span v-else>
      <span class="tj">{{showBtn?sliceStr:data}}
        <span class="btnWord"
              @click="showBtn=!showBtn">{{showBtn?tip:"收起"}}</span>
      </span>
    </span>
  </span>
</template>

<script>
export default {
  name: "unfold",
  data () {
    return {
      showBtn: true,
    }
  },
  props: {
    tip: {
      type: String,
      default: '全文'
    },
    // 数据
    data: {
      type: String,
      default: ''
    },
    // 最大长度
    maxLen: {
      type: Number,
      default: 80
    },
  },
  computed: {
    sliceStr () {
      if (this.data != null) {
        return this.data.substring(0, this.maxLen) + "...";
      }
      return '';
    }
  },
}
</script>

<style lang="scss" scoped>
.tj {
  text-align: justify;
  line-height: 1.8em;
  display: inline-block;
}

.btnWord {
  color: cornflowerblue;
  cursor: pointer;
  word-break: keep-all;
}
</style>
