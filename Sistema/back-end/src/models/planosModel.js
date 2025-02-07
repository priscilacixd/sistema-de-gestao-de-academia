import client from "../config/bd.js";

export async function buscarPlanos() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, nome, valor FROM plano;
        `;

        client.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result.rows);
        });
    });
}

export async function excluirPlano(id) {
        console.log('ID recebido no model:', id);
        
        if (!id || isNaN(Number(id))) {
            console.warn('ID inválido fornecido ao model:', id);
            throw new Error('ID do plano inválido ou não fornecido.');
        }
    
        try {
            console.log(`Atualizando clientes vinculados ao plano ${id} para NULL...`);
            await client.query(
                'UPDATE cliente_plano SET plano_id_FK = NULL WHERE plano_id_FK = $1',
                [Number(id)]
            );
             console.log(`Clientes atualizados para NULL para o plano ${id}.`);
    
            // Agora exclui o plano
            console.log(`Excluindo plano com ID ${id}...`);
            const result = await client.query('DELETE FROM plano WHERE id = $1', [Number(id)]);
    
            if (result.rowCount === 0) {
                console.warn(`Plano com ID ${id} não encontrado no model.`);
               throw new Error('Plano não encontrado.');
            }
               return { success: true, message: 'Plano excluído com sucesso.' };
        } catch (error) {
            console.error('Erro ao excluir plano no model:', error);
            throw error; // Propagar o erro para ser tratado na rota
        }
    }

export async function adicionarPlano(plano) {

    if (!plano.nome || !plano.valor || !plano.descricao) {
        throw new Error("Dados incompletos para inserir o plano.");
    }

    try {
        await client.query('BEGIN');

        const planoQuery = `
            INSERT INTO plano (nome, valor, descricao)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const planoValues = [plano.nome, plano.valor, plano.descricao];

        const resPlano = await client.query(planoQuery, planoValues);
        console.log('Plano inserido com ID:', resPlano.rows[0].id);

        await client.query('COMMIT');
        return { success: true, message: 'Plano cadastrado com sucesso!' };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao adicionar plano:', error);
        throw error;
    }
}

export async function getPlanoDetalhes(planoId) {
    try {
      const planoQuery = `
          SELECT id, nome, valor, descricao FROM plano WHERE id = $1;
      `;
      const result = await client.query(planoQuery, [planoId]);
  
      if (result.rows.length > 0) {
        const plano = result.rows[0];
        return {
          success: true,
          plano: {
            id: plano.id,
            nome: plano.nome,
            valor: plano.valor,
            descricao: plano.descricao
          }
        };
      } else {
        return { success: false, message: "Plano não encontrado." };
      }
    } catch (error) {
      console.error("Erro ao buscar plano:", error);
      return { success: false, message: "Erro ao buscar plano." };
    }
  }



