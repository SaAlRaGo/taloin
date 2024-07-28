import React from 'react';
import { View, StyleSheet } from 'react-native';
import Star from './Star';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;
  const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} filled={1} />
      ))}
      {partialStar > 0 && <Star filled={partialStar} />}
      {[...Array(emptyStars)].map((_, index) => (
        <Star key={`empty-${index}`} filled={0} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
  },
});

export default StarRating;
