import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import {useRouter } from "expo-router"
const select = () => {
  const router = useRouter(); 
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() =>{
   const fetchUser = async () => {
    const token= await AsyncStorage.getItem("auth");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setUserId(userId);


   }
   fetchUser();

  },[])
  const updatedUserGender = async () => {
    try{
        const response = await axios.put(`http://192.168.219.103:3000/user/${userId}/gender`,{
            gender:option
        });
        console.log(response.data);
        if(response.status ==200 ){
            router.replace("/(tabs)/bio")
        }
    }catch(err){
    console.log(err);
    }
  }

  return (
    <View style={{ flrx: 1, backgroundColor: "white", padding: 12 }}>
      <Pressable
        onPress={() => setOption("male")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTopL: 25,
          borderRadius: 5,
          borderColor: option == "male" ? "#D0D0D0" : "transparent",
          borderWidth: option == "male" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a man</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("female")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTopL: 25,
          borderRadius: 5,
          borderColor: option == "female" ? "#D0D0D0" : "transparent",
          borderWidth: option == "female" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a woman</Text>

        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("nonbinary")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTopL: 25,
          borderRadius: 5,
          borderColor: option == "nonbinary" ? "#D0D0D0" : "transparent",
          borderWidth: option == "nonbinary" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am Non-Binary</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
        />
      </Pressable>
      {option && (
        <Pressable
         onPress= {updatedUserGender}
          style={{
            marginTop: 25,
            backgroundColor: "black",
            padding: 12,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            DONE
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default select;

const styles = StyleSheet.create({});
