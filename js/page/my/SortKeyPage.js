/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import SortableListView from 'react-native-sortable-listview'
import NavigationBar from "../../common/NavigationBar"
import ViewUtils from "../../utils/ViewUtils"
import LanguageDao, {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
import ArrayUtils from '../../utils/ArrayUtils'

export default class SortKeyPage extends Component {
  constructor(props) {
    super(props)
    this.dataArray = []
    this.sortResultArray = []
    this.originalCheckArray = []
    this.state = {
      checkedArray: []
    }
  }
  componentDidMount(){
    const {flag} = this.props.navigation.state.params
    this.languageDao = new LanguageDao(flag)
    this.loadData()
  }
  loadData(){
    this.languageDao.fetch().then(result => {
      this.getCheckedItems(result)
    }).catch(error => {
      console.log(error)
    })
  }
  getCheckedItems(result){
    this.dataArray = result
    let checkedArray = []
    for(let i = 0; i < result.length; i++) {
      let data = result[i]
      if(data.checked) {
        checkedArray.push(data)
      }
    }
    this.setState({
      checkedArray
    })
    this.originalCheckArray = ArrayUtils.clone(checkedArray)
  }
  onBack(){
    if(ArrayUtils.isEqual(this.originalCheckArray, this.state.checkedArray)){
      this.props.navigation.goBack()
      return;
    }
    Alert.alert(
      '提示',
      '是否保存修改？',
      [
        {text: '否', onPress: () => this.props.navigation.goBack()},
        {text: '是', onPress: () => this.onSave(true)},
      ],
    )
  }
  onSave(isChecked){
    if(!isChecked && ArrayUtils.isEqual(this.originalCheckArray, this.state.checkedArray)){
      this.props.navigation.goBack()
      return;
    }
    this.getSortResult()
    this.languageDao.save(this.sortResultArray)
    this.props.navigation.goBack()
  }
  getSortResult(){
    this.sortResultArray = ArrayUtils.clone(this.dataArray)
    for(let i = 0; i < this.originalCheckArray.length; i++) {
      const item = this.originalCheckArray[i]
      const index = this.dataArray.indexOf(item)
      this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
  }

  render() {
    const {flag} = this.props.navigation.state.params
    const title = flag === FLAG_LANGUAGE.flag_language ? "语言排序" : "标签排序"
    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}
          rightButton={(
            <TouchableOpacity onPress={() => this.onSave(true)}>
              <View style={{margin: 10}}><Text style={styles.title}>保存</Text></View>
            </TouchableOpacity>
          )}/>
        <SortableListView
          style={{ flex: 1 }}
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
            this.forceUpdate()
          }}
          renderRow={row => <SortCell data={row} />}
        />
      </View>
    );
  }
}

class SortCell extends Component {
  render(){
    return(
      <TouchableHighlight
        underlayColor={'#eee'}
        style={styles.item}
        {...this.props.sortHandlers}
      >
        <View style={styles.row}>
          <Image style={styles.image} source={require("./img/ic_sort.png")}/>
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 15,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderColor: "#EEE"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    tintColor: "#2196F3",
    width: 16,
    height: 16,
    marginRight: 10
  },
  title: {
    fontSize: 18,
    color: "white"
  },
});
