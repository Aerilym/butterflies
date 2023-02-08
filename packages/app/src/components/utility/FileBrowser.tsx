import { Box, Button, Input, Modal, ScrollView } from 'native-base';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import type { FileInfo } from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';

import { isMobileDevice } from '../../helpers/environment';
import Loading from '../../screens/utility/Loading';

export interface FileBrowserOptions {
  hiddenSearch?: string;
  allowNameSearch?: boolean;
  defaultSearch?: string;
}

export type File =
  | {
      name: string;
      contents: string;
    } & FileInfo;

/**
 * Get all log files from the device.
 * @param startDate The start date to filter by.
 * @param endDate The end date to filter by.
 * @returns An array of log files.
 */
async function getFiles(name?: string): Promise<File[]> {
  if (!isMobileDevice) return [];
  const fileNames = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory ?? '');

  const nameSearch = name ? '/' + name : '';

  const filePromises: Promise<File | null>[] = fileNames.map(async (name) => {
    const info = await FileSystem.getInfoAsync(
      `${FileSystem.documentDirectory ?? ''}${nameSearch}`
    );
    if (!info.exists) return null;
    const contents = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory ?? ''}/${name}`,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    return { name, contents, ...info };
  });

  // Resolve the file reading promises and filter out any files that don't exist.
  const files = (await Promise.all(filePromises)).filter((file): file is File => file !== null);
  return files;
}

export default function FileBrowser(options: FileBrowserOptions) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [visibleFiles, setVisibleFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<number>(0);
  const [nameSearch, setNameSearch] = useState<string>(options.defaultSearch ?? '');

  useEffect(() => {
    setVisibleFiles(files);
    setNameSearch(options.defaultSearch ?? '');
  }, [files]);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Button
        onPress={async () => {
          setLoading(true);
          const files = await getFiles(options.hiddenSearch);
          if (files && files.length > 0) setFiles(files);
          setLoading(false);
        }}
      >
        Get Files
      </Button>
      {loading && <Loading />}
      {options.allowNameSearch && (
        <Input
          value={nameSearch}
          onChangeText={(text) => {
            setNameSearch(text);
            if (!text || text.length <= 1) setVisibleFiles(files);
            const newFiles = files.filter((file) => file.name.includes(text));
            if (newFiles && newFiles.length > 0) setVisibleFiles(newFiles);
            else setVisibleFiles([]);
          }}
        />
      )}
      {visibleFiles.length > 0
        ? visibleFiles.map((file, index) => {
            return (
              <Button
                key={index}
                onPress={() => {
                  setCurrentFile(index);
                  setShowModal(true);
                }}
              >
                {file.name}
              </Button>
            );
          })
        : null}
      {visibleFiles && visibleFiles.length > 0 && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content width={'full'} height={'full'}>
            <Modal.CloseButton />
            <Modal.Header>{visibleFiles[currentFile].name}</Modal.Header>
            <Modal.Body>{visibleFiles[currentFile].contents}</Modal.Body>
            <Modal.Footer>
              <Button.Group variant="outline" space={2} alignSelf="flex-end">
                <Button
                  disabled={currentFile <= 0}
                  onPress={() => {
                    if (currentFile > 0) setCurrentFile(currentFile - 1);
                  }}
                >
                  Previous
                </Button>
                <Button
                  disabled={currentFile >= visibleFiles.length - 1}
                  onPress={() => {
                    if (currentFile < visibleFiles.length - 1) setCurrentFile(currentFile + 1);
                  }}
                >
                  Next
                </Button>
                <Button
                  onPress={async () => {
                    await Clipboard.setStringAsync(visibleFiles[currentFile].contents);
                  }}
                >
                  Copy
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </ScrollView>
  );
}
