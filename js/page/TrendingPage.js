/* @flow */

import React, { Component } from 'react';
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
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import { Popover, PopoverController } from 'react-native-modal-popover';
import NavigationBar from "../common/NavigationBar"
import TrendingCell from "../common/TrendingCell"
import DataRepository, {FLAG_STORAGE} from "../expand/dao/DataRepository"
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import HttpUtils from "../utils/HttpUtils"
import TimeSpan from "../model/TimeSpan"
import FavoriteDao from "../expand/dao/FavoriteDao"
import Utils from "../utils/Utils"
import ProjectModel from "../model/ProjectModel"

const API_URL = 'https://github.com/trending/';
const timeSpanTextArray = [
  new TimeSpan("今 天", "since=daily"),
  new TimeSpan("本 周", "since=weekly"),
  new TimeSpan("本 月", "since=monthly"),
]
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)


export default class TrendingPage extends Component {
  constructor(props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language)
    this.state = {
      languages: [],
      isVisible: false,
      buttonRect: {},
      timeSpan: timeSpanTextArray[0]
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
  onSelectTimeSpan(timeSpan, closePopover){
    this.setState({
      timeSpan,
    })
    closePopover()
  }
  renderTitleView(){
    return(
      <View>
        <PopoverController>
          {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
            <React.Fragment>
              <TouchableOpacity  ref={setPopoverAnchor} onPress={openPopover}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{fontSize: 18, color: "white", fontWeight: "400"}}>趋势 {this.state.timeSpan.showText}</Text>
                  <Image style={{width: 12, height: 12, marginLeft: 5}} source={require("../../res/images/ic_spinner_triangle.png")}/>
                </View>
              </TouchableOpacity>
              <Popover
                contentStyle={{backgroundColor: "#343434", opacity: 0.8}}
                arrowStyle={{borderTopColor: '#343434'}}
                backgroundStyle={styles.background}
                visible={popoverVisible}
                onClose={closePopover}
                fromRect={popoverAnchorRect}
                placement="bottom"
                supportedOrientations={['portrait', 'landscape']}
              >
                {
                  timeSpanTextArray.map((result, i) => (
                    <TouchableOpacity
                      key={i}
                      underlayColor="transparent"
                      onPress={() => this.onSelectTimeSpan(result, closePopover)}>
                      <Text style={{fontSize: 18, color: "white", padding: 8}}>{result.showText}</Text>
                    </TouchableOpacity>
                  ))
                }
              </Popover>
            </React.Fragment>
          )}
        </PopoverController>

      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar titleView={this.renderTitleView()}/>
        {
          this.state.languages && this.state.languages.length > 0 ? (
            <ScrollableTabView
              tabBarBackgroundColor="#2196F3"
              tabBarInactiveTextColor="mintcream"
              tabBarActiveTextColor="white"
              tabBarUnderlineStyle={{backgroundColor: "white", height: 2}}
              renderTabBar={() => <ScrollableTabBar/>}>
              {
                this.state.languages.map(d => {
                  return d.checked ? <TrendingTab timeSpan={this.state.timeSpan} navigation={this.props.navigation} key={d.name} tabLabel={d.name}>{d.name}</TrendingTab> : null
                })
              }
            </ScrollableTabView>
          ) : null
        }

      </View>
    );
  }
}

class TrendingTab extends Component {
  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
    this.state = {
      result: [],
      isLoading: false,
      favoriteKeys: []
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.timeSpan !== nextProps.timeSpan) {
      this.loadData(nextProps.timeSpan)
    }
  }
  componentDidMount(){
    this.loadData(this.props.timeSpan, true)
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
  changeLoading(val) {
    this.setState({
      isLoading: val
    })
  }
  getFetchUrl(timeSpan, category){
    return API_URL + category + "?" + timeSpan.searchText
  }
  loadData(timeSpan, isRefresh){
    this.setState({isLoading: true})
    const url = this.getFetchUrl(timeSpan, this.props.tabLabel)
    this.dataRepository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : []
        this.getFavoriteKeys()
        if(result && result.update_date && !this.dataRepository.checkData(result.update_date)) {
          DeviceEventEmitter.emit("showToast", "数据过时")
          return this.dataRepository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit("showToast", "显示缓存数据")
        }
      })
      .then(items => {
        if(!items || items.length === 0) return;
        // this.setState({result: items})
        this.items = items
        this.getFavoriteKeys()
        DeviceEventEmitter.emit("showToast", "显示网络数据")
      })
      .catch(error => {
        console.log("error", error)
        this.setState({isLoading: false})
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
      favoriteDao.saveFavoriteItem(item.fullName.toString(), JSON.stringify(item))
    } else {
      favoriteDao.removeFavoriteItem(item.fullName.toString())
    }
  }
  renderRow(projectModel){
    return (
      <TrendingCell
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
          keyExtractor={(item) => "" + item.item.fullName}
          refreshControl={
            <RefreshControl
              title='Loading...'
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(this.props.timeSpan)}
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
