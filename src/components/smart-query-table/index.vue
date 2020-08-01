<template>
  <div class="query-table">
    <smart-query-form ref="queryForm"
                      class="query-form"
                      v-if="formFields.length > 0"
                      :form-fields="formFields"
                      @formSubmit="formSubmit"></smart-query-form>

    <slot name="middle-tools"></slot>

    <div class="table-wrapper">
      <smart-tool-bar ref="toolBar"
                      class="smart-tool-bar"
                      v-if="tools.length > 0"
                      :tools="tools">
      </smart-tool-bar>
      <smart-table-list ref="tableList"
                        class="smart-table-list"
                        v-loading="loading"
                        :columns="tables.columns"
                        :operation="tables.operation"
                        :options="tables.options"
                        :tableData="tableData"
                        @sort-change="sortChange"></smart-table-list>
      <el-pagination class="smart-pagination"
                     ref="smartPagination"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <slot name="bottom-tools"></slot>
  </div>
</template>

<script>

export default {
  name: 'smart-query-table',
  props: {
    option: {
      type: Object,
      default: () => { }
    },
    tools: {
      type: Array,
      default: () => []
    },
    formFields: {
      type: Array,
      default: () => []
    },
    tables: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      queryModel: {}
    }
  },
  created () {
    // initHttp 控制初始化表格是否请求
    if (this.tables.options && this.tables.options.initHttp !== false) {
      this.initTables()
    }
  },
  methods: {
    // 初始化
    initTables () {
      const obj = this.getModel()
      this.fetchTable(obj)
    },
    // 主动
    loadTable (callback) {
      const obj = this.getModel()
      this.fetchTable(obj, callback)
    },
    // 搜索
    formSubmit (model = {}) {
      this.currentPage = 1
      this.queryModel = {} // 清空条件
      this.tables.url.obj = {} // 清空传递默认条件
      this.fetchTable(model)
    },
    // 请求
    async fetchTable (model = {}, callback) {
      const obj = this.tables.url.obj || {}
      this.queryModel = Object.assign({}, obj, this.queryModel)

      this.queryModel = Object.assign({}, this.queryModel, {
        ...model,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      })

      // 请求前回调函数
      if (this.tables.options && typeof this.tables.options.beforeHttp === 'function') {
        this.tables.options.beforeHttp()
      }
      try {
        this.loading = true
        const res = await this.$http.post(this.tables.url.method, this.queryModel)
        console.log('query-table请求数据！', res)
        if (this.tables.type === 'customHeader') {
          this.tables.columns = res.header
        }
        this.tableData = Object.freeze(res.data)

        // 请求成功后回调函数
        if (this.tables.options && typeof this.tables.options.afterHttp === 'function') {
          this.tables.options.afterHttp(this.tableData, res)
        }

        this.tableData.forEach((item, index) => {
          this.$set(this.tableData[index], 'index', ((this.currentPage - 1) * this.pageSize) + (1 + index))

          // 自定义列表输出文字
          if (this.tables.formatter && Object.keys(this.tables.formatter).length > 0) {
            Object.keys(this.tables.formatter).forEach((key) => {
              if (Object.keys(item).indexOf(key)) {
                this.$set(this.tableData[index], key, this.tables.formatter[key](item))
              }
            })
          }
        })
        this.total = res.total

        // 为了解决异步队列问题
        if (callback && typeof callback === 'function') {
          callback(this.tableData)
        }
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    // 获取form表单参数
    getModel () {
      const obj = {}
      this.formFields.forEach((item, index) => {
        // 初始化数据
        obj[item.columnName] = !item.defaultValue && item.defaultValue !== 0 ? null : item.defaultValue
      })

      return obj
    },
    // 切换条数
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchTable()
    },
    // 切换页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchTable()
    },
    // 排序
    sortChange (val) {
      this.fetchTable(val)
    }
  }
}
</script>

<style scoped lang="scss">
.query-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.query-form {
  flex: none;
}
.table-wrapper {
  flex: 1;
  height: 100%;
  background: #ffffff;
  border: 1px solid #dee8f8;
  margin-top: 12px;
  padding: 12px 20px 8px 20px;
  display: flex;
  flex-direction: column;
  .smart-table-list {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
  .smart-tool-bar {
    flex: none;
    padding-bottom: 5px;
  }
  .smart-pagination {
    flex: none;
    text-align: right;
    padding: 8px 0 0 0;
    /deep/ .btn-next {
      margin-right: 0;
    }
    /deep/ .el-pagination__total,
    /deep/ .el-pagination__sizes {
      float: left;
    }
  }
}
</style>
