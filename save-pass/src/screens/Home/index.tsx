import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import { Card, CardProps } from "../../components/Card";
import { HeaderHome } from "../../components/HeaderHome";
import { useFocusEffect } from "@react-navigation/native";

import { styles } from "./styles";
import { Button } from "../../components/Button";

export function Home() {
  const [data, setData] = useState<CardProps[]>([]);

  const { getItem, setItem } = useAsyncStorage("@save-pass:passwords");

  const fetchData = async () => {
    const response = await getItem();
    const dataPasswords = response ? JSON.parse(response) : [];
    setData(dataPasswords);
  };
   
  const deleteItem = async (id: String) => {
    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];
    const data = previousData.filter((item: CardProps) => item.id !== id);
    setItem(JSON.stringify(data));
    setData(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );


  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>Suas senhas</Text>

        <Text style={styles.listCount}>{`${data.length} ao total`}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card data={item} onPress={() => deleteItem(item.id)} />
        )}
      />

      <View style={styles.footer}>
        <Button title="Limpar lista" />
      </View>
    </View>
  );
}
