const http = require('http');
const url = require('url');
const querystring = require('querystring');

exports.ibgeapistate = (req, res) => {
  const options = {
    hostname: 'servicodados.ibge.gov.br',
    path: '/api/v1/localidades/estados',
    method: 'GET',
  };

  const apireq = http.request(options, (apires) => {
    let data = '';

    apires.on('data', (chunk) => {
      data += chunk;
    });

    apires.on('end', () => {
      if (apires.statusCode === 200) {
        try {
          if (data) {
            const response = JSON.parse(data);

            const brStates = response.map((state) => ({
              id: state.id,
              name: state.nome,
            })).sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();

              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });

            res.send(brStates);
          } else {
            throw new Error('Empty response');
          }
        } catch (error) {
          res.status(500).send('Internal Server Error');
        }
      } else {
        res.status(apires.statusCode).send(apires.statusMessage);
      }
    });
  });

  apireq.on('error', (error) => {
    console.log(error);
    res.status(500).send('Internal Server Error');
  });

  apireq.end();
};

exports.ibgeapicities = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query);
  const { uf } = queryParams;

  const options = {
    hostname: 'servicodados.ibge.gov.br',
    path: `/api/v1/localidades/estados/${encodeURIComponent(uf)}/distritos`,
    method: 'GET',
  };

  const apireq = http.request(options, (apires) => {
    let data = '';

    apires.on('data', (chunk) => {
      data += chunk;
    });

    apires.on('end', () => {
      if (apires.statusCode === 200) {
        try {
          if (data) {
            const response = JSON.parse(data);

            const stateCity = response.map((city) => city.municipio.nome).sort((a, b) => {
              const nameA = a.toLowerCase();
              const nameB = b.toLowerCase();

              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });

            const stateCitySet = new Set(stateCity);

            res.send([...stateCitySet]);
          } else {
            throw new Error('Empty response');
          }
        } catch (error) {
          res.status(500).send('Internal Server Error');
        }
      } else {
        res.status(apires.statusCode).send(apires.statusMessage);
      }
    });
  });

  apireq.on('error', () => {
    res.status(500).send('Internal Server Error');
  });

  apireq.end();
};
