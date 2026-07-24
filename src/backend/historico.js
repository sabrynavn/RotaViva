import { supabase } from './supabase';

export async function registrarAcao({
  acao,
  descricao,
  entregaId = null,
  entregadorId = null,
}) {
  const { data, error } = await supabase
    .from('historico_acoes')
    .insert([
      {
        acao,
        descricao,
        entrega_id: entregaId ? String(entregaId) : null,
        entregador_id: entregadorId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log('Erro ao registrar histórico:', error.message);
    throw error;
  }

  return data;
}