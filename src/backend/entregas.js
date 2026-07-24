import { supabase } from "./supabase";
import { registrarAcao } from './historico';


/** Explicando alguns códigos para facilitar o entendimento:
 * - códigos do supabase:
 *  - .from() = procura a tabela
 *  - .select() = seleciona o que quer, se ele está vazio ele considera '*'.
 *  - .insert({}) = insere dados, é necessário criar uma array '{}' para denotar o que vai ser entregue
 *  - .single() = unifica e especifica que o dado que está sendo tratado ou consultado é unicamente o que foi 'codado'.
 *  - .in() = funciona como um 'check', tendo que especificar o que quer achar (ex: 'status' -> uma coluna); e os valores que quer achar, listados ou não.
 *  - .order() = ordena o valor dado que foi consultado, tendo que especificar: .order('coluna', {ordenacao: true/false})
 * 
 * - códigos js:
 *  - if (error) throw new error = ele joga o erro da função caso ela falhe, sendo possível tratá-la no frontend, melhorando o retorno e a transparência.
 *  - const {data, error} = await supabase.(...) = 
 *   -> const {data, error} >> ele retorna null em um dos dois, então apenas um valor plausível é retornável, facilitando o tratamento.
 *   -> await supabase.(...) >> ele aguarda a requisição feita ao supabase, tanto que a função em si é assíncrona, fazendo com que ela aguarde respostas mas não faz o programa parar por conta disso.
*/



/**
 * Cria uma nova entrega. Chamar ANTES de subir a foto — precisamos
 * do id da entrega pra montar o caminho do arquivo no Storage.
 *
 * @param entregadorId - id do entregador logado
 * @param dados - { codigo_pacote, destinatario_nome, endereco, latitude, longitude }
 */

export async function criarEntrega(entregadorId, dados) {
  // Cadastra a nova entrega no Supabase Database
  const { data, error } = await supabase
    .from('entregas')
    .insert({
      entregador_id: entregadorId,
      codigo_pacote: dados.codigo_pacote,
      destinatario_nome: dados.destinatario_nome,
      endereco: dados.endereco,
      latitude: dados.latitude,
      longitude: dados.longitude,
      status: 'pendente',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Registra no banco em nuvem que uma entrega foi cadastrada
  try {
    await registrarAcao({
      acao: 'CADASTRO_ENTREGA',
      descricao: `Entrega ${data.codigo_pacote} cadastrada para ${data.destinatario_nome}.`,
      entregaId: data.id,
      entregadorId,
    });
  } catch (historicoError) {
    // A entrega continua cadastrada mesmo se o histórico apresentar erro
    console.log(
      'A entrega foi cadastrada, mas o histórico não foi registrado:',
      historicoError.message
    );
  }

  return data;
}

/**
 * Lista as entregas pendentes do entregador logado.
 */

export async function listarPendentes(entregadorId) {
    // Busca na tabela 'entregas'
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('entregador_id', entregadorId) // Onde o entregador seja o informado
    .eq('status', 'pendente') // E onde o status seja rigorosamente 'pendente'
    .order('criado_em', { ascending: false }); // Mostra as mais recentes primeiro

    if (error) throw error;
    // Retorna a lista de entregas pendentes
    return data;   
}

/**
 * Busca uma entrega específica pelo id (tela de detalhe).
 */

export async function buscarEntregaPorId(entregaId) {
    //busca na tabela "entregas"
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('id', entregaId) // Onde o ID seja igual ao ID que passamos para a função
    .single(); // Traz apenas essa entrega

    if (error) throw error;
    // Retorna a entrega encontrada
    return data;
}

/**
 * Lista as entregas concluídas (entregue ou falha) do entregador logado.
 * Usada na tela de histórico para mostrar entregas já finalizadas.
 * 
 * @param entregadorId
 */

export async function listarConcluidas(entregadorId) {
    // Busca na tabela 'entregas'
    const {data, error} = await supabase
    .from('entregas')
    .select('*')
    .eq('entregador_id', entregadorId) // Filtra pelo entregador logado
    .in('status', ['entregue', 'falha']) //procura os pedidos com status concluídos, mesmo sendo entregue ou não, a pendência foi concluída e esse é o pedido do guia.
    .order('criado_em', { ascending: false }); // Mostra as mais recentes primeiro

    if (error) throw error;
    // Retorna a lista com as entregas já finalizadas
    return data;
}

/**
 * Atualiza o status da entrega (pendente -> entregue / falha).
 * Marca automaticamente o horário do registro nesse momento.
 *
 * @param entregaId
 * @param novoStatus - 'entregue' ou 'falha'
 */

export async function atualizarStatus(entregaId, novoStatus) {
    //atualiza a tabela "entregas"
    const {data, error} = await supabase
    .from('entregas')
    .update({
        status: novoStatus,  // Define o novo status enviado ('entregue' ou 'falha')
        registrado_em: new Date().toISOString(),  // Grava a data e hora exata de agora
    })
    .eq('id', entregaId) // Apenas na entrega com o ID correspondente
    .select()
    .single();

    if (error) throw error;
    // Retorna a entrega atualizada
    return data;
}

/**
 * Atualiza informações da entrega (não tem haver com o status)
 *
 * @param entregaId
 * @param dados
 */

export async function atualizarEntrega(entregaId, dados) {
     const {data, error} = await supabase
     .from('entregas')
     .update({
        codigo_pacote: dados.codigo_pacote,
        destinatario_nome: dados.destinatario_nome,
        endereco: dados.endereco,
        latitude: dados.latitude,
        longitude: dados.longitude
     })
     .eq('id', entregaId)
     .select()
     .single();

     if (error) throw error;

     return data;
}

/**
 * Exclui uma entrega definitivamente
 *
 * @param entregaId
 */


export async function deletarEntrega(entregaId){
    const {data, error} = await supabase
    .from('entregas')
    .delete()
    .eq('id', entregaId)
    .select()
    .single();

    if (error) throw error;

    return data;
}

/**
 * Atualiza os dados de um entregador ({id, nome, identificacao})
 *
 * @param id
 * @param dados
 */

export async function atualizarEntregador(id, dados) {
    const {data, error} = await supabase
    .from('entregadores')
    .update({
        nome: dados.nome,
        identificacao: dados.identificacao,
    })
    .eq('id', id)
    .select()
    .single();

    if (error) throw error;

    return data;
}


/**
 * Deleta um entregador (por meio do id)
 * mas vai falhar se o entregador possuir entregas (erro padrão do postgres, a não ser que seja cascade)
 * a falha é necessária, pq preserva o histórico de entregas (da para melhorar a função com sistema de arquivamento de entregas futuramente)
 *
 * @param id
 */

export async function deletarEntregador(id) {
    const {data, error} = await supabase
    .from('entregadores')
    .delete()
    .eq('id', id)
    .select()
    .single();

    if (error) throw error;

    return data;
}
/**
 * Lista todas as entregas do entregador.
 * Utilizada para o Dashboard e pesquisas.
 */
export async function listarTodas(entregadorId) {
    const { data, error } = await supabase
        .from("entregas")
        .select("*")
        .eq("entregador_id", entregadorId)
        .order("criado_em", { ascending: false });

    if (error) throw error;

    return data;
}
