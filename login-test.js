import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Cargar usuarios desde el CSV
const users = new SharedArray('usuarios', function () {
  return open('./users.csv')
    .split('\n')
    .slice(1) // quitar la cabecera
    .map((line) => {
      const [user, passwd] = line.split(',');
      return { user: user, passwd: passwd };
    });
});

// Opciones de la prueba
export const options = {
  scenarios: {
    login_test: {
      executor: 'constant-arrival-rate',
      rate: 20, // 20 TPS
      timeUnit: '1s',
      duration: '1m', // duración de 1 minuto  
      //duration: '50s',// duración de 50 segundos   
      //{ duration: '30s'// duración de 30 segundos  
      //{ duration: '10s', // duración de 10 segundos 
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% de requests < 1.5s
    http_req_failed: ['rate<0.03'], // menos del 3% fallidos
  },
};

// Función principal
export default function () {
  const user = users[Math.floor(Math.random() * users.length)];

  const payload = JSON.stringify({
    username: user.user,
    password: user.passwd,
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('https://fakestoreapi.com/auth/login', payload, {
    headers: headers,
  });

  let isJson = false;
  let jsonResponse = null;

  try {
    jsonResponse = res.json();
    isJson = true;
  } catch (e) {
    isJson = false;
  }

  check(res, {
    'Status 200': (r) => r.status === 200,
    'Respuesta < 1.5s': (r) => r.timings.duration < 1500,
    'Respuesta es JSON': () => isJson,
    'Contiene token': () => jsonResponse && jsonResponse.token !== undefined,
  });

  sleep(Math.random() * 3); // pausa aleatoria entre 0 y 3 seg
}

