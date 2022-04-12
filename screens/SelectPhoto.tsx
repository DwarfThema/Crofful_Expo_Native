import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mainTheme } from "../styles";

const Container = styled.View`
  flex: 1;
`;

const Top = styled.View`
  align-items: center;
  justify-content: center;
`;

const Bottom = styled.View``;

const ImageContainer = styled.TouchableWithoutFeedback``;
const IconContainer = styled.View`
  position: absolute;
  bottom: 2px;
  right: 2px;
`;
const HeaderRightText = styled.Text`
  font-size: 17px;
  color: ${mainTheme.mainColor};
  font-weight: 800;
  margin-right: -5px;
`;

const SelectPhoto = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const [photos, setPhotos]: any = useState("");
  const [chosenPhoto, setChosenPhoto] = useState("");
  const getPhotos = async () => {
    const { assets }: any = await MediaLibrary.getAssetsAsync();
    setPhotos(assets);
    setChosenPhoto(assets[0]?.uri);
  };

  const getPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();
    if (accessPrivileges === "none" && canAskAgain) {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges !== "none") {
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      getPhotos();
    }
  };

  const HeaderRight = () => (
    <TouchableOpacity>
      <HeaderRightText>선택</HeaderRightText>
    </TouchableOpacity>
  );

  useEffect(() => {
    getPermissions();
    getPhotos();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, []);

  const choosePhoto = (uri: any) => {
    setChosenPhoto(uri);
  };

  const renderItem = ({ item: photo }: any) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <View>
        <Image
          source={{ uri: photo.uri }}
          style={{ width: width / 4, height: width / 4 }}
        />
        <IconContainer>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={
              photo.uri === chosenPhoto ? `${mainTheme.mainColor}` : "white"
            }
          />
        </IconContainer>
      </View>
    </ImageContainer>
  );

  return (
    <Container>
      <Top style={{ width: width, height: width }}>
        {chosenPhoto !== "" ? (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width: width, height: "100%" }}
          />
        ) : (
          <Text>사진을 선택해주세요.</Text>
        )}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          keyExtractor={(itme) => itme.id}
          renderItem={renderItem}
          numColumns={4}
        />
      </Bottom>
    </Container>
  );
};

export default SelectPhoto;
