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
import HttpUtils from "../utils/HttpUtils"
import Utils from "../utils/Utils"
import ActionUtils from "../utils/ActionUtils"
import RepositoryCell from "../common/RepositoryCell"
import DataRepository, {FLAG_STORAGE} from "../expand/dao/DataRepository"
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

export default class PopularTab extends Component {
  constructor(props) {
    super(props)
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular)
    this.state = {
      result: [],
      isLoading: false
    }
  }
  componentDidMount(){
    this.loadData()
  }
  changeLoading(val) {
    this.setState({
      isLoading: val
    })
  }
  loadData(){
    this.changeLoading(true)
    const url = URL + this.props.tabLabel + QUERY_STR
    this.dataRepository.fetchRepository(url)
      .then(result => {
        const items = result && result.items ? result.items : []
        this.changeLoading(false)
        this.setState({result: items})
        if(result && result.update_date && !Utils.checkDate(result.update_date)) {
          DeviceEventEmitter.emit("showToast", "数据过时")
          return this.dataRepository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit("showToast", "显示缓存数据")
        }
      })
      .then(items => {
        if(!items || items.length === 0) return;
        this.setState({result: items})
        DeviceEventEmitter.emit("showToast", "显示网络数据")
      })
      .catch(error => {
        console.log("error", error)
        this.changeLoading(false)
      })
  }

  renderRow(data){
    return (
      <RepositoryCell
        data={data}
        onSelect={(item) => ActionUtils.onSelect({
          item,
          ...this.props
        })/>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.result}
          keyExtractor={(item) => "" + item.id}
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
    flex: 1
  }
});
