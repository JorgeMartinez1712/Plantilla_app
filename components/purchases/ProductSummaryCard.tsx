import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../../constants/fonts';

interface ProductSummaryCardProps {
  product: {
    name: string;
    image: ImageSourcePropType | null;
  };
  summary: {
    orderNumber: string;
  };
}

export default function ProductSummaryCard({ product, summary }: ProductSummaryCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={product.image}
            style={styles.productImage}
          />
        ) : null}
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.orderContainer}>
          <Text style={styles.orderText}>Orden #{summary.orderNumber}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    marginHorizontal: 20,
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    resizeMode: 'contain',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: '#363636',
    fontFamily: FONTS.regular,
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  orderText: {
    fontSize: 14,
    color: '#888',
    marginRight: 5,
    fontFamily: FONTS.regular,
  },
});