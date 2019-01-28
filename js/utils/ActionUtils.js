
import {FLAG_STORAGE} from "../expand/dao/DataRepository"

export default class ActionUtils {
    /**
     * 跳转到详情
     * **/
    static onSelect(params) {
      const {navigation} = params
       navigation.navigate("RepositoryDetail", {
         ...params
       })
     }
     //favoriteIcon 单机回调函数
     static onFavorite(favoriteDao, item, isFavorite, flag){
       const key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString()
       if(isFavorite) {
         favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
       } else {
         favoriteDao.removeFavoriteItem(key)
       }
     }

}
