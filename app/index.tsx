import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuthContext } from '../context/AuthContext';

export default function Index() {
  const { isAuthenticated, loading, loadingCustomerDetails, customerDetails, user } = useAuthContext();
  const isCheckingDetails = isAuthenticated && customerDetails === null;
  const isLoading = loading || isCheckingDetails || loadingCustomerDetails;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5EBFC' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (isAuthenticated) {
    if (customerDetails?.is_active === true && customerDetails?.app_user?.app_user_status_id === 1) {
      return <Redirect href="/screens/profile/verification" />;
    } else {
      return <Redirect href="/(app)/(tabs)" />;
    }
  } else {
    return <Redirect href="/(auth)" />;
  }
}