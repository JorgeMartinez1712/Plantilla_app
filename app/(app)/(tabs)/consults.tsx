import { StyleSheet, Text, View } from 'react-native';

export default function ConsultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultas</Text>
      <Text style={styles.subtitle}>¿Necesitas ayuda? Haz tus preguntas aquí.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F9FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
});