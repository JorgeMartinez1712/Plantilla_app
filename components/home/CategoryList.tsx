import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryListProps {
  categories: Category[];
  onCategoryPress: (categoryId: string) => void;
}

export default function CategoryList({ categories, onCategoryPress }: CategoryListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem} onPress={() => onCategoryPress(item.id)}>
            <View style={styles.categoryImageContainer}>
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F9FF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
    color: '#363636',
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  categoriesList: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 90,
    justifyContent: 'flex-start',
    height: 90,
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryImage: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  categoryText: {
    height: 16,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Poppins_400Regular",
    color: "#21003d",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
});