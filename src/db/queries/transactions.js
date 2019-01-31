const knex = require('../connection');

const createNewTransaction = (tx_id, xdr, signers, threshold, signed_weight) => {
    signers = JSON.stringify(signers);
    return knex('transactions')
        .insert({tx_id, xdr, signers, threshold, signed_weight})
        .returning('*')
        .get(0);
};

const queryTransactionsByPublicKey = (publicKey, limit, offset) => {
    return knex('transactions')
        .select('*')
        .whereRaw(`signers::jsonb @> '[{"public_key":"${publicKey}"}]'`)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset)
        .returning("*")
};

const queryTransactionById = tx_id => {
    return knex('transactions')
        .select('*')
        .where({tx_id: tx_id})
        .first()
        .returning("*")
};

const updateTransactionById = (tx_id, xdr, signers, signed_weight, updated_at, horizon_response) => {
    signers = JSON.stringify(signers);
    // horizon_response = JSON.stringify(horizon_response);
    return knex('transactions')
        .update({
            xdr, signers, signed_weight, updated_at, horizon_response
        })
        .where({tx_id})
        .returning("*")
        .get(0)
};

module.exports = {
    createNewTransaction,
    queryTransactionsByPublicKey,
    queryTransactionById,
    updateTransactionById
};