import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

import Button, { ButtonType } from '../components/buttons/Button'
import { useTheme } from '../contexts/theme'

const ImportWallet: React.FC = () => {
  const { ColorPallet, TextTheme } = useTheme()

  const { height } = Dimensions.get('window')
  const styles = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.grayscale.darkGrey,
    },
    dottedBox: {
      marginTop: height / 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontSize: 27,
      //   color: CommonStyles.blackColor,
      marginVertical: 5,
    },
  })
  const handleSelect = async (seed: string) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
      })
      console.log(res[0])

      const myKeys = await keyGen768(seed)
      console.log('mykeys', myKeys)

      const symetric = await Encrypt768(myKeys[0], seed)

      const encodeHash = md5(symetric[1])
      console.log('hash', md5(symetric[1]))
      // console.log('HH', RNFS.CachesDirectoryPath(res[0].uri))
      RNFetchBlob.fs
        .stat(res[0].fileCopyUri)
        .then((stats) => {
          console.log('PATH', stats.path)
          // setwalletpath(stats.path)
          const importConfig: WalletExportImportConfig = {
            key: encodeHash,
            path: stats.path,
          }
        })
        .catch((err: any) => {
          console.log(err)
        })
    } catch (err: any) {
      // Handle error or cancelation
      console.log(err)
    }
  }
  useEffect(() => {
    handleSelect()
  }, [])
  return (
    <View style={styles.container}>
      {/* <Header title="Import Wallet" /> */}

      <View style={styles.dottedBox}>
        <Text style={[TextTheme.title, styles.headerText]}>Upload ZIP</Text>

        <Text style={TextTheme.label}>BNDSHJDSH</Text>
        <Button
          title={'CHOOSE ZIP FILE'}
          accessibilityLabel={'Okay'}
          // testID={onCallToActionLabel ? testIdWithKey(onCallToActionLabel) : testIdWithKey('Okay')}
          buttonType={ButtonType.Primary}
          // onPress={() => handleSelect('abc xyz')}
        />
      </View>
    </View>
  )
}
export default ImportWallet
