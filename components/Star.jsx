import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Star = ({ filled }) => {
  return (
    <View style={styles.starWrapper}>
      <Icon name="star" size={30} color="#d3d3d3" />
      <View style={[styles.starOverlay, { width: `${filled * 100}%` }]}>
        <Icon name="star" size={30} color="#ffd700" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  starWrapper: {
    position: 'relative',
    width: 30,
    height: 30,
  },
  starOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    height: 30,
  },
});

export default Star;
