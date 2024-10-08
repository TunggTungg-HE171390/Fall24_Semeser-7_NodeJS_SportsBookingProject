import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function History() {
  return (
    <View style={styles.container}>

<TouchableOpacity><Text>HiHiiiii</Text></TouchableOpacity>      
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 120,
  },
})