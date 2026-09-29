import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create plans
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        id: 'plan_starter',
        name: 'Starter',
        monthlyPrice: 29,
        annualPrice: 290,
        maxUsers: 3,
        maxWorkflows: 10,
        maxExecutions: 1000,
        maxIntegrations: 5,
        maxWebhooks: 3,
        aiCredits: 500,
        features: ['Basic automations', '5 integrations', 'Email support'],
        isActive: true,
        isTrial: false,
      },
    }),
    prisma.plan.create({
      data: {
        id: 'plan_pro',
        name: 'Professional',
        monthlyPrice: 99,
        annualPrice: 990,
        maxUsers: 15,
        maxWorkflows: 50,
        maxExecutions: 10000,
        maxIntegrations: 20,
        maxWebhooks: 10,
        aiCredits: 5000,
        features: ['Advanced automations', '20 integrations', 'Priority support', 'AI actions'],
        isActive: true,
        isTrial: false,
      },
    }),
    prisma.plan.create({
      data: {
        id: 'plan_enterprise',
        name: 'Enterprise',
        monthlyPrice: 299,
        annualPrice: 2990,
        maxUsers: 999999,
        maxWorkflows: 999999,
        maxExecutions: 999999999,
        maxIntegrations: 999999,
        maxWebhooks: 999999,
        aiCredits: 999999999,
        features: ['Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA'],
        isActive: true,
        isTrial: false,
      },
    }),
    prisma.plan.create({
      data: {
        id: 'plan_trial',
        name: 'Free Trial',
        monthlyPrice: 0,
        annualPrice: 0,
        maxUsers: 2,
        maxWorkflows: 3,
        maxExecutions: 100,
        maxIntegrations: 2,
        maxWebhooks: 1,
        aiCredits: 50,
        features: ['14-day trial', '2 integrations', '100 executions'],
        isActive: true,
        isTrial: true,
        trialDays: 14,
      },
    }),
  ]);

  console.log('✅ Created plans:', plans.map(p => p.name).join(', '));

  // Create super admin
  const superAdminPassword = await bcrypt.hash('admin123', 12);
  const superAdmin = await prisma.user.create({
    data: {
      id: 'usr_super_admin',
      email: 'admin@autoflow.ai',
      passwordHash: superAdminPassword,
      name: 'Platform Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created super admin:', superAdmin.email);

  // Create demo company
  const demoCompany = await prisma.company.create({
    data: {
      id: 'cmp_demo',
      name: 'Demo Company',
      industry: 'it',
      country: 'US',
      timezone: 'America/New_York',
      status: 'ACTIVE',
    },
  });

  // Create demo admin user
  const demoAdminPassword = await bcrypt.hash('demo123', 12);
  const demoAdmin = await prisma.user.create({
    data: {
      id: 'usr_demo_admin',
      email: 'john@techventures.com',
      passwordHash: demoAdminPassword,
      name: 'John Mitchell',
      role: 'COMPANY_ADMIN',
      status: 'ACTIVE',
      companyId: demoCompany.id,
    },
  });

  await prisma.company.update({
    where: { id: demoCompany.id },
    data: { adminId: demoAdmin.id },
  });

  console.log('✅ Created demo company:', demoCompany.name);
  console.log('✅ Created demo admin:', demoAdmin.email);

  // Create demo subscription
  await prisma.subscription.create({
    data: {
      companyId: demoCompany.id,
      planId: 'plan_pro',
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created demo subscription');

  // Create platform settings
  await prisma.platformSetting.createMany({
    data: [
      { key: 'maintenanceMode', value: false },
      { key: 'companySelfSignup', value: true },
      { key: 'maxCompanies', value: 1000 },
      { key: 'defaultTrialDays', value: 14 },
      { key: 'platformName', value: 'AutoFlow AI' },
      { key: 'supportEmail', value: 'support@autoflow.ai' },
    ],
  });

  console.log('✅ Created platform settings');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Demo credentials:');
  console.log('   Super Admin: admin@autoflow.ai / admin123');
  console.log('   Company Admin: john@techventures.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
