import moment from 'moment'
import $http from './http'

/**
 * 日期时间格式
 * @param date
 * @param fmt YYYY-MM-DD HH:mm:ss
 * @returns {string}
 */
export const date = (date, fmt = 'YYYY-MM-DD') => {
  let str = ''
  if (date) {
    str = moment(date).format(fmt)
  }
  return str
}

/**
 * 秒
 * @param d
 * @param fmt
 * @returns {string}
 */
export const time = (d, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return date(d, fmt)
}

/**
 * 分
 * @param d
 * @param fmt
 * @returns {string}
 */
export const minute = (d, fmt = 'YYYY-MM-DD HH:mm') => {
  return date(d, fmt)
}

/**
 * 时分秒 - 10:25:47
 * @param d
 * @param fmt
 * @returns {string}
 */
export const second = (d, fmt = 'HH:mm:ss') => {
  return date(d, fmt)
}

/**
 * 年-月
 * @param d
 * @param fmt
 * @returns {string}
 */
export const month = (d, fmt = 'YYYY-MM') => {
  return date(d, fmt)
}

/**
 * 金额 人民币
 * @param num
 * @returns {string|*}
 */
export const money = (num) => {
  if (typeof num !== 'number' && !num) {
    return ''
  }
  if (typeof num === 'string' && num.indexOf('**') > -1) {
    return num
  }
  return `￥${(+num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/**
 * 千位分隔符  12,321,321
 * @param num
 * @returns {string|*}
 */
export const thousands = (num) => {
  if (typeof num !== 'number' && !num) {
    return ''
  }
  if (typeof num === 'string' && num.indexOf('**') > -1) {
    return num
  }
  return (+num).toLocaleString()
}

/**
 * todo 数据字典映射
 * @param {*} val
 * @param {*} key
 */
/* eslint-disable */
export const lookup = (val, key) => {
  $http.get(key).then(res => {
    let obj = (res || []).find(v => v.id == val)
    return obj.label
  })
}
