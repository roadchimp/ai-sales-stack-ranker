import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed for AI Sales Stack Ranker...')

  // Create Pipelines
  console.log('Creating pipelines...')
  const pipelines = await Promise.all([
    prisma.pipeline.create({
      data: {
        name: 'Enterprise Sales',
        description: 'Large enterprise deals over $100k',
        stage_order: JSON.stringify(['Lead', 'Qualified', 'Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'])
      }
    }),
    prisma.pipeline.create({
      data: {
        name: 'Mid-Market',
        description: 'Mid-market deals $25k-$100k',
        stage_order: JSON.stringify(['Lead', 'Qualified', 'Demo', 'Proposal', 'Closed Won', 'Closed Lost'])
      }
    }),
    prisma.pipeline.create({
      data: {
        name: 'SMB',
        description: 'Small business deals under $25k',
        stage_order: JSON.stringify(['Lead', 'Demo', 'Proposal', 'Closed Won', 'Closed Lost'])
      }
    })
  ])

  // Create Sources
  console.log('Creating lead sources...')
  const sources = await Promise.all([
    prisma.source.create({
      data: {
        name: 'Inbound Website',
        type: 'inbound',
        category: 'digital',
        cost: 0,
        description: 'Organic website traffic and contact forms'
      }
    }),
    prisma.source.create({
      data: {
        name: 'Cold Email',
        type: 'outbound',
        category: 'digital',
        cost: 800,
        description: 'Targeted cold email campaigns'
      }
    }),
    prisma.source.create({
      data: {
        name: 'LinkedIn Ads',
        type: 'paid',
        category: 'digital',
        cost: 3000,
        description: 'LinkedIn sponsored content campaigns'
      }
    }),
    prisma.source.create({
      data: {
        name: 'Partner Referral',
        type: 'referral',
        category: 'networking',
        cost: 0,
        description: 'Referrals from partner ecosystem'
      }
    }),
    prisma.source.create({
      data: {
        name: 'Trade Shows',
        type: 'outbound',
        category: 'traditional',
        cost: 12000,
        description: 'Industry conferences and events'
      }
    })
  ])

  // Create Sales Reps
  console.log('Creating sales reps...')
  const reps = await Promise.all([
    prisma.rep.create({
      data: {
        email: 'john.smith@company.com',
        name: 'John Smith',
        title: 'Enterprise Account Executive',
        quota: 1200000,
        region: 'West',
        territory: 'Enterprise Tech'
      }
    }),
    prisma.rep.create({
      data: {
        email: 'sarah.johnson@company.com',
        name: 'Sarah Johnson',
        title: 'Mid-Market Account Executive',
        quota: 750000,
        region: 'East',
        territory: 'Mid-Market'
      }
    }),
    prisma.rep.create({
      data: {
        email: 'mike.chen@company.com',
        name: 'Mike Chen',
        title: 'SMB Sales Rep',
        quota: 400000,
        region: 'Central',
        territory: 'SMB'
      }
    }),
    prisma.rep.create({
      data: {
        email: 'emily.davis@company.com',
        name: 'Emily Davis',
        title: 'Sales Manager',
        quota: 2500000,
        region: 'National',
        territory: 'All Segments'
      }
    })
  ])

  // Create Accounts (Enhanced from your existing model)
  console.log('Creating accounts...')
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        org_id: 'ORG-001',
        name: 'TechCorp Industries',
        industry: 'Technology',
        region: 'West',
        size_band: 'enterprise',
        domain: 'techcorp.com',
        website: 'https://techcorp.com',
        employees: 5000,
        revenue_range: '$500M+',
        description: 'Leading enterprise software company'
      }
    }),
    prisma.account.create({
      data: {
        org_id: 'ORG-002',
        name: 'Manufacturing Solutions Inc',
        industry: 'Manufacturing',
        region: 'Central',
        size_band: 'medium',
        domain: 'mansol.com',
        employees: 850,
        revenue_range: '$50M - $100M',
        description: 'Industrial manufacturing and automation'
      }
    }),
    prisma.account.create({
      data: {
        org_id: 'ORG-003',
        name: 'StartupCo',
        industry: 'Fintech',
        region: 'East',
        size_band: 'small',
        domain: 'startupco.io',
        employees: 45,
        revenue_range: '$1M - $10M',
        description: 'Fast-growing fintech startup'
      }
    }),
    prisma.account.create({
      data: {
        org_id: 'ORG-004',
        name: 'Global Consulting Partners',
        industry: 'Consulting',
        region: 'East',
        size_band: 'enterprise',
        domain: 'gcp.com',
        employees: 12000,
        revenue_range: '$1B+',
        description: 'International consulting firm'
      }
    })
  ])

  // Create Contacts
  console.log('Creating contacts...')
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        account_id: accounts[0].id,
        first_name: 'Robert',
        last_name: 'Wilson',
        email: 'rwilson@techcorp.com',
        title: 'VP of Technology',
        department: 'Engineering',
        is_primary: true,
        linkedin: 'https://linkedin.com/in/robertwilson'
      }
    }),
    prisma.contact.create({
      data: {
        account_id: accounts[1].id,
        first_name: 'Lisa',
        last_name: 'Martinez',
        email: 'lmartinez@mansol.com',
        title: 'Director of Operations',
        department: 'Operations',
        is_primary: true
      }
    }),
    prisma.contact.create({
      data: {
        account_id: accounts[2].id,
        first_name: 'David',
        last_name: 'Kim',
        email: 'david@startupco.io',
        title: 'CTO',
        department: 'Engineering',
        is_primary: true
      }
    })
  ])

  // Create Opportunities (Your existing structure + enhancements)
  console.log('Creating opportunities...')
  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        account_id: accounts[0].id,
        owner_id: reps[0].id,
        product_category: 'Enterprise Platform',
        amount: 450000,
        stage: 'Proposal',
        close_date: new Date('2025-02-15'),
        title: 'TechCorp Enterprise License',
        description: '3-year enterprise platform license with premium support',
        priority: 'high',
        probability: 0.75,
        source_id: sources[0].id,
        pipeline_id: pipelines[0].id
      }
    }),
    prisma.opportunity.create({
      data: {
        account_id: accounts[1].id,
        owner_id: reps[1].id,
        product_category: 'Professional Services',
        amount: 125000,
        stage: 'Discovery',
        close_date: new Date('2025-03-30'),
        title: 'Manufacturing Automation Consulting',
        description: 'Custom automation solution implementation',
        priority: 'medium',
        probability: 0.45,
        source_id: sources[4].id,
        pipeline_id: pipelines[1].id
      }
    }),
    prisma.opportunity.create({
      data: {
        account_id: accounts[2].id,
        owner_id: reps[2].id,
        product_category: 'SaaS Subscription',
        amount: 35000,
        stage: 'Demo',
        close_date: new Date('2025-01-30'),
        title: 'StartupCo Annual Subscription',
        description: 'Annual SaaS subscription for growing team',
        priority: 'medium',
        probability: 0.60,
        source_id: sources[2].id,
        pipeline_id: pipelines[2].id
      }
    }),
    prisma.opportunity.create({
      data: {
        account_id: accounts[3].id,
        owner_id: reps[0].id,
        product_category: 'Enterprise Platform',
        amount: 750000,
        stage: 'Negotiation',
        close_date: new Date('2025-01-31'),
        title: 'Global Consulting Multi-Year Deal',
        description: 'Multi-year enterprise agreement with global rollout',
        priority: 'critical',
        probability: 0.85,
        source_id: sources[3].id,
        pipeline_id: pipelines[0].id,
        outcome: null
      }
    })
  ])

  // Create Sales Stack Tools
  console.log('Creating sales stack tools...')
  const salesStacks = await Promise.all([
    prisma.salesStack.create({
      data: {
        name: 'Salesforce Sales Cloud',
        category: 'crm',
        description: 'Leading cloud-based CRM platform',
        website: 'https://salesforce.com',
        pricing_json: JSON.stringify({
          starter: '$25/user/month',
          professional: '$80/user/month',
          enterprise: '$165/user/month',
          unlimited: '$330/user/month'
        }),
        features_json: JSON.stringify([
          'Contact & Account Management',
          'Opportunity Tracking',
          'Sales Forecasting',
          'Email Integration',
          'Mobile App',
          'Custom Dashboards',
          'Workflow Automation'
        ])
      }
    }),
    prisma.salesStack.create({
      data: {
        name: 'HubSpot Sales Hub',
        category: 'crm',
        description: 'All-in-one sales platform with marketing integration',
        website: 'https://hubspot.com',
        pricing_json: JSON.stringify({
          free: '$0',
          starter: '$45/user/month',
          professional: '$800/month (5 users)',
          enterprise: '$3200/month (10 users)'
        }),
        features_json: JSON.stringify([
          'Contact Management',
          'Deal Pipeline',
          'Email Tracking',
          'Meeting Scheduling',
          'Reporting Dashboard',
          'Marketing Integration',
          'Live Chat'
        ])
      }
    }),
    prisma.salesStack.create({
      data: {
        name: 'Outreach',
        category: 'automation',
        description: 'Sales engagement and automation platform',
        website: 'https://outreach.io',
        pricing_json: JSON.stringify({
          professional: '$100/user/month',
          enterprise: 'Custom pricing'
        }),
        features_json: JSON.stringify([
          'Email Sequences',
          'Call Automation',
          'Social Selling',
          'Analytics & Reporting',
          'A/B Testing',
          'CRM Integration',
          'Sales Intelligence'
        ])
      }
    }),
    prisma.salesStack.create({
      data: {
        name: 'Gong',
        category: 'analytics',
        description: 'AI-powered revenue intelligence platform',
        website: 'https://gong.io',
        pricing_json: JSON.stringify({
          professional: '$720/user/year',
          advanced: '$1440/user/year',
          enterprise: 'Custom pricing'
        }),
        features_json: JSON.stringify([
          'Call Recording & Analysis',
          'Deal Risk Assessment',
          'Competitive Intelligence',
          'Coaching Insights',
          'Revenue Forecasting',
          'Market Intelligence',
          'Team Performance Analytics'
        ])
      }
    })
  ])

  // Create Reviews
  console.log('Creating reviews...')
  await Promise.all([
    prisma.stackReview.create({
      data: {
        stack_id: salesStacks[0].id,
        rating: 4.3,
        title: 'Powerful but Complex',
        content: 'Salesforce is incredibly powerful with extensive customization options. However, it requires significant time investment to set up properly.',
        pros: 'Highly customizable, robust reporting, extensive integrations, strong mobile app',
        cons: 'Steep learning curve, expensive, can be overwhelming for small teams',
        use_case: 'Enterprise company, 100+ sales reps',
        reviewer: 'VP of Sales',
        is_verified: true
      }
    }),
    prisma.stackReview.create({
      data: {
        stack_id: salesStacks[1].id,
        rating: 4.6,
        title: 'Perfect for Growing Teams',
        content: 'HubSpot hits the sweet spot for growing companies. Easy to use with powerful features.',
        pros: 'User-friendly interface, great free tier, excellent support, marketing integration',
        cons: 'Limited customization in lower tiers, reporting could be better',
        use_case: 'Mid-market company, 25 person sales team',
        reviewer: 'Sales Operations Manager',
        is_verified: true
      }
    }),
    prisma.stackReview.create({
      data: {
        stack_id: salesStacks[2].id,
        rating: 4.4,
        title: 'Excellent for Outbound Sales',
        content: 'Outreach has transformed our outbound sales process. The automation capabilities are outstanding.',
        pros: 'Powerful automation, great analytics, excellent email deliverability, strong integrations',
        cons: 'Expensive, requires training, limited inbound features',
        use_case: 'SaaS company, outbound-focused sales team',
        reviewer: 'Sales Director',
        is_verified: true
      }
    }),
    prisma.stackReview.create({
      data: {
        stack_id: salesStacks[3].id,
        rating: 4.7,
        title: 'Game-Changer for Sales Intelligence',
        content: 'Gong provides incredible insights into our sales calls and deals. The AI analysis is remarkably accurate.',
        pros: 'AI-powered insights, excellent call analysis, great coaching features, strong ROI',
        cons: 'Very expensive, requires buy-in from entire team, steep learning curve',
        use_case: 'Enterprise SaaS company, revenue team of 50+',
        reviewer: 'Head of Revenue Operations',
        is_verified: true
      }
    })
  ])

  // Create Sample Interactions
  console.log('Creating sample interactions...')
  await Promise.all([
    prisma.interaction.create({
      data: {
        opportunity_id: opportunities[0].id,
        type: 'call',
        channel: 'video',
        occurred_at: new Date('2024-12-01T14:00:00Z'),
        duration_min: 45,
        outcome: 'positive',
        subject: 'Technical Deep Dive Call',
        contact_id: contacts[0].id,
        rep_id: reps[0].id,
        meta_json: JSON.stringify({
          attendees: ['Robert Wilson', 'John Smith', 'Technical Architect'],
          topics: ['Integration Requirements', 'Security Review', 'Timeline Discussion']
        })
      }
    }),
    prisma.interaction.create({
      data: {
        opportunity_id: opportunities[1].id,
        type: 'email',
        channel: 'email',
        occurred_at: new Date('2024-12-03T09:30:00Z'),
        outcome: 'neutral',
        subject: 'Follow-up: Manufacturing Automation Proposal',
        contact_id: contacts[1].id,
        rep_id: reps[1].id,
        meta_json: JSON.stringify({
          email_type: 'follow_up',
          attachments: ['Proposal_v2.pdf', 'ROI_Analysis.xlsx']
        })
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Created:')
  console.log(`- ${pipelines.length} sales pipelines`)
  console.log(`- ${sources.length} lead sources`)
  console.log(`- ${reps.length} sales reps`)
  console.log(`- ${accounts.length} accounts`)
  console.log(`- ${contacts.length} contacts`)
  console.log(`- ${opportunities.length} opportunities ($${opportunities.reduce((sum, opp) => sum + opp.amount, 0).toLocaleString()} total value)`)
  console.log(`- ${salesStacks.length} sales stack tools`)
  console.log('- 4 verified reviews')
  console.log('- 2 sample interactions')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })