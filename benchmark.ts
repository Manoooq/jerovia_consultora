import { obtenerUsuarioPorIdentificador, crearUsuario, UserRole } from './src/lib/users';

async function run() {
  console.log('Populating users...');
  for (let i = 0; i < 10000; i++) {
    await crearUsuario({
      username: `user${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      role: 'evaluador' as UserRole,
      password: 'password123'
    });
  }

  console.log('Benchmarking...');
  const start = performance.now();
  let found = 0;
  for (let i = 0; i < 10000; i++) {
    const user = obtenerUsuarioPorIdentificador(`user${i}@example.com`);
    if (user) found++;
  }
  const end = performance.now();
  console.log(`Time taken: ${(end - start).toFixed(2)}ms`);
  console.log(`Found: ${found}`);
}

run().catch(console.error);
