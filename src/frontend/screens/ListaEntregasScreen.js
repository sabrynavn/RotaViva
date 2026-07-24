import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  listarPendentes,
  listarConcluidas,
} from '../../backend/entregas';

import CardEntrega from '../components/CardEntrega';

export default function ListaEntregasScreen({ route, navigation }) {
  const entregadorId =
    route?.params?.entregadorId ??
    '0f897059-f6cd-491a-9a6e-852ca5076a16';

  const [pendentes, setPendentes] = useState([]);
  const [concluidas, setConcluidas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregarEntregas() {
    setCarregando(true);
    setErro(null);

    try {
      const listaPendentes = await listarPendentes(entregadorId);
      const listaConcluidas = await listarConcluidas(entregadorId);

      setPendentes(listaPendentes ?? []);
      setConcluidas(listaConcluidas ?? []);
    } catch (err) {
      console.log('Erro ao carregar entregas:', err.message);

      setErro(
        'Não foi possível carregar as entregas. Verifique sua conexão.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarEntregas();
    }, [entregadorId])
  );

  function renderItem({ item }) {
    return (
      <CardEntrega
        entrega={item}
        onPress={() =>
          navigation.navigate('DetalheEntrega', {
            entrega: item,
          })
        }
      />
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.carregandoTexto}>
          Carregando entregas...
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erroTexto}>{erro}</Text>

        <Button
          title="Tentar novamente"
          onPress={carregarEntregas}
        />
      </View>
    );
  }

  const total = pendentes.length + concluidas.length;

  const entregues = concluidas.filter(
    (item) =>
      String(item.status ?? '').toLowerCase() === 'entregue'
  ).length;

  const falhas = concluidas.filter(
    (item) =>
      String(item.status ?? '').toLowerCase() === 'falha'
  ).length;

  const textoPesquisa = pesquisa.trim().toLowerCase();

  function filtrarEntregas(lista) {
    if (!textoPesquisa) {
      return lista;
    }

    return lista.filter((item) => {
      const codigo = String(
        item.codigo_pacote ?? item.codigo ?? ''
      ).toLowerCase();

      const destinatario = String(
        item.destinatario_nome ?? item.destinatario ?? ''
      ).toLowerCase();

      return (
        codigo.includes(textoPesquisa) ||
        destinatario.includes(textoPesquisa)
      );
    });
  }

  const pendentesFiltradas = filtrarEntregas(pendentes);
  const concluidasFiltradas = filtrarEntregas(concluidas);

  return (
    <View style={styles.container}>
      <View style={styles.dashboard}>
        <View style={styles.cardDashboard}>
          <Text style={styles.numero}>{total}</Text>
          <Text style={styles.label}>📦 Total</Text>
        </View>

        <View style={styles.cardDashboard}>
          <Text style={styles.numero}>
            {pendentes.length}
          </Text>

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

      <TextInput
        style={styles.inputPesquisa}
        placeholder="Pesquisar por código ou destinatário..."
        placeholderTextColor="#9ca3af"
        value={pesquisa}
        onChangeText={setPesquisa}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      <View style={styles.botaoContainer}>
        <Button
          title="Nova Entrega"
          onPress={() =>
            navigation.navigate('FormularioEntrega', {
              entregadorId,
            })
          }
        />
      </View>

      <Text style={styles.secao}>Pendentes</Text>

      {pendentesFiltradas.length === 0 ? (
        <Text style={styles.vazio}>
          {textoPesquisa
            ? 'Nenhuma entrega pendente encontrada.'
            : 'Nenhuma entrega pendente.'}
        </Text>
      ) : (
        <FlatList
          style={styles.lista}
          data={pendentesFiltradas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Text style={styles.secao}>Concluídas</Text>

      {concluidasFiltradas.length === 0 ? (
        <Text style={styles.vazio}>
          {textoPesquisa
            ? 'Nenhuma entrega concluída encontrada.'
            : 'Nenhuma entrega concluída ainda.'}
        </Text>
      ) : (
        <FlatList
          style={styles.lista}
          data={concluidasFiltradas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },

  dashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  cardDashboard: {
    width: '48%',
    backgroundColor: '#16a34a',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 5,
  },

  numero: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },

  label: {
    color: '#fff',
    marginTop: 6,
    fontSize: 14,
  },

  inputPesquisa: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 15,
    color: '#1f2937',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,

    elevation: 2,
  },

  botaoContainer: {
    marginBottom: 4,
  },

  secao: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },

  lista: {
  flexGrow: 0,
},

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  carregandoTexto: {
    marginTop: 10,
    color: '#4b5563',
  },

  vazio: {
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 8,
  },

  erroTexto: {
    color: '#b00020',
    textAlign: 'center',
    marginBottom: 12,
  },
});