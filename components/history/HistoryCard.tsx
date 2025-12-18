import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface HistoryCardProps {
  productDescription: string;
  orderNumber: string;
  date: string;
  imageUri: any;
  onPress: () => void;
}

export default function HistoryCard({
  productDescription,
  orderNumber,
  date,
  imageUri,
  onPress,
}: HistoryCardProps) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.imageContainer}>
        <Image source={imageUri} style={styles.historyImage} />
      </View>
      <View style={styles.historyDetails}>
        <Text style={styles.productDescription}>{productDescription}</Text>
        <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
        <View style={styles.dateAndButtonContainer}>
          <Text style={styles.dateText}>{date}</Text>
          <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
            <Text style={styles.viewMoreButtonText}>Ver más</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  historyCard: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    minHeight: 120,
  },
  imageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 8,
    backgroundColor: '#FFFFFF',
  },
  historyImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  historyDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productDescription: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 8,
    fontFamily: FONTS.semiBold,
  },
  dateAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.medium,
  },
  viewMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3076CC',
  },
  viewMoreButtonText: {
    color: '#3076CC',
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
});