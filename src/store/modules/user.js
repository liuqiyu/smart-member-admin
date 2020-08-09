import http from './../../utils/http'

const user = {
  namespaced: true,
  state: {
    token: sessionStorage.getItem('token'),
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}
  },
  getters: {},
  mutations: {
    SET_TOKEN (state, value) {
      state.token = value
    },
    SEET_USERINFO (state, value) {
      state.userInfo = value
    }
  },
  actions: {
    login ({
      commit
    }, formData) {
      return new Promise((resolve, reject) => {
        http
          .post('/api/user/login', formData)
          .then(res => {
            if (res) {
              sessionStorage.setItem('token', res.token)
              sessionStorage.setItem('userInfo', JSON.stringify(res.info))
              commit('SET_TOKEN', res.token)
              commit('SEET_USERINFO', res.info)
              resolve(res)
            } else {
              resolve()
            }
          }).catch(err => {
            reject(err)
          })
      })
    },
    register ({
      commit
    }, formData) {
      return new Promise((resolve, reject) => {
        http
          .post('/api/user/register', formData)
          .then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
      })
    },
    logout ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userInfo')
        commit('SET_TOKEN', '')
        commit('SEET_USERINFO', {})
        resolve()
      })
    }
  }
}

export default user
