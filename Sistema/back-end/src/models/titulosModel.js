import client from "../config/bd.js"


export async function receberTitulo(tituloIds, dataPagamento) {
    try {
       const dataPagamentoFormatada = new Date(dataPagamento);
        const dataPagamentoIso =  new Date(dataPagamentoFormatada.getFullYear(), dataPagamentoFormatada.getMonth(), dataPagamentoFormatada.getDate()).toISOString().split('T')[0];

         await Promise.all(
            tituloIds.map(async (tituloId) => {
                const result = await client.query(
                    'UPDATE cliente_titulos SET status = $1, data_pagamento = $2 WHERE id = $3',
                    ['recebido', dataPagamentoIso, tituloId]
                );
                 if (result.rowCount === 0) {
                   throw new Error(`Título com ID ${tituloId} não encontrado ou já recebido.`);
                }
              })
        );

      return { success: true, message: "Títulos recebidos com sucesso!" };
    } catch (error) {
        console.error("Erro ao receber título:", error);
        return { success: false, message: 'Erro ao receber o título' };
    }
}

export async function excluirTitulo(tituloIds) {
   try {
       await Promise.all(
          tituloIds.map(async (tituloId) => {
               const result = await client.query('DELETE FROM cliente_titulos WHERE id = $1', [tituloId]);
              if (result.rowCount === 0) {
               throw new Error(`Título com ID ${tituloId} não encontrado.`);
             }
           })
        );

      return { success: true, message: 'Títulos excluídos com sucesso!' };
   } catch (error) {
       console.error("Erro ao excluir título:", error);
       return { success: false, message: 'Erro ao excluir o título' };
   }
}

export async function adicionarTitulo(clienteId, mes, ano) {
    try {
        const clientePlanoQuery = `
            SELECT data_vencimento, id
             FROM cliente_plano
            WHERE cliente_id_FK = $1
         `;
        const clientePlanoResult = await client.query(clientePlanoQuery, [clienteId]);

        if (clientePlanoResult.rows.length === 0) {
            return { success: false, message: 'Cliente não possui plano vinculado.' };
        }
         const clientePlano = clientePlanoResult.rows[0];

        const dataVencimento = new Date();
        dataVencimento.setMonth(parseInt(mes) - 1);
        dataVencimento.setFullYear(parseInt(ano));
         dataVencimento.setDate(clientePlano.data_vencimento); 
         const dataVencimentoFormatada = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth(), dataVencimento.getDate()).toISOString().split('T')[0];
         const dataProcessamento = new Date();
         const dataProcessamentoFormatada = new Date(dataProcessamento.getFullYear(), dataProcessamento.getMonth(), dataProcessamento.getDate()).toISOString().split('T')[0];
         const result = await client.query(
            'INSERT INTO cliente_titulos (data_processamento, cliente_plano_id_FK, data_vencimento) VALUES ($1, $2, $3)',
                [dataProcessamentoFormatada, clientePlano.id, dataVencimentoFormatada]
        );
      return { success: true, message: 'Título adicionado com sucesso!' };
    } catch (error) {
          console.error("Erro ao adicionar título:", error);
          return {success: false, message: "Erro ao adicionar título."};
     }
}






