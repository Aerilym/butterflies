import { useState } from 'react';
import { Button, Image, View } from 'native-base';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { log } from '../../services/log/logger';
import { supabaseAPI } from '../../provider/AuthProvider';
import { compressImage } from '../../helpers/compression';

export default function ImagePicker() {
  const [image, setImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    log.debug('Image Picker Result', result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      compressImage(result.assets[0].uri).then((compressedUri) => {
        setCompressedImage(compressedUri);
      });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={pickImage}>Pick an image from camera roll</Button>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {compressedImage && (
        <Image source={{ uri: compressedImage }} style={{ width: 200, height: 200 }} />
      )}
      {image && (
        <Button onPress={async () => await supabaseAPI.uploadImage(image)}>Upload Image</Button>
      )}
    </View>
  );
}
