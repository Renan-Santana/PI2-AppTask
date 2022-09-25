import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import { styles } from "./styles";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { HeaderForm } from "../../components/HeaderForm";

export function Form() {
  const [serviceName, setServiceName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const inputSaveData = async () => {
    const id = uuid.v4();

    const newData = {
      id: id,
      serviceName: serviceName,
      user: user,
      password: password,
    };

    try {
      const { getItem, setItem } = useAsyncStorage("@save-pass:passwords");

      const response = await getItem();

      const previousData = response ? JSON.parse(response) : [];

      const data = [...previousData, newData];

      await setItem(JSON.stringify(data));

      Toast.show({
        text1: "Passwords saved successfully.",
        type: "success",
      });
    } catch (error) {
      Toast.show({
        text1: "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <ScrollView>
          <HeaderForm />

          <View style={styles.form}>
            <Input label="Nome do serviço" onChangeText={setServiceName} />
            <Input
              label="E-mail ou usuário"
              autoCapitalize="none"
              onChangeText={setUser}
            />
            <Input label="Senha" secureTextEntry onChangeText={setPassword} />
          </View>

          <View style={styles.footer}>
            <Button title="Salvar" onPress={inputSaveData} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
