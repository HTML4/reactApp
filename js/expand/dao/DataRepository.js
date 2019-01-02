import {
  AsyncStorage
} from "react-native"
import Trending from "GitHubTrending";

export const FLAG_STORAGE = {flag_popular: "popular", flag_trending: "trending"}
export default class DataRepository {
  constructor(flag) {
    this.flag = flag
    if(flag === FLAG_STORAGE.flag_trending) {
      this.trending = new Trending()
    }
  }
  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      //本地缓存数据
      this.fetchLocalRepository(url)
          .then(result => {
            if(result) {
              resolve(result)
            } else {
              this.fetchNetRepository(url)
                  .then(result => {
                    resolve(result)
                  })
                  .catch(e => {
                    reject(e)
                  })
            }
          })
          .catch(error => {
            this.fetchNetRepository(url)
                .then(result => {
                  resolve(result)
                })
                .catch(e => {
                  reject(e)
                })
          })
    })
  }
  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if(!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error)
        }
      })
    })
  }
  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      if(this.flag === FLAG_STORAGE.flag_trending) {
        this.trending.fetchTrending(url)
            .then(result => {
              if(!result) {
                reject(new Error("responseData is null"))
                return;
              }
              resolve(result)
              this.saveRepository(url, result)
            })
      } else {
        fetch(url)
          .then(response => response.json())
          .then(result => {
            if(!result) {
              reject(new Error("responseData is null"))
              return;
            } else {
              resolve(result.items)
              this.saveRepository(url, result.items)
            }
          })
          .catch(error => reject(error))
      }
    })
  }
  saveRepository(url, items, callBack) {
    if(!url || !items) return;
    const wrapData = {items, update_date: new Date().getTime()}
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack)
  }
  // 判断数据是否过时 longTime 是时间戳
  checkData(longTime) {
    const cDate = new Date()
    const tDate = new Date()
    tDate.setTime(longTime)
    if(cDate.getMonth() !== tDate.getMonth()) return false;
    if(cDate.getDay() !== tDate.getDay()) return false;
    if(cDate.getHours() - tDate.getHours() > 4) return false;
    return true
  }
}
