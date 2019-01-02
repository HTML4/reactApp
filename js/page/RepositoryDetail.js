/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  WebView,
  TouchableOpacity,
  Image
} from 'react-native';
import NavigationBar from "../common/NavigationBar"
import ViewUtils from "../utils/ViewUtils"
import FavoriteDao from "../expand/dao/FavoriteDao"
import DataRepository, {FLAG_STORAGE} from "../expand/dao/DataRepository"

const TRENDING_URL = 'https://github.com/'
const UN_STAR_IMG = require("../../res/images/ic_star_navbar.png")
const STAR_IMG = require("../../res/images/ic_star.png")

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props)
    const {item, projectModel, flag} = props.navigation.state.params
    const {html_url, full_name, fullName} = item
    this.favoriteDao = new FavoriteDao(flag)

    this.state = {
      url: html_url || TRENDING_URL + fullName,
      title: full_name || fullName,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
      favoriteIcon: projectModel.isFavorite ? STAR_IMG : UN_STAR_IMG
    }
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url
    })
  }
  onBack(){
    if(this.state.canGoBack) {
      this.webView.goBack()
    } else {
      this.props.navigation.goBack()
    }
  }
  setFavoriteState(isFavorite){
    this.props.navigation.state.params.projectModel = isFavorite
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? STAR_IMG : UN_STAR_IMG
    })

  }
  onRightButtonClick(){
    const {projectModel} = this.props.navigation.state.params
    this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite)
    const key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
    if(projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }
  }
  renderRightButton(){
    return (
      <TouchableOpacity onPress={() => this.onRightButtonClick()}>
        <Image style={{width: 20, height: 20, marginRight: 10}} source={this.state.favoriteIcon}/>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}
          rightButton={this.renderRightButton()}/>
        <WebView
          ref={e => this.webView = e}
          source={{uri: this.state.url}}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
