import { useState } from 'react';
import { Box, Button, Image, Input, Text, View } from 'native-base';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { log } from '../../services/log/logger';
import { supabaseAPI } from '../../provider/AuthProvider';
import { compressImage } from '../../helpers/compression';
import { formatFileSize } from '../../helpers/maths';

interface ImagePickerOptions {
  size?: number | { width: number; height: number };
  compress?: boolean;
  showCompressedAndOriginal?: boolean;
  showStats?: boolean;
  showCompressionStats?: boolean;
  showUploadButton?: boolean;
  uploadName?: string;
  showNameField?: boolean;
}

interface ImageMetadata {
  width?: number;
  height?: number;
  fileSize?: number;
}

export default function ImagePicker(options: ImagePickerOptions) {
  const [image, setImage] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedImageMetadata, setCompressedImageMetadata] = useState<ImageMetadata | null>(
    null
  );
  const [uploadName, setUploadName] = useState<string>('');

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
      const addedImage = result.assets[0].uri;
      if (options.showStats) {
        fetch(addedImage).then(async (response) => {
          const blob = await response.blob();
          const size = blob.size;
          setImageMetadata({
            width: result.assets[0].width,
            height: result.assets[0].height,
            fileSize: size,
          });
          setImage(addedImage);
        });
      } else {
        // If we don't need to show stats, just set the image.
        setImage(addedImage);
      }

      if (options.compress) {
        compressImage(addedImage).then((compressedUri) => {
          if (options.showStats || options.showCompressionStats) {
            fetch(compressedUri).then(async (response) => {
              const blob = await response.blob();
              const size = blob.size;
              setCompressedImageMetadata({
                width: result.assets[0].width,
                height: result.assets[0].height,
                fileSize: size,
              });
              setCompressedImage(compressedUri);
            });
          } else {
            // If we don't need to show stats, just set the image.
            setCompressedImage(compressedUri);
          }
        });
      }
    }
  };

  let imageSize = { width: 200, height: 200 };
  if (typeof options.size === 'number') {
    imageSize = { width: options.size, height: options.size };
  } else if (options.size) {
    imageSize = options.size;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={pickImage}>Pick an image from camera roll</Button>
      {image && (!options.compress || options.showCompressedAndOriginal) && (
        <Image source={{ uri: image }} style={imageSize} />
      )}
      {image &&
        (!options.compress || options.showCompressedAndOriginal) &&
        options.showStats &&
        imageMetadata && (
          <Box>
            <Text>
              {imageMetadata.width}x{imageMetadata.height}
            </Text>
            <Text>
              {imageMetadata.fileSize && `File Size ${formatFileSize(imageMetadata.fileSize)}`}
            </Text>
          </Box>
        )}
      {compressedImage && <Image source={{ uri: compressedImage }} style={imageSize} />}
      {compressedImage && options.compress && options.showStats && compressedImageMetadata && (
        <Box>
          <Text>
            {compressedImageMetadata.width}x{compressedImageMetadata.height}
          </Text>
          <Text>
            {compressedImageMetadata.fileSize &&
              `File Size ${formatFileSize(compressedImageMetadata.fileSize)}`}
          </Text>
        </Box>
      )}
      {compressedImage &&
        options.compress &&
        options.showCompressionStats &&
        imageMetadata &&
        compressedImageMetadata &&
        imageMetadata.fileSize &&
        compressedImageMetadata.fileSize && (
          <Box>
            <Text>
              Compression Ratio:{' '}
              {(compressedImageMetadata.fileSize / imageMetadata.fileSize).toFixed(2)}
            </Text>
          </Box>
        )}
      {options.showNameField && (
        <Input
          placeholder="Upload Name"
          value={uploadName}
          onChangeText={(text) => setUploadName(text)}
        />
      )}
      {image && options.showUploadButton && (
        <Button
          onPress={async () =>
            // If we are compressing, upload the compressed image, otherwise upload the original.
            await supabaseAPI.uploadImage(compressedImage ?? image, {
              name: uploadName,
            })
          }
        >
          Upload Image
        </Button>
      )}
    </View>
  );
}
