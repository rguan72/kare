import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../../assets/logo.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    marginTop: 30,
    marginBottom: 12,
    alignItems: 'center'
  },
});

export default memo(Logo);