<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <div>
          <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
            返回
          </el-button>
        </div>
        <h1 class="text-jumbo text-ginormous">
          无法查看此页
        </h1>
        <h2>你没有权限查看页面</h2>
        <h6>如有疑问请联系系统管理人员</h6>
        <ul class="list-unstyled">
          <li>或者你可以:</li>
          <li class="link-type">
            <router-link to="/dashboard">
              回到首页
            </router-link>
          </li>
          <!-- <li class="link-type">
            <a href="http://www.hnztaqkj.com/">随便看看</a>
          </li>
          <li><a href="#" @click.prevent="dialogVisible=true">点我看图</a></li> -->
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
    <el-dialog v-dialog-drag  :visible.sync="dialogVisible" title="随便看">
      <img :src="ewizardClap" class="pan-img">
    </el-dialog>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-2);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  h1{
    margin: 40px 0px 40px 0px;
  }
  h2{
    margin: 30px 0px 30px 0px;
  }
  h6{
    margin: 10px 0px 10px 0px;
  }
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
    .pan-back-btn {
      margin-top:20px;
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
