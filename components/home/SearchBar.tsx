import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import BuscarIcon from '../../assets/iconos/buscar.svg';
import FiltrosIcon from '../../assets/iconos/filtros.svg';

export function SearchBar() {
  return (
    <View style={styles.searchContainer}>
      <BuscarIcon width={24} height={24} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar Producto"
        placeholderTextColor="#888"
        multiline={false}
        textAlignVertical="center"
      />
    </View>
  );
}

type FilterButtonProps = { onPress: () => void };

export function FilterButton({ onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.filterButtonContainer}>
      <FiltrosIcon width={24} height={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 60,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    height: 53,
    flex: 1, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#363636',
    paddingVertical: 0,
    minHeight: 24,
    paddingHorizontal: 0,
  },
  filterButtonContainer: {
    width: 53,
    height: 53,
    borderRadius: 53 / 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});