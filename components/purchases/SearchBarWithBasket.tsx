import { StyleSheet, TextInput, View } from 'react-native';
import BuscarIcon from '../../assets/iconos/buscar.svg';

interface SearchBarWithBasketProps {
  onSearch: (text: string) => void;
  onBasketPress: () => void;
}

export default function SearchBarWithBasket({ onSearch, onBasketPress }: SearchBarWithBasketProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <BuscarIcon width={24} height={24} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          placeholderTextColor="#888"
          onChangeText={onSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 55,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#363636',
    paddingVertical: 0,
  },
  basketButton: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});