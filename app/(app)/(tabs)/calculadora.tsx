import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import FinancingDetails from '../../../components/financier/FinancingDetails';
import ProductSelection from '../../../components/financier/ProductSelection';
import SummaryCard from '../../../components/financier/SummaryCard';
import { COLORS, FONTS, GLOBAL_STYLES } from '../../../constants/theme';
import { CalculationResult, FinancingPlan, Product, useFinancier } from '../../../hooks/useCalculator';

export default function FinanciamientoScreen() {
  const { products, financingPlans, loading, error, calculateFinancing } = useFinancier();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFinancingPlan, setSelectedFinancingPlan] = useState<FinancingPlan | null>(null);
  const [installments, setInstallments] = useState(1);
  const [initialPayment, setInitialPayment] = useState(0);
  const [minInitialPayment, setMinInitialPayment] = useState(0);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const summaryViewRef = useRef(null);

  const handleRecalculate = useCallback((
    productPrice: number,
    plan: FinancingPlan,
    numInstallments: number,
    downPayment: number
  ) => {
    const result = calculateFinancing(
      productPrice,
      plan,
      numInstallments,
      downPayment
    );
    setCalculationResult(result);
  }, [calculateFinancing]);

  useEffect(() => {
    if (!selectedProduct || !selectedFinancingPlan) {
      setMinInitialPayment(0);
      setInitialPayment(0);
      setInstallments(1);
      setCalculationResult(null);
      return;
    }

    const productPrice = parseFloat(selectedProduct.base_price);
    const plan = selectedFinancingPlan;

    let minPayment = 0;
    if (plan.min_down_payment_rate) {
      minPayment = Math.max(minPayment, (parseFloat(plan.min_down_payment_rate) / 100) * productPrice);
    }
    if (plan.min_down_payment_fixed) {
      minPayment = Math.max(minPayment, parseFloat(plan.min_down_payment_fixed));
    }
    setMinInitialPayment(minPayment);

    let newInitialPayment = initialPayment;
    if (initialPayment < minPayment) {
      newInitialPayment = minPayment;
      setInitialPayment(minPayment);
    }

    const maxInstallmentsForPlan = parseInt(plan.cuotas, 10);
    let newInstallments = installments;

    if (!isNaN(maxInstallmentsForPlan) && maxInstallmentsForPlan > 0) {
      if (installments > maxInstallmentsForPlan) {
        newInstallments = maxInstallmentsForPlan;
        setInstallments(maxInstallmentsForPlan);
      }
    } else {
      newInstallments = 1;
      setInstallments(1);
    }

    handleRecalculate(productPrice, plan, newInstallments, newInitialPayment);

  }, [selectedProduct, selectedFinancingPlan, initialPayment, installments, calculateFinancing, handleRecalculate]);


  const shareFinancingSummary = async () => {
    try {
      if (!summaryViewRef.current) return;

      const uri = await (summaryViewRef.current as any).capture();

      if (uri) {
        if (!(await Sharing.isAvailableAsync())) {
          alert(`El uso compartido no está disponible en su plataforma`);
          return;
        }

        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Compartir mi cotización de financiamiento',
          UTI: 'public.png'
        });
      }
    } catch (error) {
      console.error('Error al compartir la imagen:', error);
      alert('No se pudo generar o compartir la imagen.');
    }
  };

  if (loading) {
    return (
      <View style={GLOBAL_STYLES.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ fontFamily: FONTS.regular }}>Cargando datos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={GLOBAL_STYLES.loadingContainer}>
        <Text style={GLOBAL_STYLES.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={GLOBAL_STYLES.fullContainer}
      contentContainerStyle={GLOBAL_STYLES.scrollContent}
    >
      <View style={{
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginHorizontal: 15,
        marginVertical: 20,
      }}>
        <View style={{
          padding: 20,
          paddingTop: 30,
          marginBottom: 5,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            paddingHorizontal: 5,
            marginBottom: 5,
            color: '#363636',
            fontFamily: FONTS.bold,
          }}>Financiamiento</Text>
          <Text style={{
            fontSize: 16,
            paddingHorizontal: 5,
            color: '#666',
            fontFamily: FONTS.regular,
          }}>Elige tu producto, selecciona cuotas y conoce tu plan de pago al instante.</Text>
        </View>

        <View style={{
          paddingHorizontal: 5,
          paddingBottom: 20,
        }}>
          <ProductSelection
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
          />

          <FinancingDetails
            productPrice={selectedProduct ? parseFloat(selectedProduct.base_price) : null}
            installments={installments}
            onInstallmentsChange={setInstallments}
            interestRate={selectedFinancingPlan ? parseFloat(selectedFinancingPlan.interest_rate) : null}
            initialPayment={initialPayment}
            onInitialPaymentChange={setInitialPayment}
            minInitialPayment={minInitialPayment}
            financingPlans={financingPlans}
            selectedFinancingPlan={selectedFinancingPlan}
            onSelectFinancingPlan={setSelectedFinancingPlan}
          />

          {selectedProduct && selectedFinancingPlan && calculationResult && (
            <>
              <ViewShot ref={summaryViewRef} options={{ format: 'png', quality: 0.9 }}>
                {calculationResult.financingLimitExceeded ? (
                  <View style={{
                    backgroundColor: '#FFF3CD',
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: '#FFE082',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      color: '#E65100',
                      fontSize: 15,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontFamily: FONTS.bold,
                    }}>
                      El monto a financiar (${(parseFloat(selectedProduct.base_price) - initialPayment).toFixed(2)}) excede el límite de este plan (${calculationResult.maxFinancingAllowed.toFixed(2)}).
                      Aumenta tu pago inicial o selecciona otro plan.
                    </Text>
                  </View>
                ) : (
                  <SummaryCard
                    totalFinanced={calculationResult.totalFinanced}
                    monthlyPayment={calculationResult.monthlyPayment}
                    totalToPay={calculationResult.totalToPay}
                    initialPayment={calculationResult.initialPayment}
                    capital={calculationResult.capital}
                    interest={calculationResult.interest}
                    basePrice={parseFloat(selectedProduct.base_price)}
                    onShare={shareFinancingSummary}
                  />
                )}
              </ViewShot>

            </>
          )}
          {!selectedProduct && (
            <View style={{
              backgroundColor: '#E3F2FD',
              borderRadius: 10,
              padding: 15,
              marginBottom: 5,
              borderWidth: 1,
              borderColor: '#90CAF9',
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#2196F3',
                fontSize: 15,
                textAlign: 'center',
                fontFamily: FONTS.regular,
              }}>Selecciona un producto para ver las opciones de financiamiento.</Text>
            </View>
          )}
          {selectedProduct && !selectedFinancingPlan && (
            <View style={{
              backgroundColor: '#E3F2FD',
              borderRadius: 10,
              padding: 15,
              marginBottom: 5,
              borderWidth: 1,
              borderColor: '#90CAF9',
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#2196F3',
                fontSize: 15,
                textAlign: 'center',
                fontFamily: FONTS.regular,
              }}>Selecciona un plan de financiamiento.</Text>
            </View>
          )}

        </View>
      </View>
    </ScrollView>
  );
}