/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from "../../utils/ViewUtils"
import FavoriteDao from "../../expand/dao/FavoriteDao"
import RepositoryUtils from "../../expand/dao/RepositoryUtils"
import {FLAG_STORAGE} from "../../expand/dao/DataRepository"
import ProjectModel from "../../model/ProjectModel"
import Utils from "../../utils/Utils"
import ActionUtils from "../../utils/ActionUtils"

import RepositoryCell from "../../common/RepositoryCell"

export const FLAG_ABOUT = {flag_about: "about", flag_about_me: "about_me"}
export default class AboutCommon {
  constructor(props, updateState, flag_about, config) {
    this.props = props
    this.updateState = updateState
    this.flag_about = flag_about
    this.config = config
    this.repositories = []
    this.favoriteKeys = ""
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.repositoryUtils = new RepositoryUtils(this)
  }
  componentDidMount(){
    if(this.flag_about === FLAG_ABOUT.flag_about) {
      this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl)
    } else {
      const urls = []
      const items = this.config.items
      console.log("items", items)
      for(let i = 0; i < items.length; i++) {
        urls.push(this.config.info.url + items[i])
      }
      this.repositoryUtils.fetchRepositories(urls)
    }
  }
  //通知数据发生改变
  //items 改变的数据
  onNotifyDataChanged(items) {
    this.updateFavorite(items)
  }
  //更新用户收藏状态
  async updateFavorite(repositories) {
    if(repositories) this.repositories = repositories
    if(!repositories) return
    if(!this.favoriteKeys) {
      this.favoriteKeys = await this.favoriteDao.getFavoriteKeys()
    }
    let projectModels = []
    let items = this.repositories
    for(let i = 0; i < items.length; i++) {
      let data = this.repositories[i];
      let item = data.item ? data.item : data;
      projectModels.push({
        isFavorite: Utils.checkFavorite(item, this.favoriteKeys || []),
        item
      })
    }
    this.updateState({
      projectModels
    })
  }


  //创建项目视图
  renderRepository(projectModels){
    if(!projectModels || projectModels.length === 0) return null
    const views = []
    for(let i = 0; i < projectModels.length; i++){
      const projectModel = projectModels[i]
      views.push(
        <RepositoryCell
          key={projectModel.item.id}
          projectModel={projectModel}
          onSelect={(item) => ActionUtils.onSelect({
            item,
            projectModel,
            flag: FLAG_STORAGE.flag_popular,
            ...this.props
          })}
          onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite)}/>
      )
    }
    return views
  }
  getParallaxRenderConfig(params){
    let config = {}
    config.renderBackground = () => (
      <View key="background">
        <Image source={{uri: params.backgroundImg,
                        width: window.width,
                        height: PARALLAX_HEADER_HEIGHT}}/>
        <View style={{position: 'absolute',
                      top: 0,
                      width: window.width,
                      backgroundColor: 'rgba(0,0,0,.4)',
                      height: PARALLAX_HEADER_HEIGHT}}/>
      </View>
    )
    config.renderForeground=() => (
      <View key="parallax-header" style={ styles.parallaxHeader }>
        <Image style={ styles.avatar } source={{
          uri: params.avatar,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE
        }}/>
        <Text style={ styles.sectionSpeakerText }>
          {params.name}
        </Text>
        <Text style={ styles.sectionTitleText }>
          {params.description}
        </Text>
      </View>
    )
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )
    config.renderFixedHeader= () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(() => {this.props.navigation.goBack()})}
      </View>
    )
    return config
  }
  render(contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params)
    return (
      <ParallaxScrollView
        headerBackgroundColor="#333"
        backgroundColor="#2196F3"
        stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
        parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
        backgroundSpeed={10}
        {...renderConfig}
      >
      {contentView}
      </ParallaxScrollView>
    );
  }

}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    left: 0,
    top: 0,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: "space-between"
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5,
    paddingRight: 5,
    paddingLeft: 5,
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  rowText: {
    fontSize: 20
  }
});
