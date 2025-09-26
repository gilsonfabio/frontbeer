import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { ToastConfig, ToastConfigParams } from "react-native-toast-message";

type ToastProps = {
  text1?: string;
};

const renderText = (text?: string) => {
  if (!text) return null;
  return <Text style={styles.text}>{text}</Text>;
};

const SuccessToast = ({ text1 }: ToastProps) => (
  <View style={[styles.container, styles.success]}>
    <Text style={styles.icon}>✔️</Text>
    <View style={styles.messageWrap}>{renderText(text1)}</View>
  </View>
);

const ErrorToast = ({ text1 }: ToastProps) => (
  <View style={[styles.container, styles.error]}>
    <Text style={styles.icon}>❌</Text>
    <View style={styles.messageWrap}>{renderText(text1)}</View>
  </View>
);

// Sem usar generics
export const toastConfig: ToastConfig = {
  success: (props: ToastConfigParams<any>) => <SuccessToast {...props} />,
  error: (props: ToastConfigParams<any>) => <ErrorToast {...props} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  success: {
    backgroundColor: "#ecfdf5",
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
  },
  error: {
    backgroundColor: "#fef2f2",
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  messageWrap: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
