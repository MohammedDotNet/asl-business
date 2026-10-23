import { seedInitialAdministrator } from '../authorization/bootstrap-seed';
import { readBootstrapCredentials } from '../authorization/bootstrap-credentials';
import { loadApiEnvironment } from '../config/environment';
import { PrismaService } from './prisma.service';

async function runSeed(): Promise<void> {
  let prisma: PrismaService | undefined;
  try {
    loadApiEnvironment();
    readBootstrapCredentials(process.env);
    prisma = new PrismaService();
    await prisma.onModuleInit();
    await seedInitialAdministrator(prisma, process.env);
    console.info('Initial authorization seed completed.');
  } finally {
    delete process.env.BOOTSTRAP_ADMIN_USERNAME;
    delete process.env.BOOTSTRAP_ADMIN_PASSWORD;
    if (prisma) {
      await prisma.onModuleDestroy();
    }
  }
}

void runSeed().catch(() => {
  console.error(
    'Initial authorization seed failed. Check bootstrap configuration, migration status, and database availability.',
  );
  process.exitCode = 1;
});
