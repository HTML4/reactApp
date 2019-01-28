/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import NavigationBar from "../common/NavigationBar"
import ViewUtils from "../utils/ViewUtils"
import HttpUtils from "../utils/HttpUtils"
import Utils from "../utils/Utils"
import makeCancelable from "../utils/Cancelable"
import ActionUtils from "../utils/ActionUtils"
import GlobalStyles from "../../res/styles/GlobalStyles"
import FavoriteDao from "../expand/dao/FavoriteDao"
import {FLAG_STORAGE} from "../expand/dao/DataRepository"
import ProjectModel from "../model/ProjectModel"
import RepositoryCell from "../common/RepositoryCell"
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import {ACTION_HOME, FLAG_TAB} from "./HomePage"

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

export default class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.favoriteKeys = []
    this.inputKey = ""
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.isKeyChange = false
    this.state = {
      rightButtonText: "搜索",
      isLoading: false,
      result: [],
      showBottomButtom: false
    }
  }
  componentDidMount(){
    this.initKeys()
  }
  componentWillUnmount(){
    if(this.isKeyChange) {
      DeviceEventEmitter.emit("ACTION_HOME", ACTION_HOME.A_RESTART)
    }
  }
  //添加标签
  saveKey(){
    let key = this.inputKey
    if(this.checkKeyIsExist(this.keys, key)) {
      this.toast.show(key + "已经存在", DURATION.LENGTH_LONG)
    } else {
      key = {
        "path": key,
        "name": key,
        "checked": true
      }
      this.keys.unshift(key)
      this.languageDao.save(this.keys)
      this.toast.show(key.name + "保存成功", DURATION.LENGTH_LONG)
      this.isKeyChange = true
    }
  }
  //获取所有标签
  async initKeys(){
    this.keys = await this.languageDao.fetch()
  }
  //判断key 是否在 keys
  checkKeyIsExist(keys, key){
    for (var i = 0; i < keys.length; i++) {
      if(key.toLowerCase() === keys[i].name.toLowerCase()) return true;
    }
    return false
  }
  getFavoriteKeys(){
    favoriteDao.getFavoriteKeys()
        .then(keys => {
          this.favoriteKeys = keys || []
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
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)))
    }
    this.setState({
      result: projectModels,
      isLoading: false,
      rightButtonText: "搜索"
    })
  }
  loadData(){
    this.setState({isLoading: true, showBottomButtom: false})
    this.canceleable = makeCancelable(HttpUtils.get(this.getFetchUrl(this.inputKey)))
    this.canceleable.pormise
        .then(result => {
          if(!this || !result || !result.items || result.items.length === 0) {
            this.toast.show(this.inputKey + "什么都没找到", DURATION.LENGTH_LONG)
            this.setState({
              isLoading: false,
              rightButtonText: "搜索"
            })
            return
          }
          this.items = result.items
          this.getFavoriteKeys()
          if(!this.checkKeyIsExist(this.keys, this.inputKey)) {
            this.setState({showBottomButtom: true})
          }
        })
        .catch(e => {
          this.setState({
            isLoading: false,
            rightButtonText: "搜索"
          })
        })
  }
  getFetchUrl(key) {
    return API_URL + key + QUERY_STR
  }
  renderRightButton(){
    return(
      <View>
        <TouchableOpacity>
          <View style={{padding: 5, marginRight: 8}}>
            <Image style={{width: 24, height: 24}} source={require("../../res/images/ic_search_white_48pt.png")}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  onBackPress(){
    this.refs.input.blur()
    this.props.navigation.goBack()
  }
  onRightButtonClick(){
    this.refs.input.blur()
    if(this.state.rightButtonText === "搜索") {
      this.setState({rightButtonText: "取消"})
      this.loadData()
    } else {
      this.setState({rightButtonText: "搜索", isLoading: false})
      this.canceleable.cancel()
    }
  }
  renderNavBar(){
    let backButton = ViewUtils.getLeftButton(() => this.onBackPress())
    let inputView = <TextInput ref="input" style={styles.textInput} onChangeText={text => this.inputKey = text}>

    </TextInput>
    let rightButton = <TouchableOpacity onPress={() => this.onRightButtonClick()}>
      <View style={{marginRight: 10}}>
        <Text style={styles.title}>{this.state.rightButtonText}</Text>
      </View>
    </TouchableOpacity>
    return (
      <View style={{backgroundColor: "#2196F3", flexDirection: "row", alignItems: "center"}}>
      {backButton}
      {inputView}
      {rightButton}
      </View>
    )
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
        onSelect={(item) => ActionUtils.onSelect({
          item,
          projectModel,
          flag: FLAG_STORAGE.flag_popular,
          ...this.props
        })}
        onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite)}/>
    )
  }
  render() {
    let statusBar = null
    if(Platform.OS === "ios") {
      statusBar = <View style={[styles.statusBar, {backgroundColor: "#2196F3"}]}/>
    }
    let flatList = !this.state.isLoading ?
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
        /> : null
    const indicatorView = this.state.isLoading ?
          <ActivityIndicator
            style={styles.centering}
            size="large"
            animating={this.state.isLoading}/> : null
    const resultView = <View style={{flex: 1}}>
            {indicatorView}
            {flatList}
          </View>
    const bottomButtom = this.state.showBottomButtom ?
          <TouchableOpacity style={[styles.bottomButtom, {backgroundColor: "#2196F3"}]} onPress={() => this.saveKey()}>
            <View style={{justifyContent: "center"}}><Text style={styles.title}>添加标签</Text></View>
          </TouchableOpacity> : null
    return (
      <View style={GlobalStyles.root_container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButtom}
        <Toast ref={(toast) => this.toast = toast}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: 20
  },
  textInput: {
    flex: 1,
    height: Platform.OS === "ios" ? 30 : 40,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: "white",
    alignSelf: "center",
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.9,
    color: "white"
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "500"
  },
  centering: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  bottomButtom: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9,
    height: 40,
    position: "absolute",
    left: 10,
    bottom: 10,
    right: 10,
    borderRadius: 3
  }
});
