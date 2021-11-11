import fs from 'fs';
import plaid from 'plaid';
import mysql2 from 'mysql2';
import moment from 'moment';

// trying to land this as part of proper typescript
// see https://github.com/microsoft/TypeScript/issues/37695
type Obj<T> = Record<string, T>;

export interface PlaidConfig {
  clientId: string;
  secret: string;
  publicKey: string;
  env: string;
  institutionTokens: Obj<string>;
}

export interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

interface SyncConfig {
  plaid: PlaidConfig;
  db: DbConfig;
}

// load config. TODO: validate config
const {plaid: plaidConf, db: dbConf}: SyncConfig = JSON.parse(fs.readFileSync(`./config.json`, `utf-8`));

const dbClient = mysql2.createPool(dbConf).promise();
const plaidClient = new plaid.Client(
  plaidConf.clientId,
  plaidConf.secret,
  plaidConf.publicKey,
  plaid.environments[plaidConf.env],
  {version: '2019-05-29'},
);

function arrayAsInsertSql(tableName: string, rows: any[]): string {
  if (rows.length < 1) {
    return ``;
  }

  const esc = (str: string) => `\`${str}\``;
  const sqlParts: string[] = [];
  const columns = Object.keys(rows[0]);
  sqlParts.push(`INSERT INTO ${esc(tableName)} (${columns.map(esc).join(`, `)}) VALUES`);
  rows.forEach((row, idx) => {
    const comma = idx < rows.length - 1 ? `,` : ``;
    sqlParts.push(`(${columns.map((col) => JSON.stringify(row[col] ?? null)).join(`, `)})${comma}`);
  });
  const valueUpdates = columns
    .filter((col) => col !== `id`)
    .map((col) => `${esc(col)}=VALUES(${esc(col)})`)
    .join(`, `);
  sqlParts.push(`ON DUPLICATE KEY UPDATE ${valueUpdates}`); // upsert if primary key already exists
  sqlParts.push(`;`);
  return sqlParts.join(`\n`);
}

async function updateTable(tableName: string, rows: any[]) {
  const sql = arrayAsInsertSql(tableName, rows);
  if (!sql) return; // nothing to execute

  const sqlPreview = sql.length > 100 ? `${sql.substr(0, 97).replace(/\n/g, ` `)}...` : sql;
  console.log(`Executing ${sqlPreview}`);

  // run query
  const [queryResult] = await dbClient.execute(sql);
  console.log((queryResult as any).info);

  // write to filesystem so we have some form of a log
  fs.writeFileSync(`tables/${tableName}.sql`, sql);
}

async function fetchCategories() {
  console.log(`fetching categories`);
  const {categories} = await plaidClient.getCategories();
  const categoryRows = categories.map(({category_id, group, hierarchy}) => ({
    id: category_id,
    group,
    category: hierarchy[0],
    category1: hierarchy[1],
    category2: hierarchy[2],
  }));
  return categoryRows;
}

async function syncAccounts(institutionTokens: Obj<string>, historyMonths = 1) {
  const accountRows = [];
  const institutionRows = [];
  const transactionRows = [];
  const categoryRows = await fetchCategories();

  // refreshing transactions is not available in dev env :(
  // const accessTokens = Object.values(institutionTokens);
  // console.log(`refreshing transactions across ${accessTokens.length} accounts`);
  // await Promise.all(accessTokens.map((accessToken) => plaidClient.refreshTransactions(accessToken)));

  for (const [institutionName, accessToken] of Object.entries(institutionTokens)) {
    console.log(`fetching transactions for`, institutionName, accessToken);

    // accounts //
    try {
      const {accounts, item: institution} = await plaidClient.getAccounts(accessToken);
      institutionRows.push({
        id: institution.institution_id,
        name: institutionName,
      });

      for (const account of accounts) {
        let curBalance = account.balances.current;
        if (account.type === `credit` || account.type === `loan`) {
          curBalance *= -1;
        }

        accountRows.push({
          id: account.account_id,
          institution_id: institution.institution_id,
          balance_current: curBalance,
          mask: account.mask,
          name: account.official_name || account.name,
          type: account.type,
          subtype: account.subtype,
        });
      }
    } catch (err) {
      console.error(institutionName, err);
      continue;
    }

    // transactions //
    const startDate = moment().subtract(historyMonths, 'months').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const {transactions} = await plaidClient.getAllTransactions(accessToken, startDate, endDate);

    for (const tr of transactions) {
      if (tr.pending) {
        continue; // ignore pending transactions
      }

      // remove unneccessary prefix
      const prefixMatch = tr.name.match(/^Ext Credit Card (Debit|Credit) /);
      if (prefixMatch) {
        tr.name = tr.name.substr(prefixMatch[0].length);
      }

      if (!tr.location.country && tr.iso_currency_code === `USD` && tr.location.region) {
        tr.location.country = `US`;
      }

      transactionRows.push({
        id: tr.transaction_id,
        account_id: tr.account_id,
        name: tr.name,
        amount: -tr.amount,
        date: tr.date,
        category_id: tr.category_id,
        currency_code: tr.iso_currency_code,
        location_city: tr.location.city,
        location_state: tr.location.region,
        location_country: tr.location.country,
        // plaid types not upto date, see https://github.com/plaid/plaid-node/pull/266
        payment_channel: (tr as any).payment_channel,
      });
    }
  }

  await updateTable(`categories`, categoryRows);
  await updateTable(`institutions`, institutionRows);
  await updateTable(`accounts`, accountRows);
  await updateTable(`transactions`, transactionRows);
}

///// main /////
const historyMonths = 1; // sync one month back
syncAccounts(plaidConf.institutionTokens, historyMonths)
  .then(() => process.exit(0)) // we need manual process.exit because mysql holds pool
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
