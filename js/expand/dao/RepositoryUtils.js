'use strict';

import {
    AsyncStorage,
} from 'react-native';
import Utils from '../../utils/Utils'
import DataRepository, {FLAG_STORAGE} from './DataRepository'
export default class RepositoryUtils {
  constructor(aboutCommon) {
    this.aboutCommon = aboutCommon
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    this.itemMap = new Map()

  }
  //更新数据
  updateData(k, v){
    this.itemMap.set(k, v)
    const arr = []
    for (let value of this.itemMap.values()) {
      arr.push(value)
    }
    this.aboutCommon.onNotifyDataChanged(arr)
  }
  //获取指定 url 下的数据
  fetchRepository(url) {
    this.dataRepository.fetchRepository(url)
        .then(result => {
          if(result) {
            this.updateData(url, result)
            if(!Utils.checkDate(result.update_date)) {
              return this.dataRepository.fetchNetRepository(url)
            }
          }
        })
        .then(item => {
          if(item) {
            this.updateData(url, item)
          }
        })
        .catch(e => {

        })
  }
  //批量获取 urls 数据
  fetchRepositories(urls) {
    for(let i = 0; i < urls.length; i++) {
      let url = urls[i]
      this.fetchRepository(url)
    }
  }
}
