import { StyleSheet, Text, View,ScrollView,Image,Pressable } from 'react-native'
import React from 'react'

const index = () => {
  return (
    <ScrollView>
    <View>
  
<Image
  style={{ width: "100%", height: 200, resizeMode: "cover" }}
  source={{
    uri: "https://static.vecteezy.com/system/resources/thumbnails/018/977/074/original/animated-backgrounds-with-liquid-motion-graphic-background-cool-moving-animation-for-your-background-free-video.jpg",
  }}
/>

      <View>
        <View>
          <Pressable
          
          style={{
            padding: 10,
            backgroundColor: "#DDA0DD",
            width: 300,
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            position: "absolute",
            top: -60,
            left: "50%",
            transform: [{ translateX: -150 }],
          }}>
            <Image
              styles={{ 
                width: 60, 
                height: 60, 
                borderRadius:30,
                resizeMode: "cover" 
              }}
              source ={{
                uri:'https://cdn-icons-png.flaticon.com/128/1946/1946433.png'
                
              }}        
            />



          </Pressable>
        </View>
      </View>
    </View>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})