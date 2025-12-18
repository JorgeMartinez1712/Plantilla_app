import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface PurchaseCardProps {
  orderNumber: string;
  deliveryType: string;
  status: string;
  elementsCount: number;
  imageUri: any;
  id: string;
}

export default function PurchaseCard({
  orderNumber,
  deliveryType,
  status,
  elementsCount,
  imageUri,
  id,
}: PurchaseCardProps) {
  const router = useRouter();

  const handleViewPress = () => {
    router.push({ pathname: `/detail-purchase`, params: { id: id } });
  };

  const renderStatusIcon = () => {
    return <Ionicons name="checkmark-circle" size={18} color="#65B65F" />;
  };

  return (
    <View style={styles.purchaseCard}>
      <View style={styles.imageContainer}>
        {imageUri && imageUri.uri ? (
          <Image source={imageUri} style={styles.purchaseImage} />
        ) : null}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.purchaseOrder}>Orden #{orderNumber}</Text>
          <View style={styles.elementsChip}>
            <Text style={styles.purchaseElements}>{elementsCount} {elementsCount === 1 ? 'Elemento' : 'Elementos'}</Text>
          </View>
        </View>
        <Text style={styles.purchaseDelivery}>{deliveryType}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.purchaseStatusContainer}>
            <Text style={styles.purchaseStatusText} numberOfLines={1}>{status}</Text>
            {renderStatusIcon()}
          </View>
          <TouchableOpacity style={styles.viewButton} onPress={handleViewPress}>
            <Text style={styles.viewButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 8,
  },
  purchaseImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  purchaseOrder: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#363636',
  },
  elementsChip: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  purchaseElements: {
    fontSize: 12,
    color: '#65B65F',
    fontFamily: FONTS.semiBold,
  },
  purchaseDelivery: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: FONTS.regular,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchaseStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseStatusText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
    fontFamily: FONTS.regular,
  },
  viewButton: {
    paddingVertical: 8,
    borderColor: '#3076CC',
    borderWidth: 1.5,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#3076CC',
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});