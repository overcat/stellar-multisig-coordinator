const stellarSdk = require('stellar-sdk');
const config = require('../config');
const AppError = require('./errors');
const server = new stellarSdk.Server(config.horizon_url);

stellarSdk.Network.use(new stellarSdk.Network(config.network_passphrase));

const parseNewXDR = async xdr => {
    let tx;
    try {
        tx = new stellarSdk.Transaction(xdr);
    } catch (e) {
        throw new AppError(400, 'transaction_malformed', 'We could not decode the transaction envelope in this request. A transaction should be an XDR TransactionEnvelope struct encoded using base64.')
    }

    let threshold = 0;
    let signers = [];
    let accountData;
    try {
        accountData = await server.loadAccount(tx.source);
    } catch (e) {
        if (e.response.type === 'https://stellar.org/horizon-errors/not_found') {
            throw new AppError(400, "account_not_found", "Couldn't find your account on the network.")
        } else {
            throw new AppError(500, "unknown", "We can not load source account right now.")
        }
    }

    for (let operation of tx.operations) {
        if (operation.source !== accountData.source) {
            throw new AppError(400, 'op_source_diff', 'The source account for the operation should be the same as the source account for the transaction.')
        }
        switch (operation.type) {
            case 'allowTrust':
            case 'bumpSequence':
                threshold = accountData.thresholds.low_threshold > threshold ? accountData.thresholds.low_threshold : threshold;
                break;
            case 'accountMerge':
                threshold = accountData.thresholds.high_threshold;
                break;
            case 'setOptions': {
                if (typeof operation.masterWeight !== 'undefined' ||
                    typeof operation.lowThreshold !== 'undefined' ||
                    typeof operation.medThreshold !== 'undefined' ||
                    typeof operation.highThreshold !== 'undefined' ||
                    typeof operation.signer !== 'undefined') {
                    threshold = accountData.thresholds.high_threshold;
                } else {
                    threshold = accountData.thresholds.med_threshold > threshold ? accountData.thresholds.med_threshold : threshold;
                }
                break;
            }
            default:
                threshold = accountData.thresholds.med_threshold > threshold ? accountData.thresholds.med_threshold : threshold;
        }
    }

    let txSignatures = tx.signatures.map(signature => {
        return {
            'hint': signature.hint().toString('hex'),
            'signature': signature.signature()
        }
    });

    let signedWeight = 0;
    for (let signer of accountData.signers) {
        if (signer.type === 'ed25519_public_key' && signer.weight !== 0) {
            const keyPair = stellarSdk.Keypair.fromPublicKey(signer.public_key);
            const signatureHint = keyPair.signatureHint().toString('hex');
            const signed = txSignatures.find(x => x.hint === signatureHint);
            if (signed) {
                if (txSignatures.length !== 0 && signedWeight >= threshold && signedWeight !== 0) {
                    throw new AppError(400, 'bad_auth_extra', 'Unused signatures attached to transaction.')
                }
                txSignatures = txSignatures.filter(x => x.hint !== signatureHint);
                signedWeight += signer.weight;
                if (!keyPair.verify(tx.hash(), signed.signature)) {
                    throw new AppError(400, 'signature_malformed', 'malformed signature attached to transaction.')
                }
            }
            signers.push({
                'public_key': signer.public_key,
                'weight': signer.weight,
                'hint': signatureHint,
                'signed': !!signed
            })
        }
    }
    if (signedWeight >= threshold) {
        throw new AppError(400, 'submitted_through_horizon', 'This transaction has been granted sufficient permissions, so it should be submitted through horizon.')
    }
    if (txSignatures.length !== 0) {
        throw new AppError(400, 'bad_auth_exclude', 'Signature not in the signers')
    }
    return {threshold, signedWeight, signers}
};


const parseUpdateXDR = async (originXDR, newXDR, threshold, signedWeight, signers) => {
    const originTx = new stellarSdk.Transaction(originXDR);
    const newTx = new stellarSdk.Transaction(newXDR);
    if (originTx.hash().toString('hex') !== newTx.hash().toString('hex')) {
        throw new AppError(400, 'hash_changed', 'The hash of the transaction has changed.')
    }
    const newTxSignatures = newTx.signatures.map(signature => {
        return {
            'hint': signature.hint().toString('hex'),
            'signature': signature.signature()
        }
    });

    const newTxSignaturesDuplicate = newTxSignatures.map(x => x.hint);
    if (newTxSignaturesDuplicate.length !== (new Set(newTxSignaturesDuplicate)).size) {
        throw new AppError(400, 'bad_auth_duplicate', 'Duplicate signature attached to transaction.')
    }

    const oldTxSignaturesHint = signers.filter(signer => signer.signed).map(signer => signer.hint);

    if (oldTxSignaturesHint.filter(hint => !newTxSignatures.find(x => x.hint === hint)).length !== 0) {
        throw new AppError(400, 'signatures_outdate', 'The XDR you are using is out of date, please update it first.')
    }

    let txAddSignatures = newTxSignatures.filter(signature => !oldTxSignaturesHint.find(hint => hint === signature.hint));
    // if (txAddSignatures.length === 0) {
    //     throw new AppError(400, 'not_found_new_signature', 'Looks like you did not provide a new signature')
    // }
    for (let signer of signers.filter(signer => !signer.signed)) {
        const signatureHint = signer.hint;
        const signed = txAddSignatures.find(x => x.hint === signatureHint);
        if (signed) {
            if (txAddSignatures.length !== 0 && signedWeight >= threshold) {
                throw new AppError(400, 'bad_auth_extra', 'Unused signatures attached to transaction.')
            }
            txAddSignatures = txAddSignatures.filter(x => x.hint !== signatureHint);
            signedWeight += signer.weight;
            signer.signed = true;
            const keyPair = stellarSdk.Keypair.fromPublicKey(signer.public_key);
            if (!keyPair.verify(originTx.hash(), signed.signature)) {
                throw new AppError(400, 'signature_malformed', 'malformed signature attached to transaction.')
            }
        }
    }
    if (txAddSignatures.length !== 0) {
        throw new AppError(400, 'bad_auth_exclude', 'Signature not in signers')
    }
    return {signedWeight, signers}
};

const submitXDR = async xdr => {
    const transactionEnvelope = stellarSdk.xdr.TransactionEnvelope.fromXDR(xdr, 'base64');
    const transaction = new stellarSdk.Transaction(transactionEnvelope);
    return server.submitTransaction(transaction).then(resp => {
        return {status: 200, data: resp}
    }).catch(e => {
        if (e.response && e.response.data && e.response.data.title) {
            return {status: e.response.data.status, data: e.response.data}
        } else {
            throw new AppError(500, 'submit_failed', 'We were unable to successfully submit the transaction to horizon, so you can resend the request to us later, or submit the signed transaction to horizon now.')
        }
    })
};

// const isValidSignature = (keyPair, hash, signature) => keyPair.verify(hash, signature);

module.exports = {
    parseNewXDR,
    parseUpdateXDR,
    submitXDR
};
