/*
 * @Description:
 * @Date: 2020-11-28 12:16:42
 * @LastEditors: Bing
 * @LastEditTime: 2020-12-22 16:39:59
 * @FilePath: \zt-traffic-enterprise-view\src\common\ruleConfig.js
 */
export default {
  /**
   * @author: Bing
   * @method: 数值
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:51:52
   * @return {*}
   */
  Numerical: function (name, required = true, trigger = "blur") {

    var rules = [{ required: required, message: "请输入" + name, trigger: trigger }];

    return rules;
  },

  /**
   * @author: Bing
   * @method: 数值范围
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @param {*} min
   * @param {*} max
   * @Date: 2020-11-28 12:51:21
   * @return {*}
   */
  NumericalRange: function (name, required = true, trigger = "blur", min = 0, max = 1000) {

    var rules = [{ required: required, message: "请输入" + name, trigger: trigger }];

    return rules;
  },

  /**
   * @author: Bing
   * @method: 整数
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:51:07
   * @return {*}
   */
  Integer: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 整数范围
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @param {*} min
   * @param {*} max
   * @Date: 2020-11-28 12:50:58
   * @return {*}
   */
  IntegerRange: function (name, required = true, trigger = "blur", min = 1, max = 1000) {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 小数
   * @param {*} name
   * @param {*} digit 小数位数
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:54:34
   * @return {*}
   */
  Decimal: function (name, digit, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 金额
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:50:32
   * @return {*}
   */
  Money: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 日期
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:50:28
   * @return {*}
   */
  Date: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 时间
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:50:23
   * @return {*}
   */
  Time: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 日期时间
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:50:12
   * @return {*}
   */
  DateTime: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 下拉框
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:50:05
   * @return {*}
   */
  Select: function (name, required = true, trigger = "change") {
    var rules = [];

    rules.push({ required: required, message: "请选择" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 百分比数值
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:49:58
   * @return {*}
   */
  Percentage: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 文本
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-28 12:49:44
   * @return {*}
   */
  Text: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger });

    return rules;
  },

  /**
   * @author: Bing
   * @method: 电话
   * @param {*} name
   * @param {*} required
   * @param {*} trigger
   * @Date: 2020-11-30 14:57:03
   * @return {*}
   */
  Tel: function (name, required = true, trigger = "blur") {

    var rules = [];

    rules.push({ required: required, message: "请输入" + name, trigger: trigger }, {
      validator: function (rule, value, callback) {
        if (
          /^((0\d{2,4}-\d{7,8})|(1[3456789]\d{9}))$/.test(value) ==
          false
        ) {
          callback(new Error("电话号格式错误"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    });

    return rules;
  },

}
