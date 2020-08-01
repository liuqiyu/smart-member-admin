<template>
  <div class="query-form">
    <el-form :model="model"
             :inline="true"
             size="mini"
             label-position="right"
             label-width="70px">
      <el-row :gutter="10">
        <el-col v-for="(item, index) in formFields"
                :xs="item.lg || 6"
                :sm="item.lg || 6"
                :lg="item.lg || 6"
                :xl="item.xl || 4"
                :key="index">
          <form-item v-if="!!item.show || false"
                     :item="item"
                     v-model="model[item.columnName]"
                     :key="index"></form-item>
        </el-col>
        <el-col :span="4"
                :class="{lineFeed: lineFeed}">
          <div class="query-form-btns">
            <el-button type="primary"
                       icon="iconfont icon-sousuo"
                       @click="onSubmit">
              查询
            </el-button>
            <el-button type="text"
                       icon="iconfont icon-zhongzhi"
                       @click="onReset">重置</el-button>
            <el-button v-if="(needControl && lineFeed) || false"
                       type="text"
                       @click="onControl">
              {{status ? '展开' : '收起'}}
              <i class=" el-icon--right"
                 :class="!status ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import formItem from './form-item'
export default {
  name: 'smart-query-form',
  props: {
    formFields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      model: {},
      lineFeed: false, // 换行
      needControl: false, // 需要控制的按钮
      status: true
    }
  },
  mounted () {
    this.initForm()
    this.__resizeHandler = () => {
      this.status = true
      this.formItemControl()
    }
    window.addEventListener('resize', this.__resizeHandler)
  },
  components: {
    formItem
  },
  methods: {
    initForm () {
      this.formFields.forEach((item, index) => {
        // 初始化数据
        this.$set(this.model, item.columnName, !item.defaultValue && item.defaultValue !== 0 ? null : item.defaultValue)

        switch (item.type) {
          case 'daterange':
            this.$set(this.formFields[index], 'lg', 8)
            this.$set(this.formFields[index], 'xl', 6)
            break
          case 'datetimerange':
            this.$set(this.formFields[index], 'lg', 8)
            this.$set(this.formFields[index], 'xl', 6)
            break
          default:
            this.$set(this.formFields[index], 'lg', 6)
            this.$set(this.formFields[index], 'xl', 4)
            break
        }
      })
      this.formItemControl()
    },
    onSubmit () {
      this.$emit('formSubmit', this.model)
    },
    onReset () {
      this.formFields.forEach((item, index) => {
        // 初始化数据
        this.$set(this.model, item.columnName, null)
      })
      this.$emit('formSubmit')
    },
    onControl () {
      this.status = !this.status
      this.formItemControl()
    },
    formItemControl () {
      if (!this.status) {
        this.formFields.forEach((item, index) => {
          this.$set(this.formFields[index], 'show', !this.formFields[index].hidden)
        })
        return false
      }
      let total = 0
      this.formFields.forEach((item, index) => {
        if (this.formFields[index].hidden) return false
        if (document.body.clientWidth >= 1920) {
          total += item.xl
        } else {
          total += item.lg
        }

        if (total + 4 > 24) {
          this.$set(this.formFields[index], 'show', false)
          this.needControl = true
          this.lineFeed = true
        } else {
          this.$set(this.formFields[index], 'show', true)
          this.needControl = false
          this.lineFeed = false
        }
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.__resizeHandler)
  }
}
</script>

<style scoped lang="scss">
@import "~@/style/variable";
.query-form {
  background: #ffffff;
  border: 1px solid $borderColor;
  padding: 10px 10px 0 10px;
  .query-form-btns {
    margin-left: 5px;
    margin-bottom: 5px;
    /deep/ .el-button {
      height: 28px;
      .iconfont {
        display: inline-block;
        height: 12px !important;
        font-size: 12px !important;
        margin-right: 2px;
      }
    }
  }
  .lineFeed {
    float: right;
    text-align: right;
  }
  .el-row {
    .el-col {
      // padding: 0 !important;
    }
  }
}
</style>
