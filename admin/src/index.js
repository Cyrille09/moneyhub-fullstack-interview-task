const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const request = require('request');
const investments = require('../../investments/src/data.json');
const financialCompanies = require('../../financial-companies/src/data.json');
const { createCSV } = require('../utils/createCSV');
const formatDate = require('date-fns/format');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.get('/investments/export', (req, res) => {
  const rows = [];

  for (const investment of investments) {
    for (const holding of investment.holdings) {
      for (const financialCompany of financialCompanies) {
        if (holding.id == financialCompany.id) {
          rows.push({
            ...investment,
            holding: holding,
            financialCompany: financialCompany,
          });
        }
      }
    }
  }
  const csv = createCSV(
    [
      {
        label: 'User',
        target: (record) => record.id,
      },
      {
        label: 'First Name',
        target: (record) => record.firstName,
      },
      {
        label: 'Last Name',
        target: (record) => record.lastName,
      },
      {
        label: 'Date',
        target: (record) =>
          record.date
            ? formatDate(new Date(record.date), 'dd/MM/yyyy HH:mm')
            : '',
      },
      {
        label: 'Holding',
        target: (record) => record.financialCompany.name,
      },
      {
        label: 'Value',
        target: (record) =>
          record.investmentTotal * record.holding.investmentPercentage,
      },
    ],
    rows
  );
  const filename = `users.csv`;
  res.set('Content-disposition', `attachment; filename=${filename}`);
  res.set('Content-type', 'text/csv');

  return res.send(csv);
  //return res.sendStatus(200);
});

app.get('/investments/:id', (req, res) => {
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, r, investments) => {
      if (e) {
        console.error(e);
        res.send(500);
      } else {
        res.send(investments);
      }
    }
  );
});

app.listen(config.port, (err) => {
  if (err) {
    console.error('Error occurred starting the server', err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
