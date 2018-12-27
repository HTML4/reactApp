/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import HTMLView from 'react-native-htmlview'
const UN_STAR_IMG = require("../../res/images/ic_unstar_transparent.png")
const STAR_IMG = require("../../res/images/ic_star.png")

export default class TrendingCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
      favoriteIcon: this.props.projectModel.isFavorite ? STAR_IMG : UN_STAR_IMG
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setFavoriteState(nextProps.projectModel.isFavorite)
  }
  setFavoriteState(isFavorite){
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? STAR_IMG : UN_STAR_IMG
    })

  }
  onPressFavorite(){
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item, !this.props.projectModel.isFavorite)
  }
  render() {
    const item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel
    const description = "<p>" + item.description + "</p>"
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelect(item)}
        style={styles.container}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HTMLView
            value={description}
            onLinkPress={(url) => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}/>
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.description}>Build By:</Text>
              {
                item.contributors.map((result, i, arr) => {
                  return <Image key={i} style={styles.image} source={{uri: result}}/>
                })
              }

            </View>

            <TouchableOpacity onPress={() => this.onPressFavorite()}>
              <Image style={[styles.image, {tintColor: "#2196F3"}]} source={this.state.favoriteIcon}/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: "#212121"
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: "#757575"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cell_container: {
    backgroundColor: "white",
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  image: {
    width: 22,
    height: 22
  },
});
