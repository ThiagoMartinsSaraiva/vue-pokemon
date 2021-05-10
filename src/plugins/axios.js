import axios from 'axios'

export default {
  install(app) {
    app.config.globalProperties.$http = axios.create({
      baseURL: 'https://pokeapi.co/api/v2'
    })
  }
}