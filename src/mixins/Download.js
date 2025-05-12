export default {
  methods: {
    readFileDownload (data, msg) {
      var res = data
      if (res.type === 'application/json' || res.type === 'application/json;charset=UTF-8') {     // 失败的时候，注意ie兼容问题
        let fileReader = new FileReader()
        fileReader.onload = function (event) {
          let jsonData = JSON.parse(this.result) // this.result是根据event，读取文件后打印的
          if (jsonData.data === null && jsonData.code === 1) {
            Message({
              message: `${jsonData.msg}.xls` || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
        fileReader.readAsText(res)

      }
      if (res.type.includes('application/octet-stream') || res.type.includes('application/vnd.ms-excel') || res.type.includes('application/vnd.ms-excel')) {
        // 成功，注意ie兼容问题
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, `${msg}.xls`)
        } else {
          const url = window.URL.createObjectURL(blob)
          const aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = url
          aLink.setAttribute('download', `${msg}.xls`)
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink)
          window.URL.revokeObjectURL(url)
        }
      }
    }
  }
}