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
import FavoriteDao from "../expand/dao/FavoriteDao"
import Utils from "../utils/Utils"
import ArrayUtils from "../utils/ArrayUtils"
import ActionUtils from "../utils/ActionUtils"

import RepositoryCell from "../common/RepositoryCell"
import TrendingCell from "../common/TrendingCell"
import {FLAG_STORAGE} from "../expand/dao/DataRepository"
import ProjectModel from "../model/ProjectModel"

export default class FavoritePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title="收藏"/>
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarInactiveTextColor="mintcream"
          tabBarActiveTextColor="white"
          tabBarUnderlineStyle={{backgroundColor: "white", height: 2}}
          renderTabBar={() => <ScrollableTabBar/>}>
          <FavoriteTab tabLabel="最热" flag={FLAG_STORAGE.flag_popular} {...this.props}/>
          <FavoriteTab tabLabel="趋势" flag={FLAG_STORAGE.flag_trending} {...this.props}/>
        </ScrollableTabView>
      </View>
    );
  }
}

class FavoriteTab extends Component {
  constructor(props) {
    super(props)
    this.favoriteDao = new FavoriteDao(this.props.flag)
    this.unFavoriteItems = []
    this.state = {
      result: [],
      isLoading: false,
      favoriteKeys: []
    }
  }
  componentDidMount(){
    this.loadData(true)
  }
  componentWillReceiveProps(nextProps) {
    console.log("nextProps")
    this.loadData(false)
  }


  loadData(isShowLoading){
    isShowLoading && this.setState({isLoading: true})
    this.favoriteDao.getAllItems()
        .then(items => {
          const resultData = []
          for(let i = 0; i < items.length; i++) {
            resultData.push(new ProjectModel(items[i], true))
          }
          this.setState({
            isLoading: false,
            result: resultData
          })
        })
        .catch(e => {
          this.setState({isLoading: false})
        })
  }

  //favoriteIcon 单机回调函数
  onFavorite(item, isFavorite){
    ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)
    ArrayUtils.updateArray(this.unFavoriteItems, item)
    if(this.unFavoriteItems.length > 0) {
      if(this.props.flag === FLAG_STORAGE.flag_popular) {
        DeviceEventEmitter.emit("favoriteChanged_popular")
      } else {
        DeviceEventEmitter.emit("favoriteChanged_trending")
      }
    }
  }
  renderRow(projectModel){
    const CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell
    return (
      <CellComponent
        projectModel={projectModel}
        onSelect={(item) => ActionUtils.onSelect({
          item,
          projectModel,
          flag: FLAG_STORAGE.flag_popular,
          ...this.props
        })}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}/>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.result}
          keyExtractor={(item) => {
            return this.props.flag === FLAG_STORAGE.flag_popular ? "" + item.item.id : item.item.fullName
          }}
          refreshControl={
            <RefreshControl
              title='Loading...'
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(true)}
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
