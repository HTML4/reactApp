/* @flow */

import React, { Component } from 'react';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from "../common/NavigationBar"
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import FavoriteDao from "../expand/dao/FavoriteDao"
import HttpUtils from "../utils/HttpUtils"
import Utils from "../utils/Utils"
import RepositoryCell from "../common/RepositoryCell"
import DataRepository, {FLAG_STORAGE} from "../expand/dao/DataRepository"
import ProjectModel from "../model/ProjectModel"
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

export default class PopularPage extends Component {
  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.state = {
      languages: []
    }
  }
  componentDidMount(){
    this.loadData()
  }
  loadData(){
    this.languageDao.fetch().then(result => {
      this.setState({
        languages: result
      })
    }).catch(error => {
      console.log(error)
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title="最热"/>
        {
          this.state.languages.length > 0 ? (
            <ScrollableTabView
              tabBarBackgroundColor="#2196F3"
              tabBarInactiveTextColor="mintcream"
              tabBarActiveTextColor="white"
              tabBarUnderlineStyle={{backgroundColor: "white", height: 2}}
              renderTabBar={() => <ScrollableTabBar/>}>
              {
                this.state.languages.map(d => {
                  return d.checked ? <PopularTab navigation={this.props.navigation} key={d.name} tabLabel={d.name}>{d.name}</PopularTab> : null
                })
              }
            </ScrollableTabView>
          ) : null
        }
      </View>
    );
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular)
    this.state = {
      result: [],
      isLoading: false,
      favoriteKeys: []
    }
  }
  componentDidMount(){
    this.loadData()
  }
  getFavoriteKeys(){
    favoriteDao.getFavoriteKeys()
        .then(keys => {
          if(keys) {
            this.setState({favoriteKeys: keys})
          }
          this.flushFavoriteState()
        })
        .catch(error => {
          this.flushFavoriteState()
        })
  }

  //更新  Project item favorite
  flushFavoriteState(){
    const items = this.items
    const projectModels = []
    for(let i = 0; i < items.length; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
    }
    this.setState({
      result: projectModels,
      isLoading: false
    })
  }
  loadData(){
    this.setState({isLoading: true})
    const url = URL + this.props.tabLabel + QUERY_STR
    this.dataRepository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : []
        this.getFavoriteKeys()
        this.flushFavoriteState()
        if(result && result.update_date && !this.dataRepository.checkData(result.update_date)) {
          DeviceEventEmitter.emit("showToast", "数据过时")
          return this.dataRepository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit("showToast", "显示缓存数据")
        }
      })
      .then(items => {
        if(!items || items.length === 0) return;
        this.items = items
        //this.setState({result: items})
        this.flushFavoriteState()
        DeviceEventEmitter.emit("showToast", "显示网络数据")
      })
      .catch(error => {
        console.log("error", error)
        this.setState({
          isLoading: false
        })
      })
  }
  onSelect(item) {
    this.props.navigation.navigate("RepositoryDetail", {
      item,
      ...this.props
    })
  }
  //favoriteIcon 单机回调函数
  onFavorite(item, isFavorite){
    if(isFavorite) {
      favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
    } else {
      favoriteDao.removeFavoriteItem(item.id.toString())
    }
  }
  renderRow(projectModel){
    return (
      <RepositoryCell
        projectModel={projectModel}
        onSelect={(item) => this.onSelect(item)}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}/>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.result}
          keyExtractor={(item) => "" + item.item.id}
          refreshControl={
            <RefreshControl
              title='Loading...'
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
            />
          }
          renderItem={({item}) => this.renderRow(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
