/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import CheckBox from 'react-native-check-box'
import NavigationBar from "../../common/NavigationBar"
import ViewUtils from "../../utils/ViewUtils"
import LanguageDao, {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
import ArrayUtils from '../../utils/ArrayUtils'
export default class CustomKeyPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.isRemoveKey = this.params && this.params.isRemoveKey ? true : false
    this.changeValues = []
    this.state = {
      dataArray: [],
      checkeds: {}
    }
  }
  componentDidMount(){
    const {flag} = this.props.navigation.state.params
    this.languageDao = new LanguageDao(flag)
    this.loadData()
  }
  loadData(){
    this.languageDao.fetch().then(result => {
      this.setState({
        dataArray: result
      })
    }).catch(error => {
      console.log(error)
    })
  }
  renderView(){
    const {dataArray} = this.state
    if(!dataArray || dataArray.length === 0) return;
    let views = []
    const len = dataArray.length
    for(let i = 0, l = len - 2; i < l; i+= 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i])}
            {this.renderCheckBox(dataArray[i + 1])}
          </View>
          <View style={styles.line}></View>
        </View>
      )
    }
    views.push(
      <View key={len-1}>
        <View style={styles.item}>
          {
            len % 2 === 0 ? (
              this.renderCheckBox(dataArray[len - 2])
            ) : null
          }
          {this.renderCheckBox(dataArray[len - 1])}
        </View>
        <View style={styles.line}></View>
      </View>
    )
    return views
  }
  onSave(){
    if(this.changeValues.length === 0) {
      this.props.navigation.goBack()
      return;
    }
    if(this.isRemoveKey) {
      for(let i = 0; i < this.changeValues.length; i++) {
        ArrayUtils.remove(this.state.dataArray, this.changeValues[i])
      }
    }

    this.languageDao.save(this.state.dataArray)
    this.props.navigation.goBack()
  }
  onClick(data){
    if(this.isRemoveKey) {
      this.setState(pre => {
        return {
          checkeds: {
            ...pre.checkeds,
            [data.name]: !pre.checkeds[data.name]
          }
        }
      })
    } else {
      data.checked = !data.checked
      this.setState({
          dataArray: this.state.dataArray
      })
    }
    ArrayUtils.updateArray(this.changeValues, data)
  }
  renderCheckBox(data) {
    const isChecked = this.isRemoveKey ? this.state.checkeds[data.name] ? true : false : data.checked

    return (
      <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={() => this.onClick(data)}
        leftText={data.name}
        isChecked={isChecked}
        checkedImage={<Image style={{tintColor: "#6495ED"}} source={require("./img/ic_check_box.png")}/>}
        unCheckedImage={<Image style={{tintColor: "#6495ED"}} source={require("./img/ic_check_box_outline_blank.png")}/>}/>
    )
  }
  onBack(){
    if(this.changeValues.length === 0) {
      this.props.navigation.goBack()
      return;
    }
    Alert.alert(
      '提示',
      '是否保存修改？',
      [
        {text: '否', onPress: () => this.props.navigation.goBack()},
        {text: '是', onPress: () => this.onSave()},
      ],
    )
  }
  render() {
    const {flag} = this.props.navigation.state.params
    const rightTextButton = this.isRemoveKey ? "移除" : "保存"
    let title = this.isRemoveKey ? "移除标签" : "自定义标签"
    title = flag === FLAG_LANGUAGE.flag_language ? "自定义语言" : title
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}
          rightButton={(
            <TouchableOpacity onPress={() => this.onSave()}>
              <View style={{margin: 10}}><Text style={styles.title}>{rightTextButton}</Text></View>
            </TouchableOpacity>
          )}/>
        <ScrollView>
          {this.renderView()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: "white"
  },
  line: {
    height: 0.5,
    backgroundColor: "darkgray"
  },
  item: {
    flexDirection: "row"
  }
});
