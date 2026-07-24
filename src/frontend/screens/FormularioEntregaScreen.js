import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { criarEntrega } from '../../backend/entregas';

export default function FormularioEntregaScreen({
  route,
  navigation,
}) {
  const entregadorId =
    route?.params?.entregadorId ??
    '0f897059-f6cd-491a-9a6e-852ca5076a16';

  const [codigoPacote, setCodigoPacote] = useState('');
  const [destinatarioNome, setDestinatarioNome] =
    useState('');
  const [endereco, setEndereco] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvarEntrega() {
    if (
      !codigoPacote.trim() ||
      !destinatarioNome.trim() ||
      !endereco.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha o código, o destinatário e o endereço.'
      );

      return;
    }

    setSalvando(true);

    try {
      await criarEntrega(entregadorId, {
        codigo_pacote: codigoPacote.trim(),
        destinatario_nome: destinatarioNome.trim(),
        endereco: endereco.trim(),
        latitude: null,
        longitude: null,
      });

      Alert.alert(
        'Entrega cadastrada',
        'A entrega foi cadastrada com sucesso e registrada no histórico.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log('Erro ao cadastrar entrega:', error);

      Alert.alert(
        'Erro ao cadastrar',
        error?.message ??
          'Não foi possível cadastrar a entrega.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Nova entrega</Text>

      <Text style={styles.subtitulo}>
        Preencha as informações do pacote.
      </Text>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Código do pacote</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: ROT-001"
          placeholderTextColor="#9ca3af"
          value={codigoPacote}
          onChangeText={setCodigoPacote}
          autoCapitalize="characters"
          editable={!salvando}
        />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>
          Nome do destinatário
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Maria da Silva"
          placeholderTextColor="#9ca3af"
          value={destinatarioNome}
          onChangeText={setDestinatarioNome}
          autoCapitalize="words"
          editable={!salvando}
        />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>Endereço</Text>

        <TextInput
          style={[styles.input, styles.inputEndereco]}
          placeholder="Rua, número, bairro e complemento"
          placeholderTextColor="#9ca3af"
          value={endereco}
          onChangeText={setEndereco}
          multiline
          textAlignVertical="top"
          editable={!salvando}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.botaoSalvar,
          salvando && styles.botaoDesabilitado,
        ]}
        onPress={salvarEntrega}
        disabled={salvando}
        activeOpacity={0.8}
      >
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>
            Cadastrar entrega
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoCancelar}
        onPress={() => navigation.goBack()}
        disabled={salvando}
      >
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 28,
  },

  campoContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },

  inputEndereco: {
    minHeight: 110,
  },

  botaoSalvar: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  botaoDesabilitado: {
    opacity: 0.65,
  },

  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 6,
  },

  textoCancelar: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '600',
  },
});