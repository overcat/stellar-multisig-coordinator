const crypto = require('crypto');
const Router = require('koa-router');
const qs = require('qs');
const url = require('url');
const knex = require('../db/connection');
const software_information = require('../../package.json');
const config = require('../../config');
const AppError = require('../errors');
const {parseNewXDR, parseUpdateXDR, submitXDR} = require('../utils');
const {createNewTransaction, queryTransactionsByPublicKey, queryTransactionById, updateTransactionById} = require('../db/queries/transactions');
const router = new Router();

router.get('/', async ctx => {
    return ctx.body = {
        "name": software_information.name,
        "version": software_information.version,
        "network_passphrase": config.network_passphrase,
        "service_url": config.service_url,
        "horizon_url": config.horizon_url,
        "email": config.email,
        "source_code": software_information.homepage,
        "description": software_information.description,
    };
});

router.post('/transactions', async ctx => {
    const xdr = ctx.request.body.tx;
    const txId = crypto.randomBytes(32).toString('hex');
    const {threshold, signedWeight, signers} = await parseNewXDR(xdr);
    const txRecord = await createNewTransaction(txId, xdr, signers, threshold, signedWeight);
    return ctx.body = responseJSON(txRecord)
});

router.get('/transactions/:publicKey', async ctx => {
    const limit = ctx.query.limit || 10;
    const offset = ctx.query.offset || 0;
    const txRecords = await queryTransactionsByPublicKey(ctx.params.publicKey, limit, offset);
    return ctx.body = txRecords.map(txRecord => responseJSON(txRecord))
});


router.post('/transaction/:id', async ctx => {
    const newXdr = ctx.request.body.tx;
    const originTxRecord = await queryTransactionById(ctx.params.id);
    if (!originTxRecord) {
        throw new AppError(400, 'transaction_not_found', 'Can not found the transaction.')
    }
    const {signedWeight, signers} = await parseUpdateXDR(originTxRecord.xdr, newXdr, originTxRecord.threshold, originTxRecord.signed_weight, originTxRecord.signers);

    let update_at = knex.fn.now();
    let xdr = newXdr;
    if (signedWeight === originTxRecord.signed_weight) {
        update_at = originTxRecord.updated_at;
        xdr = originTxRecord.xdr
    }
    let newTxRecord = await updateTransactionById(ctx.params.id, xdr, signers, signedWeight, update_at, originTxRecord.horizon_response);

    if (signedWeight >= originTxRecord.threshold && !originTxRecord.horizon_response) {
        const horizon_response = await submitXDR(newXdr);
        newTxRecord = await updateTransactionById(ctx.params.id, xdr, signers, signedWeight, update_at, horizon_response);
    }

    return ctx.body = responseJSON(newTxRecord)
});

router.get('/transaction/:id', async ctx => {
    const record = await queryTransactionById(ctx.params.id);
    if (!record) {
        throw new AppError(400, 'transaction_not_found', 'Can not found the transaction.')
    }
    return ctx.body = responseJSON(record)
});


const responseJSON = (txRecord) => {
    const urlScheme = "web+stellar:tx?";
    const request_uri = urlScheme + qs.stringify({
        callback: 'url:' + url.resolve(config.service_url, `/transaction/${txRecord.tx_id}`),
        network_passphrase: config.network_passphrase,
        xdr: txRecord.xdr
    });
    return {
        'id': txRecord.tx_id,
        'created_at': txRecord.created_at,
        'updated_at': txRecord.updated_at,
        'threshold': txRecord.threshold,
        'request_uri': request_uri,
        'signers': txRecord.signers.map(signer => {
            return {
                'public_key': signer.public_key,
                'signed': signer.signed,
                'weight': signer.weight
            }
        }),
        'horizon_response': txRecord.horizon_response
    }
};

module.exports = router.routes();
