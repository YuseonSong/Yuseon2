import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  Share,
  Text,
} from 'react-native';
import axios from 'axios';

const MyPicture: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImageUrls() {
      try {
        const userId = 'S3xLXoBcKoQZbxhoa6cAVbPgg422';
        const response = await axios.get(
          `http://10.0.2.2:3000/getImages?userId=${userId}`,
        );

        setImageUrls(response.data);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    }

    fetchImageUrls();
  }, []);
  const onShare = async () => {
    try {
      await Share.share({
        message: selectedImage || '',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {imageUrls.map((url, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedImage(url)}>
            <Image
              source={{uri: url}}
              style={{
                width: 100,
                height: 100,
                borderWidth: 1,
                borderColor: 'black',
                margin: 5,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={!!selectedImage}
        transparent
        onRequestClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => setSelectedImage(null)}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: selectedImage}}
                style={{width: '80%', height: '80%'}}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={onShare}
                style={{
                  padding: 10,
                  marginTop: 10,
                  backgroundColor: '#111',
                }}>
                <Text style={{color: 'white'}}>공유하기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </Modal>
    </ScrollView>
  );
};

export default MyPicture;
