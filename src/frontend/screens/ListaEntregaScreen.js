import { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  ActivityIndicator, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CardEntrega from '../components/CardEntrega';
import { listarPendentes, listarConcluidas } from '../../backend/entregas';

/**
 * ListaEntregaScreen — tela principal do app com duas abas:
 *
 *   1. "Pendentes"  → Entregas com status 'pendente' (aguardando ação do entregador)
 *   2. "Histórico"   → Entregas já finalizadas ('entregue' ou 'falha')
 *
 * Funcionalidades:
 *   - Alternância entre as duas abas via segment control no topo
 *   - Pull-to-refresh para recarregar manualmente
 *   - Indicador visual de quantas entregas pendentes faltam (desafio extra)
 *   - Estados de loading, erro e lista vazia com mensagens amigáveis
 *   - Recarrega automaticamente toda vez que a tela ganha foco (useFocusEffect)
 *     para refletir alterações feitas na tela de detalhe.
 *
 * @param {object} navigation - Objeto de navegação (React Navigation)
 */

// Nome das abas disponíveis
const ABAS = ['Pendentes', 'Histórico'];

export default function ListaEntregaScreen({ navigation }) {
  // --- Estado da interface ---
  const [abaAtiva, setAbaAtiva] = useState('Pendentes'); // Aba atualmente selecionada
  const [entregas, setEntregas] = useState([]);           // Lista de entregas carregadas
  const [carregando, setCarregando] = useState(true);     // Indicador de carregamento inicial
  const [erro, setErro] = useState(null);                 // Mensagem de erro (null = sem erro)
  const [recarregando, setRecarregando] = useState(false);// Pull-to-refresh ativo

  /**
   * Carrega as entregas da aba ativa no backend.
   *
   * @param {boolean} isRefresh - Se true, ativa o indicador de recarregamento
   *                               em vez do carregamento inicial cheio.
   */
  async function carregarEntregas(isRefresh = false) {
    try {
      // Ativa o indicador apropriado
      if (isRefresh) {
        setRecarregando(true);  // Pull-to-refresh (animação mais leve)
      } else {
        setCarregando(true);    // Loading inicial (tela cheia)
      }
      setErro(null); // Limpa erro anterior

      // IMPORTANTE: Nesta versão inicial, usamos um entregador fixo
      // (id genérico) porque a tela de login ainda não foi implementada.
      // Quando a autenticação estiver pronta (pessoa 2 do escopo),
      // substituir por: const usuario = await getPerfilEntregador()
      const entregadorId = '00000000-0000-0000-0000-000000000000';

      // Escolhe a função de busca conforme a aba ativa
      let dados;
      if (abaAtiva === 'Pendentes') {
        dados = await listarPendentes(entregadorId);
      } else {
        dados = await listarConcluidas(entregadorId);
      }

      // Atualiza a lista com os dados vindos do banco
      setEntregas(dados || []);
    } catch (err) {
      // Em caso de erro, salva a mensagem para exibir na tela
      setErro(err.message || 'Erro ao carregar entregas.');
    } finally {
      // Desativa os indicadores de carregamento
      setCarregando(false);
      setRecarregando(false);
    }
  }

  /**
   * useFocusEffect: recarrega a lista sempre que a tela ganha foco.
   * Isso garante que, ao voltar da tela de detalhe (onde o status
   * pode ter sido alterado), a lista reflita os dados mais recentes.
   *
   * Equivalente a um useEffect + listener de foco do React Navigation.
   */
  useFocusEffect(
    useCallback(() => {
      carregarEntregas();
    }, [abaAtiva]) // Recarrega também quando troca de aba
  );

  /**
   * Navega para a tela de detalhe da entrega selecionada.
   * Passa o objeto 'entrega' como parâmetro de rota.
   */
  function navegarParaDetalhe(entrega) {
    navigation.navigate('DetalheEntrega', { entrega });
  }

  // ===================== RENDERIZAÇÃO DO TOPO =====================

  /**
   * Cabeçalho da lista: aparece fixo no topo da FlatList.
   * Contém o indicador de entregas restantes + o seletor de abas.
   * É renderizado via ListHeaderComponent para rolar junto com a lista.
   */
  function HeaderLista() {
    // Filtra apenas as pendentes e calcula quantas faltam
    const pendentes = entregas.filter(e => e.status === 'pendente');
    const restantes = pendentes.length;

    return (
      <View>
        <View style={styles.dashboardCard}>
  <Text style={styles.dashboardTitulo}>
    Bem-vindo ao RotaViva
  </Text>

  <Text style={styles.dashboardTexto}>
    {abaAtiva === 'Pendentes'
      ? `Você possui ${restantes} entrega${restantes !== 1 ? 's' : ''} pendente${restantes !== 1 ? 's' : ''}.`
      : `Consulte o histórico das entregas finalizadas.`}
  </Text>
</View>
        {/* Indicador de entregas restantes (desafio extra do escopo) */}
        {abaAtiva === 'Pendentes' && (
          <View style={styles.indicadorContainer}>
            <Text style={styles.indicadorTexto}>
              {restantes === 0
                ? 'Todas as entregas foram concluídas! 🎉'
                : `Entregas restantes: ${restantes}`}
            </Text>
          </View>
        )}

        {/* Segment Control (abas Pendentes / Histórico) */}
        <View style={styles.segmentContainer}>
          {ABAS.map((aba) => (
            <TouchableOpacity
              key={aba}
              style={[
                styles.segmentBotao,
                // Destaca visualmente a aba ativa com fundo verde
                abaAtiva === aba && styles.segmentAtivo,
              ]}
              onPress={() => setAbaAtiva(aba)} // Troca a aba ativa
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.segmentTexto,
                  abaAtiva === aba && styles.segmentTextoAtivo,
                ]}
              >
                {aba}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // ===================== RENDERIZAÇÃO PRINCIPAL =====================

  return (
    <View style={styles.container}>
      {/*
        ---------- ESTADO DE CARREGAMENTO ----------
        Exibe um spinner centralizado enquando os dados são buscados.
        Só aparece no carregamento inicial (não no pull-to-refresh).
      */}
      {carregando && !recarregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.textoCarregando}>Carregando entregas...</Text>
        </View>
      ) : (
        <>
          {/*
            ---------- ESTADO DE ERRO ----------
            Se houve falha na requisição, mostra a mensagem de erro
            com um botão para tentar novamente.
          */}
          {erro ? (
            <View style={styles.centro}>
              <Text style={styles.textoErro}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoTentarNovamente}
                onPress={() => carregarEntregas()}
              >
                <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/*
                ---------- LISTA PRINCIPAL ----------
                FlatList é a escolha ideal por:
                - Renderização performática (só renderiza o que está na tela)
                - Suporte nativo a pull-to-refresh
                - ListHeaderComponent para o cabeçalho com abas
                - ListEmptyComponent para estado vazio
              */}
              <FlatList
                data={entregas}
                keyExtractor={(item) => item.id} // ID único vindo do banco
                renderItem={({ item }) => (
                  <CardEntrega
                    entrega={item}
                    onPress={navegarParaDetalhe}
                  />
                )}
                // Cabeçalho da lista (indicador + abas)
                ListHeaderComponent={HeaderLista}
                // Mensagem exibida quando a lista está vazia
                ListEmptyComponent={
                  <View style={styles.listaVazia}>
                    <Text style={styles.textoListaVazia}>
                      {abaAtiva === 'Pendentes'
                        ? 'Nenhuma entrega pendente no momento.'
                        : 'Nenhuma entrega no histórico.'}
                    </Text>
                  </View>
                }
                // Pull-to-refresh: puxe para baixo para recarregar
                refreshControl={
                  <RefreshControl
                    refreshing={recarregando}
                    onRefresh={() => carregarEntregas(true)} // isRefresh = true
                    colors={['#16a34a']}   // Cor do indicador no Android
                    tintColor="#16a34a"    // Cor do indicador no iOS
                  />
                }
                // Espaçamento entre os cards
                contentContainerStyle={styles.listaConteudo}
                // Remove separador padrão entre itens
                ItemSeparatorComponent={() => null}
                // Otimizações de performance
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={7}
              />
            </>
          )}
        </>
      )}
    </View>
  );
}

// ===================== ESTILOS =====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Fundo cinza claro (igual ao do detalhe)
  },

  // --- Centralizador (usado para loading e erro) ---
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },

  // --- Loading ---
  textoCarregando: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748b',
  },

  // --- Erro ---
  textoErro: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoTentarNovamente: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoTentarTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  // --- Indicador de entregas restantes ---
  indicadorContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  indicadorTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    textAlign: 'center',
  },

  // --- Segment Control (abas) ---
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 3,
  },
  segmentBotao: {
    flex: 1,                      // Cada aba ocupa metade da largura
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentAtivo: {
    backgroundColor: '#16a34a',   // Verde quando selecionado
    // Sombra sutil no botão ativo para destacar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',             // Cinza quando inativo
  },
  segmentTextoAtivo: {
    color: '#ffffff',             // Branco quando ativo
  },

  // --- Lista vazia ---
  listaVazia: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  textoListaVazia: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
  },

  dashboardCard: {
  backgroundColor: '#16a34a',
  marginHorizontal: 16,
  marginTop: 16,
  marginBottom: 12,
  borderRadius: 14,
  padding: 18,
},

dashboardTitulo: {
  color: '#fff',
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 6,
},

dashboardTexto: {
  color: '#dcfce7',
  fontSize: 15,
},

  // --- Conteúdo da lista ---
  listaConteudo: {
    paddingBottom: 24,            // Espaço no final para não colar na borda
  },
});
