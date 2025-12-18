import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';
import MovementItem from '../../../components/pagos/MovementItem';
import { COLORS, GLOBAL_STYLES } from '../../../constants/theme';
import { usePayments } from '../../../hooks/usePayments';

export default function PagosScreen() {
  const { movements, loadingHistory, errorHistory } = usePayments();

  return (
    <View style={GLOBAL_STYLES.fullContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {loadingHistory ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : errorHistory ? (
          <Text style={[GLOBAL_STYLES.errorText, { marginTop: 50, paddingHorizontal: 20 }]}>{errorHistory}</Text>
        ) : movements.length === 0 ? (
          <Text style={[GLOBAL_STYLES.infoText, { marginTop: 50 }]}>No tienes pagos registrados.</Text>
        ) : (
          <FlatList
            data={movements}
            renderItem={({ item }) => (
              <MovementItem
                id={item.id}
                date={item.date}
                description={item.description}
                amount={item.amount}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}