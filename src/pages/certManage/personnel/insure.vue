<template>
    <page-layout :loading="loading" :pages="pages" @current-change="handlePageChange">
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-input placeholder="证件持有人" clearable v-model="filters.SearchText"></el-input>
                <el-select placeholder="证件类型" clearable v-model="filters.CertificateId">
                    <el-option
                        v-for="(item, index) in certList"
                        :key="index"
                        :label="item.CertificateName" :value="item.CertificateId"></el-option>
                </el-select>
                <el-select placeholder="状态" clearable v-model="filters.Status">
                    <el-option label="正常" :value="1"></el-option>
                    <el-option label="预过期" :value="2"></el-option>
                    <el-option label="已过期" :value="3"></el-option>
                </el-select>
                <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
            </div>
            <div class="f--c">
                <el-button type="primary" @click="add(null, certType, certificateClassification)">新增</el-button>
            </div>
        </div>
        <div class="cert-list">
            <div class="cert-item" v-for="(item,index) in list" :key="index" @click="add(item, certType, certificateClassification)">
                <div class="top f-b-c">
                    <div @click.stop>
                        <el-checkbox :label="item.CertificateManageId" v-model="selected"><span></span></el-checkbox>
                    </div>
                    <div class="status" :class="`status-${item.Status}`">{{ StatusObj[item.Status] }}</div>
                </div>
                <div class="middle">
                    <div class="cover-image" :class="{'no-image': !item.CertificateManagePhotos[0]}"
                        :style="item.CertificateManagePhotos[0] ? `background-image: url(${item.CertificateManagePhotos[0].url})` : ''"
                    ></div>
                    <div style="width: calc(100% - 130px);">
                        <div class="name">{{ item.CertificateName }}</div>
                        <div style="margin-bottom: 5px;">证件持有人：{{ item.ItemName }}</div>
                        <div class="ellipsis">
                            {{ getNo(item) }}
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    {{ getDate(item) || '未设置'}}
                </div>
            </div>
        </div>
        <no-data top="120" v-if="!list.length"/>
        <div class="f" slot="selection" v-if="!!selected.length">
            <div class="selected">已选择<span>{{ selected.length }}</span>条</div>
            <div class="remove-btn" @click="remove"><i class="el-icon-delete"></i>删除</div>
        </div>
        <info ref="info" @load="handlePageChange(1)"/>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
export default {
    components: {
        info
    },
    mixins: [request_mixins],
    data() {
        return {
            certType: 2,
            certificateClassification: 2,
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            filters: {

            },
            certList: [],
            selected: [],
            StatusObj: {
                1: '正常',
                2: '预过期',
                3: '已过期'
            }
        }
    },
    created() {
        this.getTemplateCert();
        this.handlePageChange(1);
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
                CertificateType: this.certType,
                certificateClassification: this.certificateClassification,
            }
            this.loading = true;
            this.selected = [];
            try {
                let res = await this.Post('/GetCertificateManages', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        selection(id) {
            let index = this.selected.indexOf(id);
            if (index == -1){
                this.selected.push(id)
            } else {
                this.selected.splice(index, 1);
            }
        },
        getNo(item) {
            let str = '';
            item.CertificateFileds.forEach(item => {
                if (item.IsDefault && item.TextType == 2) {
                    str = item.FiledName + '：' + (item.FiledValue||'未设置');
                }
            })
            return str;
        },
        getDate(item) {
            let str = '';
            item.CertificateFileds.forEach(item => {
                if (item.IsDefault && item.TextType == 4) {
                    let list = (item.FiledValue || '').split(',');
                    let dateStr = '';
                    if (list.length > 1) {
                        dateStr = list[0] + ' 至 ' + list[1];
                        if (list[2] == 1) {
                            dateStr = '长期'
                        }
                    }
                    str = item.FiledName + '：' + (dateStr||'未设置');
                }
            })
            return str;
        },
        add(item, type, classification) {
            this.$refs.info.show(item, type, classification)
        },
        remove() {
            this.$confirm('确认删除选中的数据吗？').then((_) => {
                this.Post('/DeleteCertificateManage', {
                    ids: this.selected,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        async getTemplateCert() {
            let res = await this.Get(`/GetCertificateList?certificateClassification=${this.certificateClassification}&certificateType=${this.certType}`);
            if (res.status == 2000) {
                this.certList = res.data;
            }
            return Promise.resolve();
        },
    }
}
</script>

<style lang="scss" scoped>

.cert-list{
    display: grid;
    grid-template-columns: repeat(auto-fit, 24.133%);
    grid-gap: 20px 18px;
    padding: 0 5px 0 0;
    .cert-item{
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        border: 1px solid #E9F0FF;
        height: 224px;
        cursor: pointer;
        overflow: hidden;
        .top{
            padding: 10px 22px;
            height: 40px;
            background: #E9F0FF;
            /deep/ .el-checkbox__input{
                transform: scale(1.3);
                .el-checkbox__inner{
                    border-color: #DDDDDD;
                }
                &.is-checked{
                    .el-checkbox__inner{
                        border-color: $--color-primary;
                    }
                }
            }
            .status{
                display: flex;
                align-items: center;
                &::before{
                    content: '';
                    border-radius: 8px;
                    margin-right: 6px;
                    width: 8px;
                    height: 8px;
                }
                $colors: (
                    1: #13CE66,
                    2: #FE912E,
                    3: #FE3F51
                );
                @for $i from 1 through 3 {
                    &-#{$i} {
                        &::before{
                            background: map-get($colors, $i);
                        }
                    }
                }
            }
        }
        .middle{
            flex: 1;
            display: flex;
            padding: 17px 22px 15px;
            .cover-image{
                border-radius: 4px;
                margin-right: 20px;
                width: 110px;
                height: 100%;
                background: no-repeat center center;
                background-size: cover;
                &.no-image{
                    background-color: #E2E7EB;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXcAAADXCAYAAADhqxGkAAAAAXNSR0IArs4c6QAAIABJREFUeF7tfXusHNd53+87M7t7n3yLFClRL75JyZRkSlYUyxJlPfyI8wKsFA76SJHUaBqj+aNoigZF6KJokeafJKgLOI0Tt0WaVgpSOAEcGHFs2bUlkaIlUwqpBx+SRUqk+H7fe3d3zlec2Zm9s7MzszO7s7uzy2+hq73cO3POd37n7O988zvf+Q5BXoKAICAICAJjhwCNXYukQYKAICAICAIQcpdBkBsCzx7k8vw1PE3Az4LxAAF3ACAQThBwFMA+S2HfJWDvF3fRpdwqloIEAUGgDQEhdxkUPSOwh1nd+RL+KSn8OwC3BQeV+7v3gf85AcyEtwnYy8DLysJLlzUOfHEX1Xo2RgoQBAQBFwEhdxkIPSHwp6/yMrWA/w24HnvjRa0DK4rg3csCo4+AeRB+7BH+PvP+D3aR8fblJQgIAl0gIOTeBWhySwOBr3yXZ2Ym8TyAj7Z4Ct2Re9vEQMA5JrhEb94Xatj3jz9G5wR/QUAQ6IyAkHtnjOSKCASeZbau78U3wXgq5IH34r23SThBD58IDMZRUtgLYD8pvDg1hR9/ZhMtSCcJAoJAKwJC7jIiukLgT1/iXyfGVyLkld7I3XsE6KTbB+qtEnAAwF4C9hni/8V76e2uGiU3CQJjhICQ+xh15qCa8ocv8ZIljCMAbvLr7Np7z0/CCU4qFwh4malB+HWNvc/cT2cGhY/UIwgUAQEh9yL0wojZ8PWX+J8x46st3nXr4uigvXe3vtgFXQIT8K4JxWSj3zP2OXN45ZmHaW7EoBdzBYHUCAi5p4ZKLvQR+JMX+RtuLHso3GpQ3nsukwrBhF2+rhpk/zI09v78/XRIelkQGBcEhNzHpScH2I4/fZHPAliZG7m3h0Xm7/mne7K4RIT9YOwFYd+8hb3P7KBTA4RWqhIEckNAyD03KG+Mgr7+Q96gCUdSxq5Hk3Q6ou02Xj7fiYHwHjH2Gf3eyDlqFfZ/bh1dvzF6W1o5yggIuY9y7w3B9j/+AX9BKfxZT+QecPlzkViiPP/Qrli3ygyTStxTCQF1Bg4SYS8Y+wzxv3wPDu4h0kPoDqlSEIhFQMhdBkcmBP7kBf59AP+ySX7dkmgE0eZBvi2knFMkTmxb/fIJV4jxIyjs1Q72TZax95Nb6P1MwMrFgkDOCAi55wzouBf3tRf4BQJ+qmdyH2HvPdUEQnjfePZGv1fAvgrh5d076Oq4jw9pX3EQEHIvTl8U3pKv7ueSXcVlAiZ8Y3uSZ7r1+gcxMXh15CgbOQDeMKkUzGItaey7eBCvP/MMmc/lJQjkjoCQe+6Qjm+BX/sB74LCyxl2j7pgxMaf503S/ZZh8tPtG7gQrjHjFZjNVobwS9j75AZ6b3xHkLRskAgIuQ8S7ULWZfb3AGD3v8TXH7+IX1eM/9L02jMsUOboATdtHPVJozG3GdQJRN47cMp49mzkHBOlcx0vPym57wv5zSm6UULuRe+hXO1jYo/Bv/xlEH4H2P5cw7E+dFPn9M/rK/gamP9RN+Te4sHn5AE3y4wYxcNenG17uvFAI88w/+8uuZt/mB/zK5mzTbxOMr8TTBTOW250jm5E59BWHNhNVM91aEhhY4eAkPvYdWlEg5hdv/DLABkyN0S+dha0cPqImp203QOTpivmsKRbceHcydgxYS2/+RUAW7Lq7AOVZrzKcpOOMjydpJrAfJnKk5Aa/nrj5U9IDXxdYncZv/F3/9/un+aY8arR703uHFXB3kfvoHduhKEsbUyPgJB7eqxG8UpiZpfU8fzzCmdWK9w0pdZeraj6jK2cOUs5C0pVSkTzNtGSJcD89SsELHHbOhto8XWrNFsqV46CoXqRWJpef4AJ48oLe+aJ9Xa5OOvxZstjS6qJIdCQVNeb46cMRTM3SDtob8CbbxJ8YP2g4e378o03EbTXbxKj7VMKLzmMl6eAFx/aRJdHcdCKzfkgIOSeD44FLIVpzx7Q9u2gC3dBla+8a1nVO6w5dcG2pi2rdmXOVpOWtXBVWbpEylZElgLVqwvUCIWZCMTEGDKa/GlS9v/sRM7hI/UiT2UKeaoBnm/blRpVX8v1KSWejiQe46Fnta0z0TckFyO+eDpMQ5VZjJlvQOjKMwGZxvt3EM9mXVELyUCNgO9D4X98uAF/9gxJVE4Bv6R9NUnIva/wDqlwZtpjNPVHoVbMHbEqq6ctXJgowbZLsBZKtZpdplqtZJOyqURWXZPFuq4UgZRDhFKpzXCrNPUrTOo3OpFdnNYdJuQW0u5A9m33RnnpAYsjbQgVkkiMoW9FxyeV0ATT1rYm+S4uWfvSlkvh3t9dgm+Suk/4/t/Ne0OiCd4TO2kFMCLCISJ88ZEN9IMhjUipdggICLkPAfT+Vtnw2BvEDsuaPFMiu1ziul2p6FqlSvUJaKvC0BUQlSwomxgWa0cp1VB6tW5fXFUTs78D4OE4kk46NzWK7KLKCRJuFKGHB2vkv6OIOWIyCNvbabJp9lm0l7zYpaG/J02GQQnG19TNZyrotfuE35wAGo0JRNc06g7bFXoSIUIVwBc/sZG+3t/xJ6UXBQEh96L0RE527NmzR+HRR9WKucdcYmenWrFoYkLXSpNkz09ZjjVJJWvCcfQELCwtW5X1lrJXM2HaeO4NMxQIumVsOGT/MphdMd73OiMJMebDJCKOGoQtnyXEr2eaJKKkF8/eYJviPPVgF7W1JzyphCcU8283GsZXzxdL05phfgywipT33vDi3ccpT54xpO8usLp4LHr8keQeACZoGhN+8bGN9H9zGm5STIEREHIvcOdkNY2Z6bnnoABY80s/LFV5slIqlSYX+Nq0Ynu6SjxTUrSiNDn78wrqEaXoDnNtm07uE14UGUZ4wXHEGKu351RGEsGmnRwGVkaHNhvSdhxGtc5YqGl31dp7lGp48r5H73nyDe+96bSn8t69SeCSZty9exOdyDq+5PrRQkDIfbT6K9HaPXtYrV37I+vaPWvs5Qszlau1+lSpUp7W89UlpOzZyuTUU5Zd+ueKaFmbF5pCumgOljjpodcyYjzroIYefnJIS849l9GvNkd42JoZcwsO6g6DFLnk7v4YLz6w8Gqer1om0JQ7dJXC1x7ZQL86RkNfmhKBgJD7mAwL32s/NXPEBlDR5SWTZVSmbe1KKUvL07O/pmzrC27YdAaiiiRFj5B6ItaIMhLlnrDsESM7xJaRpc0hraebSS0tbkltnqs6rhdvGYL3SN734H3PPbwpqpP27g33ulLY8IikOhiTb390M4Tcx6R7fa8d69aVrNL0hJqsT9cdLFGgZVZ55peUXfpSC2dl0LHzIKq0UTRpyTlIuCEujl8TiFsMjZJMoiaTHiaktDJRuC3Gg686GpbruStXrnEjagKRNd1470T40ic2UjOVxJh8DaQZAQSE3MdiODDtMR75c7DXrztbuTKvp2bqNFtXtMyamHqgXJ76QwDGo28Ng+mS4NMSa0dCS+F9d11GjMTTKaonWF9SSGXLdTHt8L1rf4h1hRuAq3N1dwuTL834i6yLsfCNGoITY4p2/PWjm8g9B1de44mAkPs49CszPfsc1LWbUALenZjXa6aJ55ayouWTE8t+H0S7uvGcU8kuGeSOpAXWVHXFec4Rn8cSa0RMehwpJpFzm71dEHzaMuqOxrUFT55xPXgvksZvdyhfTdIEFphgXn90I31kHIa/tCEaASH3MRgZRm//8vOw1l49Wa5N6kmrZs1a1sQyqpQfLJWnvtr0HKO82QzknFaeyUysfSLntBJPotcbetzpp/6ehNuVuUaeMFd7Nz9urpmWfDOx3nvk5EU49ehGWjsGw1+aEIOAkPsYDA1D7n/0I9iT5z4sX5ycnqrUnCWssLxcmvqSskqRWRxbOKtLeSbXMqJ075TEmlbu6GhvjPeddlJLtKNHDX++6qDmcHNhNRj/njolQSvG7z26iW4fg+EvTRByH98xYBZTsf2QPVlZXVkxracYaimxWmHNLP8TAm1Lob+273CMI9aEXC6hW5I3O8U8RSSVMRD9PQXBd7QjRu/vRRpzNOPavOOSu4meaS6qmv5Y3H3W4r0nrgsQvvPoRvrk+H4rpGXiuY/BGNjDrLYfgn3lAir1q2dnUKGluqZWTswu/waAlan07A6ec+5lJESupKorQspJlExiCDeVPu2NkV7IuVdpzMS+X5lzWsIi3R2rgbw0zToCv8QSPOEPHt1IvzkGw1+aIJ77+I6Bzz/7rPXIzH02sKJCtp4pKbUMpFZVJpd9BwQr7A27/+5Rf8+0OJrCG06STGLtzWNxNI8y+rVuEeq4y9frDXL3NjW5mQq8VARp+rNlDULhC49toD8f32+FtEw89zEYA59/lq1H7oNdeffChD3pTNfmJ5bBmVtVnr3pe3GRIGl15Ca/RHn2PerIYdJOrCulTNRVGX0g537o75ev1WBZJtbd360a2LGacsL2x4MDbPzkJjo6BsNfmiCe+/iOgSC5a6VnLKJlitVKNbmsQe49es6xUSdD1N+TPP20be6onafArWMZWfR3r744KSVHcj/32CZaNb7fCGlZ1NO6oDKCCLSTe2UZ6vOr7JlVz4c92XCnF2KjTpadozGEm0km6pf+3oGcU60lJKx9XAp67p73bqoMHo2VSp5R+OZjG+mzIzjUxeQMCIgskwGsol7aidyTpIqwNJK4KJkHseZRRgpvuKs2D1h/zzQhAbh0vQbLpCDwdXeP1TOTO+PfP7aFTH5+eY0xAkLuY9C5acg9iewGqb/HTiZxxNrBG056Eklsc+jGbia1WLmqTxp+mNwXc8y0ppXo5L0T4zOPbaG/GYOhL01IQEDIfQyGRxy5WzOrnm/Tb2M857QEn1Z/b+HOLjdJJWrnKcm572XkvKicpOFfDnnu3ZA7Ebg8gVUPr6fzYzD0pQlC7uM9BmLJfXrV8/1OlJXkOacl1o6LknETUhcSTyp7e3ha6NiWCE09SRoL2tsk93C0TIdIplA/HH18M20c72+EtC48zgWREUUgkdw7EFWvi3xRg6iTLODDHHwK6EiKEe1Ikngy6dkZF1gnS0DJ7B5goOYA8/Uc9g2kCGXMg9wV8L8e20y/PKJDXczOgIDIMhnAKuqlWcm9ScgZvci2iaBHiSeJnNPKRJnLSIhGaZl0IiaT2Qng5lnAVoA58tT8OBqo1oHzc8BCI7eX++pKw+8g8fjk7p+t6u9QNecqRh2VGDXJasZvPrGV/qCoY1nsyg8BIff8sBxaSXHkrqYDmnufFvmCCeJb9P2cteikCSntOkBamSiKnFdMAbcsBTQArVvJ3SV6DZy/DnjJGxMJPtGOBNyueKGQPZG7xsNPbKMXhzZYpeKBISDkPjCo+1dRErkneZFpSaajZBIja3STi6XF3i43SXW0N4Onay6dKAFb1ywSehy5OwycuQqY93A7el77IMCQu4rZoRoncbX0AaFK72Pp7t0037/RKCUXBQEh96L0RA92pCZ3j3FaPOwYonM/jiLtDrJG7hp+ARKM3bESWDYV8NhjPHfjwV+rApcXFjsz7dNCGtyuXO+R3IH9j2+hB3oYanLrCCEg5D5CnRVnaidyT/KGk+SOJIJPq79nWthM4VEnPYnE2tvj5qS71wG2lY7czQLrmWu9L7BGrTm4mrvvuZuDOrxUv/61nbx3Ar7y+Bb6jTEY8tKEFAgIuacAqeiXxJL7VCMU0n/1Y5EviE0nculkh7nfKBpRTwyRC6xZFkczEHxYw991W0NqacoxCZ67uebU1dY2JE1IaaUxU4bx3Hshd9b4J09so/9e9PEs9uWDgJB7PjgOtZQ4cqepVc+njTrJQjJxk0S3C5ttTxYBNNvsDxN6FoLPksMm8M3YeYs53i4dufuee9JTRLf6u0vuSrkeu5/215TVkn4g4elHAdt2b6E3hzpYpfKBISDkPjCo+1dRErn3g2Q6LlhGEG7YjjCht/zddd8beEVNGG1PCFnWAbrQ8DesApZMpiP361XgYmC5Ms/EbD2S+6XHN2M5EXnLvf0bj1JyMRAQci9GP/RkRSdy75bg0yzyhb3QMCFHTgQB8m6TaoJeu18Ym6PkvD+Y3w1Bh+WmqFDPKEkqgzzj4zZTATatTkfuRm833nvwldemLndBNZA4LDb9QJT3Tvj2E1voyZ4Gmtw8UggIuY9Ud0Ubm4bcYwk+S/x7yN3uRsNv2uETvO9H+oWF/u1/HF407PR5nNffnExCIz92vcAraO1SYPWMFw4Zo7kbj/2KFykTLD5WrsqCvQmF7I3c/+MTW+i3x2C4SxNSIiDknhKoIl8WR+4wmnuUJ+x9lqidR3l/OWVuDGLZ5sRzzKKqf1aoZ5exvUn4vizTL/3dq3PVNLB6tiEVBXeo1jVw4Tpw1Q+BjLIjajIJtKXlCSbmiePqXIzn3qEcU5wCfu7xrfRXRR7HYlu+CAi554vnUEpLIveQsx0du56RZLrRkVvIyxC477V6ZO467GFv3p+EAodAe2dCNw6GDni+wc/b2hwzUSWFacbhZlIPGJmmbDXMNSkHjM5uyD7L00I36xa9kLvlYO3uHXRqKANUKh0KAkLuQ4E930pjyX2yPSukS0AxnmFSFEda/T2SWP0Pg5KLR+rmTyYR15pZYPkUUFIN0jS6tdnOf+pyg0Bd79N11xv2Gwm+TXv3yT6D/p4pDr+PuLXhGzEhXZnzomWI3IOyjebuRssEZs6YJ7X3ntxKt+c76qS0oiMg5F70HkphXydyDxNuLMFn0ICzlBHD7S45374cWLvEC4sJED57E4HxiA3Bv3d+0VN3OU0tEnzQlhbPPoRd3KSWNoY+S5s7afgtTzIeQJ0IvltyJ+C5J7bSMymGklwyRggIuY9BZ8aRO096mnsPWnRYamjxDFPqyFEQm1u3rWls6zcvX5bxnXuf3P3PTdbFw6cb17pevCH3gKfejPWO0OZbiDTG++4m1ULLpNllDH2WMq56m5j8xGFutIz/BJPsvf/rJ7fS743BUJcmZEBAyD0DWEW9tCO5BxikG3IOLryGnwKSJJ7mtSE5xmRWNIm4bpr2SD0FuZsizl4Fjp7xPPgAubskH9TgUy6wdtS9U+A2kDK8Srold23h0ac30/eLOn7Frv4gIOTeH1wHWmoSuYc9wyzkHKPfBjMaNDzpKG/YfBbeLuMtpN62HLh9RePvTU/dc9/jPHf/cyPPfHCp4bUb793V38PkHvRmR1B/b+sj7wND7i1ZIWF090DUUIT3TgRHL2Dp0zvp2kAHpVQ2dASE3IfeBb0b0Incm2QRIc/EknMXm33CLfEHVzAIxoQTbrvZu7ILcjcavJFnLs4tEnuY3N3JJkGe6UebOz4RZcE+Zu3DjZYJJg4zskwncgdee3Ib7ex9lEkJo4aAkPuo9ViEvWnIPYngg4t/YU+/0yJf01mM0d9d7dzz4k0I4c5bAYsiNPaUnrspz5x+dOgUMFdrJ3hfe28jvS4P6R4WblFRPO6CqqXcKBnLJXYvWibiySmw6euPntxGXxyDYS5NyIiAkHtGwIp4eRy5a39B1TM6rXaeRPBJZTQJyY9j97QU82biwj96W+Pd4/GuZBl/odWERx78AKjzoizje/D+e3DiadnhGsTDI33LSDxoZH8Mb6xKxK0FrPjj9dJin6ThG889LbkH+uLXntpOf1zEcSs29RcBIff+4juQ0mPJfaI9zj0Pkon19GNaa+Kw710PLJkAwlEwWTX34P1mR+gb3rYcX4N34989og7uYA2221VtCJitAOb4PPNu/m1sYd04bMPIPubgjeYEEfolTobpuMCaRZ7xJg6/TJfco7JCBiaYsF1OHTs/fQ+9NpCBKJUUCgEh90J1R3fGJJJ7iCCSZAb3b1GLoynKaHq7AbfX/ZWB7Wsb2/Zdjz3gzXezoBq+/+w14NjZht2u9x3a4NS2c9VcR8D65cDyyVZ5KBiOaeq5NA98eCV692mbXBWDW54x9GFybyYOi8+Bf/WFrVi6h8gEKMnrBkNAyH0MOrwjufewOBr2eINwtXjwAW3dk9jdS80RdXetDETF5EzuprgTF4CTl9NF0FRsYMPKxrmo7mTj/c/12gO/+xOP0fXfvwSY/DFJE2Mu6xYBD7zlV086SiT3CO+dCN97ahs9NgZDXJrQBQJC7l2AVrRb4sjdmQgkDsuw+zQtUfkkHjeIjLdujqhr8dD7QO6myCNngEsdImhM6OSWm4Cp8mIPdiJ38/e5KnD8UuOpY5D6e5jgr4VkmaDnHvXURQr/+amt9FtFG69iz2AQEHIfDM59rSWJ3KM8QN+YPPT3YPlBaWZmEti1vhGL3m9yNzaYCJo3P2wQcTj+3Y+g2XiTJ8UEHi3SkLux3+jw5ukgjGfI2e5K1kpbhkvuJlrGO4kpuEM18qmC8fmnd9Bf9HXwSeGFRUDIvbBdk96w1OTuMUDLoluA6dPqyC1heuHQEi8y5mN3AEYCaZE6+qC5Bzc9VR3gjZMRETQKuHVpIIfN4kFPHWWZoP3nrwFnr7cTfFe4hU6ZSlOGHy2jAuRurGk5Zi+o/Zdx29Mb6Xj6kSRXjhMCQu5j0JudyD3JM4z0+AKYxC6whtx///A24zWbA6VNZIx5DZLcTX1XqsDbHzbq9iNoVk41tP/gZqdF4xbtjNLcw5+dutLw4rvCrUdpLAu5E+Hk09vIiGLyukEREHIfg46PJfdKIxQyxMPN3ZvBpgd19jbPPi6Cxluo9SNYTHkfuQW4eUlCVEwfNHd3EgmUazzsd84thjveubIRX+8mGwslHPN19LgF1TC5mx2yH1wGrteSCT7LusXiTBHQ9CMWwX1ZxnjuDb09InHY4n3f+NR2+vkxGN7ShC4REHLvErgi3RZH7vVKa1bIprfp/RInz7RcF0Ey4b/7WGy4CTCHSYfJdhCaezhE0kS4GJK/fWVDHjJ54i2rEQbpavIR7UrjuZtrjL5/4hJgZKA81i3SltEkd0PqPsGHs0L6Ey7h3356G/2nIo1TsWWwCAi5DxbvvtSWRO4uEcd53lnT1Ib1dV/wJuDm2UZqAf8VG88+AM/dn0zMRiTzMl57yQJs82NIPkjuHgbBNAlpFllrdeDE5QbRJ4aLZsHeuzZOf08i97YJ18YTn95Cf9eXASeFjgQCQu4j0U3JRnYi98wEn0QyPjkbUvR+XzIJmAXUZs6YpIXTAZK7IezL8w3sDLkHCd7V4wNpgs2xf36KyjTkbq41MfAfXAmESHYg505PRHHSmN9/fihkU5Yx3ntgYTYwyWguYflnNpEX3zMGg1yakBkBIffMkBXvhjTknkTwqXdRep67z4Pm3UgeD29ovKeSXwZI7qbNZvPRlbmGJOMTvPHcjQfvE7zvevtfhrTkbq67sgCcvtoYE5nXLbIssBLQFufuhcm4x+wFJhYC3vjUDtpevJEqFg0SASH3QaLdp7riyL3ma+5evd0u8vncEYxjN2RiPPWH7gSWhrbxm+uLIMv4drgEv9AgdCPRmHcj0RiSb4ug8fsodHB3LOGjcdbrBbOByr83woPvFvvgF/T6fGtumZYzVFvJ/euf2kG/0qfhJsWOCAJC7iPSUUlmJpF7mxQQ8vKa5cbp74GKmx6+x/L3r29Exrgk6v0vGHee6fNe7497IvA+N1kkTYSLWVgN6+/+AmtzEvMkp1QRNN5EZrz3q9UcF1gjJghD7koptETLhPLWu20g/ItPb6f/OgZDW5rQAwJC7j2AV5RbY8m93J4V0vvyBzl9sRlxMkFEQ7esATat7sJDH7AsE3yCMLtXTYSL8dp9kjfee9CDd5sao7/7slPUROYe5H0FmK/HyzNJ2KeRxtKSu6Ww6+lt9KOijE+xYzgICLkPB/dca00kd4+s4iIw2jz7mBHR/JiBdcuA+2/zPPYOHnNqj77Pnrtvh5FnDBG3LLB64ZHBA7f9DuoYHul57uY6rRsLrDU/RLIHeabZL4EyIsk9EA3lST9zx+ew9Iu7yIvEz3WoSWEjhICQ+wh1VpypceReLbfGuQc7u6MGHA579Co3aXIfvsvLGdONtj5Ez9143obYDcEbT7lJ8L73bjT4wGSYKjwyQO6mfPNkcNKLoGk+BQTSHYRJu2Vy7RCaOhcly7ST+4uf2UEPj8Gwlib0iICQe48AFuH2juQeYJCuCZ6BSgl4dBMw4eeMGUFydz1sj+DNgrC7wOr9uPKMf9iHN7ll8dx92Wa+BnzoRdDEEnygI1q+hAkEH7mgGsotA8IffHYH/WYRxqXYMFwEhNyHi38utSeRe9gzTJJh4gaDe0oRNyJj1pgF1ODB1iMmy/gLvsbDNhq8772X7MXwyOYBHz5YfnujImhCnrtfvomeMYd9BCNo0kpjUeenms+a5E7UXFQ1JgYThwH4wmfvpj/PZWBJISONgJD7SHdfw/hO5J706O/+LcaLDKwrYtUM8PENOUTFDFmWaUbzALhqyDcoz4TSEzS97i7I3excff9y4ykhKIGlIviYhe3rC160TEL6AdbY8DMfoWNjMKylCT0iIOTeI4BFuD0NuTcJPssiX6BxJrWAScCVeoE0q0dv6urHE0HCZGLkE+PBG2mm7HnuJga+5QzWiPujMIj67My1fBOMueROXihkdG6ZqiJ8nuo4QcCJp3fizOI+4iKMVLFhkAgIuQ8S7T7VFUfuC6VVz0d65SkI3p0MAouqj20GluWxWalAnruJarle9XLP2I13PyzSlTpiQiLTkvvF+YY007U0FvLg2xZUQ+kHFFC1CFcCw2wBjA9AOMGM9wEcB+MdsnG0PI+ju++ji30aklJsARAQci9AJ/Rqwjfe5Fm1gE0EZ7Nm3swOb9bgu05cLv9UpH4bYJuWBdbwaDCSgvfZ09uBydJ4ee5GOrm6sJhYzOjuZpHVpCpwo2Z8nLqQZcwahYnKOe8lL+tWGgv2XydyN8RuA9fSjidmXADxMYCOgnDMYbyjCMeq13Hsc7vIO5YkbWlyXdEQEHIvWo8k2POtA7z/y6D2AAAZY0lEQVS6XMJdjsIGMDYwYyOR+36LWVfTmklrrTRDOVqrn1wsrfYJqi1KxmObWA3Y87D9xdQntgGzlfEi97oDXPM896YsY4jdSyoW7Iqgt57Wczdeu/Heg6/M+ntgTSQx/UAjOdoZBYRqzD7AySwVME6AcJSAI4pwFBpHjce/ewudzV6i3DEMBITch4F6hzq/dYCnycYmRdgCjS1E2MLmB7wi6taGekIw5M6sldZQdc3qJxft5kk8aXZABp3VpiThSRMP3gHcsmy8yN2kJFioNfT2Zkhkzpq7mTzSYt9p70ESuROBy8TvmWHQzyFNoPPM+i1mvKUUv6XZemthOd7+3Drx9PuJezdlC7l3g1qO93z7GK+hufoOKHsHEbay5i2k6BZmbioDnaprONkEZiZHs9IOW3V2rHcvlNcnyS5xXmTwHl92v3U58MDt40XuRpIxr5Z870bn9vK9N+MYu5BlzG7V45ca0TKZpLEW/aY1lDJpE5MiVCcsfrfTWOnH34lIs+b3SdFbDus3bajXLRsHP7GJzvSjPikzHQJC7ulwyuWqb7/Oaywb28B6Byu1Hcw7AHhnF3VfhScTkGaQRoPcHe1Yxy6U70y7QSbEKd50sWiT8T6f3AZMlfsU1WKqGmC0jMkUaRZTzQamsskS6UXLGM29hYy9J5essow5KMTEujdfWQ9G8W4M9t+cHwoZccxeSeFiWbFZNC3S6yyIDirCQdY4VC3h0NMb6XSRDBxnW4Tc+9S7zzJbNx/BFs3YCY17GdgJwpp+VOeTu/HcNbNyHG3XHbaOXShtaiPtBJKJGgzBz26abaQeCMa/Z07tW4BoGWOCIXbTDv90pmYK4Bx2qBq556SJcQ+lHYjbnBQ5sQaA939NIveyjRNlheLr4YwPofBjAg7UCQfOb8RbzxA5/fhe3OhlCrnnNAK+eZiXTDi4x1a4hzV2MngHEU3kVHxiMYasmEGstXIYShty19o+eqG81b+xozzjMUwswXuMfquXNMzXkUeN3I1MYjI3GrubxO4fvRfOLeODl0GWMWWb3DKuHBPhffeivyeR+6TFb5QsCiY9GMTQ67kOZp4n0EFD+OzgNdZ4ffeO0WtHz0D0oQAh9y5B/cGbPFsj7LQs3Msa9xHz5oZaO/iXmy8FrKBBddaW1mzXHW0fPVe+e3H/e0C/jTgcOjaKIxDr7g+WldPA3bd4ce9ZNysN0XM3oY9m05J5BU9jCsa2h8m3JTImIf2Aw8AlT4oJ70pt8cyzyDMhl96Qu6UUzCEdzZzujScNPVvifcqociP/Ys1Eb4PwCgiv6gW8JmTfXacKuafE7ZuHuTLjeuT6AVLqXjBvNOGHKW/v62Wu5w4i1qyM1q417Fpdl46cL+/sFIHR5l16IyLOgw9wPZZMwE1LYHR4s7Mz+Ao4rs1Tmczfg58H/+F/3vx7y4WB+4KTQ6BC/wnC50NzAId5GaI1IY/m3dzqp/U1f/dPYQqepereH9H4YPlBwjcThn8QiCH4liekADl3u/YRtCWK3E0VtsKV2TK/2tdBNrzCNZiOkMKrrLH/qsKBz2wibyl8eEaNQs1C7gm99MPDvKGunV2KrPuJ+B5mmOXEwr24IeaSdsxiqmM7GkaWKb19rvzRJr9EkXYGL7JtEgihECYvl0kj6ox9QgidQRoGuVl+pxOjIrTqJmEH7vWTbTWThAX+5hNqrK0Z1i3i8vYkRdCEv5R+GS3k7uWXMW2bsHB8qsRvF25g9sEgIlSZ6XWQsx9c/9Ejmyckj04MzkLuAWC++w4vKy/U70fZvg9af5SZlvdhfOZepEvuJltA3bEcwHLJ3XHKb50tf6xJyjGkl4VkAo5oSxuiPN24gZWUpMwtNGpCiCgs/EQSnsSCtrobsbyizX1N8vbrCtYZJu6kySKAQtzk05xYvGtbPPtQuxInPgKC5G6kGfLSD8yU8VrF4g9yH1gjUSCfJyPh1PWr1Yr9yu47JaVCJ0dsJLo1DyN/8CavUzYeBONBELaBYOVR7iDLcIxKSSBmqHrdjZQpOVobcm8e2hArz2TR34MEZQr00xMEtRqPVYN5aVwyDcosCd53rJ1xRwC2ubkBacSzL44020jeb1+Y0LMQfIenlfAEmWWBda66qLm7He7+AMsq+G7Jxsgtpub+HWE4BBwiC/vqC3j541vpBp3wGsjegJ47096j2MSEj2mtHyRSzV2cuQ+2ARXoMLvqgtZmMRVWzeGy8dzfPFv5RIunGOrxOC8y6IVGDZJE79PL/Z55MvEnhRhvuM2ODmSf2LbAxNRG/D2QcxJuaSetpDLmo8m9tnoafz2goTZS1TDrD5jVPkvhpYc24MiNliHzhiD3Z59l69aPYrsCHmDWDwCI3MY/UiM3YGwjFJKUST1gJBnHccq1OpffOFd5vM1TDHzQ0vkZ9femN56BZHuN8w67I0lSSFMOCeRTj7u+RWOPwSdWMsmAW6/6+3xgE5Nyp3My+WROrpjQ/29Ux+4A7T5PpPYpjX3vvoo3n3lm/GPrx5bc9+/nElbhnmpdP6AU7idgeoADaaBVmfg3Eymj2ejtbGuNUq3uVA6drjwVJtQmd0V4qFn09ybZxW2vD0gx3ZBaknzRcVIKti1GYokler/nMkxakdJKxJNIc8Lx5Z/gU0romxg1mcxX6zCk3gyDJGCqhH1LJ/jwQAfcqFdGuMpQr3Ad+0uX8PquMT1MfOzI/aWjvIkUHiYyOrqeGvVxmM5+BW28djftAFxyX6jXJ944XfmM7+2GOzp2YTMFyTT5L0ycYUkl+Pe4a6M836iJJ+7EqDgZxSfQTuQet+YQJxPFtCOLdt7t3oOg5+7GuhM5q2fwnKV0z5kg042zMbyK1TUG9jEvvPjQhomxmiTHgtz3v8WrHNt5SBE9RAqNNLc30EvXQWx2sGi2HAd2nXW5VteVv/+w8nNxckKsBpxhgTUPHTmt15uoZ0dNSD2Qc9ong1RPF3GTT9Qk0UHiWfA8dxMlo0CYrNBrK8p6n7Jbtw/cQEM/16ayxmkofkHPWXs/to3O5Vr4EAobWXLfs4fVz/xD7CALjwIw2+xHti299Lu7O9XRrgLrGHJnEwapyzWHK4dOlz+nGRXfe28jo9AHaaSKpDI6kmLg5uC1mWSbFJ5zRzvyeDKIKiOL/h6DRZw0xmBUa05TlrGUurJmSv+FUphXluIbcvD38sVJvtd8rd6wFb73kfU4SOTGfo3ca+TGxMGDPLMwUX+IbfXTrMdrYbSX0cMEMrKMdmA2MZWqjlN583Tps1VNS+NIu8kvGYkqrcST1wJqy0QQR4oJsk2bvRmJtW/rFhmkKmZGte5AKQVLUXXlpP7LyQqdIcP68uonAueU1i9cmr/w0u4dq0cq3HRkyP2VY3w7CA8D2mRXtPvZm6NWtptQRMMk1VYOk+1oXarVuHL0nP3xKzVl0iQsPtZELRSm8IZzLSOj55yWnNPKREmTWlqZyC1jgLg5WkObxzKbriyb4G9Ol/ikIqWhTFIhefUdAUINpA6gjhfvv4t+0vf6cqig0ORuUti++h62KcInwPr2HNo7lkUYcjcenVM3pzBpu86wq3WunL1Gt7930f6U3+hE2SULUfWgIycSa0jz6Uomyll/T5rUYieTrIu/KfT3utmZZvHbKybp+xM2X1FK1S3bdLfhd3kNEgFN+AlYff++2/BGkSWbQpK7CWMsrandr7X1U2SJ9JJu4Cp4KX8tkxHSSDP1ulP5+1PlX6g65OaRD5JliEe9BAaLNXVFrDmTc1rtvK0tGeSONJEraXFLJVd1mBij2kzE5yas2rdnKuqUpVCzSdUtCw4ppRtZ4+U1DATYwXmQ+qFzGj8uYjhlocj9heM8OWPjQdZ4gBiTw+iwUazTHOkG0uRoEGkoh7RVr6Pk1Ll85jqtf/eC/Qt+BsuuiCrLQmEWYvVYORUpRlwb9JxTlZGFWAet4cfjpqft+l9OWXzCsqlq26hZrByT4NlSYLBiPwPmKI7dcbCZCXOk8PLVOvY9vJ6C528NtXmFIPcDp3jaquNBDdwHKmbmxaH2UprKtcmMasIhodgckG0O7ECD4N85rz527rr18U7yjMuffSTntLHgsXZk2FiURxlF0N8rlvOD2bLeaymu2rZyvXZSWiultLuYKsye5tsxmGsYVbLwykrGvnUFODB8qOTeIPX6gw7UTiWLpD0NQO1oKEtB68aJTOZbv6DrJXbMblUuv3Wm/KmrVfpILwSflpzTatFNOaVfGn4W/T2g7QRvS0vw/WhzyeIDSyvVb5UUGdKoVZRdI2ht5BhlVDivz3saOHJz/gho1AB9QJfsl3feTNfyryBdiUMh9/3MpfL79V3Ksu9j1qV0pspV6RAw21tAdXPkXs0srmrbYWU7NV3+yQXro+fmrMc0YyKtPBPgPLf6SM++B3JOtCNncs5Vw8/S5qy4KcxP2vydGav2qlVS1bJCjQDHKqm6rUyWCTDMKSEjl7803Qgel6uIVE079Vert9j7dxHVBt2ugZK7iX459F51u7LKDzDdKKkBBtelgaU1I88Qa0fVNSxmsnRjc1PpWg1L3rtgPXq1an2EU25w6kiKKbzegZQRQbjdTki5a/gp1i2IsFBSzmszJed7FQuXbUvVFKFOxI6tzAKq5XrsfgJliZIZ3Herl5qY+bpWzt6715bfHGR0zcDI/c33rq1zVOVhpayROACjl84swr2G3OFoqhOUOcRDk6V0vWY7ZFk1R9saKJ2+Yt11vYqbaxrLNJS7k5XYKPeNYRE1OMIk3SbzeB8kScFt5UZo6S31h24Ik1pYEgni31aXSmhXRIMj64oBJwqbKAwb66DU2FXKesEiXLQtnJypOO9Ao1ayVN1ix1F2qa7Y0WRbjs3QsNzFU9m0VIQvWBc2aO1csPTCC1tvmx5Invm+k/vhw1xxprCL2dlkWfIc2cWYyHyLdwa0OXfP5DU1ETRUr5NVh6OILFUHFDuOxebdxMabgz40KRMwresOKfO8L25hZtxT3eAGLzpQtmXoGqTYLJAw2aYboIks46VrZkeX7ZKj4GhWYMtkdVamy0SNSYVzQS9yHAdE1mHrOvZv6vNZsH0l9zdO8h0EZxcYEwXFemzNcjyGN/Op4RB3B2vjQA8THE0mokazS+Hmd9Lw2N1sdtWGZySCOu/B4c+XSimXpDXMBiTF5EktitxO0ApgEw1j3r0dqBzsz7ztkvKGgABhnmHt37aW3u1X7X0h9/0f8NQ01R9QRDf3y3ApNx0CLilY5j8LDhzSxnHQcD168yRVq9WUcdPdScC5MZOvpUMy/6uUBZe0Tby6sowQ45h+MGlk2PzNgsUOHJj/5KE3f/yLUCJp6+RlYP+uPoRO5k7uh09cv1VVJu+FdspFAE9sAHyvz32kN1sbHYcMWxjZxtC+41Tdd3kNAwFD6GU2DO7KLi7BN4jefwmxD6NfBlinsqp6Ye7Hm26dOpFnrbmRu0kZsOo23K0Jt+ZpoJSVLwIuaRi28F1690xheQ0fAaOnL/aNrE8Nv0cGbYFinDj7Hv4+r1QGuXyx37nAy+rz9XttyxZtfdAjIqf6HNS9kiThZk6QdiimgbclCU4HA/eI1FJ36vP2hP3jO5fTxV5N7pncjQxDdmmzOfWrV2PkfkFAEBAEbnQEmKEd235ryyp6vxcsuiZ3syHp2NmFTQrW2l4MkHsFAUFAEBAE2hHQbH9w10040u3Gp67I/bvfZXv9Tmy1ub5EOkUQEAQEAUGgPwjUyb58/ADe3L2bfN00dUWZyZ2ZS8cvYAu0pORNjbJcKAgIAoJAtwgozK1fjrcoY36aTOT+zjs8oSaqG6yJsiT76raj5D5BQBAQBDIiYGlUb16Bo0S0kPbW1OT+DvNE5QruIJKA6LTgynWCgCAgCOSFADOchVm8eyfRfJoyU5H74cOHKxNL169XQuxpMJVrBAFBQBDoCwKa4cxfOn5806ZNHT34juRucq+vu4h1lhB7XzpLChUEBAFBIAsCDsNZuwzvEyUvsiaS+7PPsvXQbqyx3DSB8hIEBAFBQBAoAgKOhvPSd/HhM8+YNFHRr0RyP36JV1QsOdO0CJ0pNggCgoAgEERgwUF1/VI6n5ncT53i6akpSdUrw0kQEAQEgaIicP065m+OOac10nPfv39/6a677poqaoPELkFAEBAEBIEGAseOHbu+a9eutjNaI8n9+HGeNBlhBTxBQBAQBASBYiPgOOD162kubGUbgTOzSQAmC6jF7k+xThAQBASBIAIOmWN4Aq9o79wckiwvQUAQEAQEgdFAgKjt4HQh8dHoOrFSEBAEBIFMCAi5Z4JLLh42AseZJ+vXsFTVMVWdwyRsVEoKFdaoaA1b2bDMuzk3kM07wWJqvLufAY7Zxk2MuvuuUDefKYW6rjfeSWGhprGAOhbKk5jTNq7b07i0ntp1zWHjIfULAnEICLnL2BgaAocPc4WX4JZKCWsdxlo4WAuFm8FYw4wVirAUwFLNWEaEpQwsIwzv6CIG6gRcZMYlRbio0XhnjQtQ+FBrnFIWTlqEkws1nKTLeH/TpvSJnobWEVLxWCIg5D6W3VqcRh09z0uhsRkONiuFTQA2a2AzMe4AYWVxLO2TJYxzTHhXAW8DeFtrHIbG28vKeGvlSrrcp1qlWEFAwh1lDOSHgDmd68h5bLc1nmLgcQDbAdwByBGMEShrMN4F4RAD37EVvnXbCrzR7ak7+fWilDQuCIjnPi49OaR2vHeG11UZTypgNxM+ScCtQzJl5Ktl4IQi/K2j8b0y4W9vu4k+GPlGSQOGhoCQ+9CgH+2Kj13gnVzDf1CET7Psi8i/M8ld8P0bWPjtDSvo9fwrkBLHHQEh93Hv4T6079gZ/lUQvgKWpHJ9gLe1SMYCCF+66yb6b32vSyoYKwSE3MeqO/vfmIMHuTyxGmcIkMPR+w+3WwMDl+9ahRVE8eldB2SKVDNCCAi5j1BnFcXUY2f49wD8q6LYM+52EOF371xF/2bc2yntyxcBIfd88bxhSjt2mp+Bwu/ChDTKq18I/IQYv3Xnavo//apAyh1fBITcx7dvB9Kyd8/xw9rBL0HhZ4Xoc4Cc8C6Av7IUnr19Bf0whxKliBsUASH3G7Tj+9Hs9y7yBqeGJ0B4UDPupUac+0Q/6hqTMucZOATGAUXY6zD+buNqOjImbZNmDBkBIfchd8A4V8/M1jtnsZEI2wBsY2CLu1sV2HxD7E71O5dxzuxOhcLbBLzlOHhTKRy6cxWOyCLpOH8Dhts2Iffh4n/D1n76NM9cJdyigHWOxjoC1rLCWgXcrIE1CljOjGVQjfwy4OHllGnrJEIdwCVw44cJ5hzLDwk4CY1TDJxUCu9r4INZxgerV9PVG7ajpeFDQ0DIfWjQS8VZEDh4mmdmCUu0SSDWSCJmQjFN3hr3dwXMgjEBQoUJFTAqJhNkpzpMZkgQFsjEkzdiyuc1cIWAy1C4ZEjc/E6MSwvA5brGpR1C1p1glb8XAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I2AkHveiEp5goAgIAgUAAEh9wJ0gpggCAgCgkDeCAi5542olCcICAKCQAEQEHIvQCeICYKAICAI5I3A/weIjG0EE7uOwQAAAABJRU5ErkJggg==);
                    background-position: center 65%;
                    background-repeat: no-repeat;
                    background-size: contain;
                    position: relative;
                    &::after{
                        content: '未设置图片';
                        position: absolute;
                        bottom: 14%;
                        width: 100%;
                        font-size: 12px;
                        text-align: center;
                        color: #959595;
                    }
                }
            }
            .name{
                margin: 16px 0 11px;
                font-size: 18px;
                font-weight: 600;
            }
        }
        .bottom{
            border-top: 1px dashed #D2E0FF;
            padding: 12px 22px;
            height: 43px;
            text-align: center;
        }
    }
}

.selected{
    margin-right: 30px;
    color: #959595;
    span{
        color: #1C1D2F;
    }
}
.remove-btn{
    color: #FE3F51;
    cursor: pointer;
    i{
        margin-right: 5px;
    }
}
.ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
