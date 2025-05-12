import request from "./index";
// export default {
//   GetList: data => {
//     return request({
//       url: '/GetLogbooksReport',
//       method: 'get',
//       data
//     })
//   },
// }

export function GetList(data){
    return request({
        url: '/GetLogbooksReport',
        method: 'post',
        data
      })
}