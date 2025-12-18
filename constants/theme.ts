import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { FONTS } from './fonts';

export { COLORS, FONTS };

const { width, height } = Dimensions.get('window');

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding2: 36,

  // Font Sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  width,
  height,
};

export const GLOBAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fullContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    width: "90%",
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: FONTS.regular,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Typography
  title: {
    fontSize: 22,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 2,
    fontFamily: FONTS.regular,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    marginTop: 15,
    fontFamily: FONTS.regular,
  },
  // Inputs
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#E8F5E9",
    borderRadius: 100,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#363636",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
    justifyContent: 'center',
    fontFamily: FONTS.regular,
  },
  inputFlex: {
    flex: 1,
    fontSize: 16,
    color: "#363636",
    fontFamily: FONTS.regular,
  },
  inputDisabled: {
    backgroundColor: COLORS.disabledBackground,
    color: COLORS.textSecondary,
    borderColor: COLORS.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 50,
    backgroundColor: "#E8F5E9",
    borderRadius: 100,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
  },
  // Buttons
  primaryButton: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  iconButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.disabledBackground,
    borderRadius: 100,
    marginBottom: 30,
    marginTop: 20,
  },
  activeTab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderRadius: 100,
    alignItems: "center",
    margin: 5,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  inactiveTabText: {
    color: COLORS.textSecondary,
    margin: 5,
    fontFamily: FONTS.regular,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 15,
    color: '#363636',
  },
  // Checkbox
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkedCheckbox: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
});

const appTheme = { COLORS, SIZES, FONTS, GLOBAL_STYLES };

export default appTheme;
