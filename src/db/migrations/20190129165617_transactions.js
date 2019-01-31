exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', table => {
        table.increments();
        table.string('tx_id', 64).notNullable().unique();
        table.string('xdr', 4096).notNullable();
        table.json('signers').notNullable();  // account_id, weight, has_signed
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('completed_at').nullable();
        table.integer('threshold').notNullable();
        table.integer('signed_weight').notNullable();
        table.jsonb('horizon_response').nullable();
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('transactions');
};
