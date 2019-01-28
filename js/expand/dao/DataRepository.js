import {
  AsyncStorage
} from "react-native"
import Trending from "GitHubTrending";

export const FLAG_STORAGE = {flag_popular: "popular", flag_trending: "trending", flag_my: "my"}
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
            // if(!result) {
            //   reject(new Error("responseData is null"))
            //   return;
            // } else {
            //   resolve(result.items)
            //   this.saveRepository(url, result.items)
            // }
            if(this.flag === FLAG_STORAGE.flag_my && result) {
              resolve(result)
              this.saveRepository(url, result)
            } else if(result && result.items) {
              resolve(result.items)
              this.saveRepository(url, result.items)
            } else {
              reject(new Error("responseData is null"))
            }
          })
          .catch(error => reject(error))
      }
    })
  }
  saveRepository(url, items, callBack) {
    if(!url || !items) return;
    let wrapData
    if(this.flag === FLAG_STORAGE.flag_my) {
      wrapData = {item, update_date: new Date().getTime()}
    } else {
      wrapData = {items, update_date: new Date().getTime()}
    }

    AsyncStorage.setItem(url, JSON.stringify(wrapData), callBack)
  }

}
