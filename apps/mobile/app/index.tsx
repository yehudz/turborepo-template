import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Mobile App
        </Text>
        <Text style={styles.subtitle}>
          Built with Expo + React Native
        </Text>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Click me!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#09090b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
})