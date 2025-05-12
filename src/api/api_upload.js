import axios from 'axios'

//基地址
let base = process.env.API_UPLOAD_URL

export default {

  uploadFile : fileObj => {

    let formData = new FormData();
    formData.set("file", fileObj.file);
    return axios.post(base, formData, { 
        headers: {
          "Content-type": "multipart/form-data"
        }
      }).then(res => res.data).catch(res => res.data);;
  },

}
