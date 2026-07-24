import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarPendentes, listarConcluidas } from '../../backend/entregas';
import CardEntrega from "../components/CardEntrega";

export default function ListaEntregasScreen({ route, navigation }) {
  
  const entregadorId =
  route?.params?.entregadorId ??
  "0f897059-f6cd-491a-9a6e-852ca5076a16";

  // Cada lista fica no seu próprio estado -- elas começam vazias
  const [pendentes, setPendentes] = useState([]);
  const [concluidas, setConcluidas] = useState([]);

  // Estados de carregamento e erro -- controlam o que aparece na tela
  // enquanto os dados ainda não chegaram ou quando algo dá errado
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função que busca as duas listas (pendencia e conclusao) no Supabase e atualiza a tela
  async function carregarEntregas() {
    setCarregando(true);
    setErro(null);
    try {
      const listaPendentes = await listarPendentes(entregadorId);
      const listaConcluidas = await listarConcluidas(entregadorId);
      setPendentes(listaPendentes);
      setConcluidas(listaConcluidas);
    } catch (err) {
      console.log('Erro ao carregar entregas', err.message);
      setErro('Não foi possível carregar as entregas. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  }

  // useFocusEffect roda toda vez que a tela ganha foco -- diferente do useEffect,
  // que só roda uma vez quando a tela é montada. Isso garante que, ao voltar
  // de "Nova Entrega" ou do "Detalhe", a lista já vem atualizada.
  useFocusEffect(
    useCallback(() => {
      carregarEntregas();
    }, [entregadorId])
  );

  function renderItem({ item }) {
  return (
    <CardEntrega
      entrega={item}
      onPress={(entrega) =>
        navigation.navigate("DetalheEntrega", {
          entrega,
        })
      }
    />
  );
}

  // --- Estado de carregamento: mostra um spinner enquanto busca os dados ---
  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando entregas...</Text>
      </View>
    );
  }

  // --- Estado de erro: mostra a mensagem e um botão pra tentar de novo ---
  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erroTexto}>{erro}</Text>
        <Button title="Tentar novamente" onPress={carregarEntregas} />
      </View>
    );
  }

  const total = pendentes.length + concluidas.length;

const entregues = concluidas.filter(
  item => item.status === "entregue"
).length;

const falhas = concluidas.filter(
  item => item.status === "falha"
).length;

  return (
    <View style={styles.container}>
      <View style={styles.dashboard}>
  <View style={styles.cardDashboard}>
    <Text style={styles.numero}>{total}</Text>
    <Text style={styles.label}>📦 Total</Text>
  </View>

  <View style={styles.cardDashboard}>
    <Text style={styles.numero}>{pendentes.length}</Text>
    <Text style={styles.label}>🟡 Pendentes</Text>
  </View>

  <View style={styles.cardDashboard}>
    <Text style={styles.numero}>{entregues}</Text>
    <Text style={styles.label}>🟢 Entregues</Text>
  </View>

  <View style={styles.cardDashboard}>
    <Text style={styles.numero}>{falhas}</Text>
    <Text style={styles.label}>🔴 Falhas</Text>
  </View>
</View>
      <View style={{ marginBottom: 20 }}>
  <Button
    title="Nova Entrega"
    onPress={() =>
      navigation.navigate("FormularioEntrega", { entregadorId })
    }
  />
</View>

      <Text style={styles.secao}>Pendentes</Text>
      {pendentes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma entrega pendente.</Text>
      ) : (
        <FlatList
          data={pendentes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}

      <Text style={styles.secao}>Concluídas</Text>
      {concluidas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma entrega concluída ainda.</Text>
      ) : (
        <FlatList
          data={concluidas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({

dashboard: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 20,
},

cardDashboard: {
  width: "48%",
  backgroundColor: "#16a34a",
  borderRadius: 16,
  paddingVertical: 22,
  paddingHorizontal: 12,
  marginBottom: 12,
  alignItems: "center",

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,

  elevation: 5,
},

numero: {
  fontSize: 28,
  color: "#fff",
  fontWeight: "bold",
},

label: {
  color: "#fff",
  marginTop: 6,
  fontSize: 14,
},

  container: {
    flex: 1,
    padding: 20,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  secao: {
  fontSize: 18,
  fontWeight: "700",
  color: "#1f2937",
  marginTop: 20,
  marginBottom: 10,
},
  vazio: {
    color: '#777',
    fontStyle: 'italic',
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitulo: {
    fontSize: 15,
  },
  itemStatus: {
    color: '#555',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  erroTexto: {
    color: '#b00020',
    textAlign: 'center',
    marginBottom: 12,
  },
});
