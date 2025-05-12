import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

let Pdf = {
  downPdf (id, name) {
    return new Promise((resolve, reject) => {
        let el = null;
        if (id instanceof HTMLElement ) {
            el = id;
        } else {
            el = document.getElementById(id);
        }
        if (!el) {
            throw new Error('未找到 dom 节点');
        }
        html2canvas(el, {
            backgroundColor: 'white',
            useCORS: true, //支持图片跨域
            scale: 1,     //设置放大的倍数
            height: el.scrollHeight,
            windowHeight: el.scrollHeight
        }).then(canvas => {
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            var pageHeight = contentWidth / 592.28 * 841.89;
            var leftHeight = contentHeight;
            var position = 0;
            var f = "p";
            contentHeight > contentWidth ? f = 'p' : f = 'l';
            var pageData = canvas.toDataURL('image/png', 1.0);
            var pdf = new JsPDF(f, 'px', [contentWidth, contentHeight]);
            pdf.addImage(pageData, 'png', 0, 0, contentWidth, contentHeight);
            pdf.save((name || 'PDF') + '.pdf');
            resolve(true)
        }).catch(err => {
            reject(err);
        });
    })
  },
  downPdfImg (id, name) {
    return new Promise((resolve, reject) => {
        let el = null;
        if (id instanceof HTMLElement ) {
            el = id;
        } else {
            el = document.getElementById(id);
        }
        if (!el) {
            throw new Error('未找到 dom 节点');
        }
        html2canvas(el, {
            backgroundColor: 'white',
            useCORS: true, //支持图片跨域
            scale: 1,     //设置放大的倍数
            height: el.scrollHeight,
            windowHeight: el.scrollHeight
        }).then(canvas => {
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            var pageHeight = contentWidth / 592.28 * 841.89;
            var leftHeight = contentHeight;
            var position = 0;
            var f = "p";
            contentHeight > contentWidth ? f = 'p' : f = 'l';
            var pageData = canvas.toDataURL('image/png', 1.0);
            var pdf = new JsPDF(f, 'px', [contentWidth, contentHeight]);
            pdf.addImage(pageData, 'png', 0, 0, contentWidth, contentHeight);
            const pdfData = pdf.output('blob'); // 修改此行，将输出 Blob 对象保存到 pdfData 变量中
			const formData = new FormData();
			formData.append('file', pdfData, `${name}.pdf`);
            resolve(formData)
        }).catch(err => {
            reject(err);
        });
    })
  }
}

export { Pdf };