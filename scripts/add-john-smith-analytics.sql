-- Add sample analytics data for John Smith
-- Based on his 2 opportunities: TechCorp Enterprise License ($450K) + Global Consulting Multi-Year Deal ($750K)

-- Get John Smith's ID for reference
-- ID: cmebbk9f30000hib1lraflkzl

-- 1. Pipeline Value (sum of his active opportunities)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'pipeline_value', 
  1200000, -- $450K + $750K = $1.2M
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "calculated_from_opportunities"}',
  NOW(),
  NOW()
);

-- 2. Closed Won (let's say he closed $600K in previous quarters)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'closed_won', 
  600000, 
  'Q4-2024', 
  '2024-10-01', 
  '2024-12-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "sample_data"}',
  NOW(),
  NOW()
);

-- 3. Win Rate (reasonable 65% for enterprise deals)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'win_rate', 
  65, 
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "sample_data"}',
  NOW(),
  NOW()
);

-- 4. Average Deal Size (based on his large enterprise deals)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'avg_deal_size', 
  600000, -- Average of his 2 current deals
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "calculated_from_opportunities"}',
  NOW(),
  NOW()
);

-- 5. Quota Attainment (50% since he has $600K closed vs $1.2M quota)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'quota_attainment', 
  50, 
  'Q4-2024', 
  '2024-10-01', 
  '2024-12-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "calculated"}',
  NOW(),
  NOW()
);

-- 6. Total Calls (enterprise reps typically make fewer but longer calls)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'total_calls', 
  45, 
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "sample_data"}',
  NOW(),
  NOW()
);

-- 7. Calls Per Week
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'calls_per_week', 
  8, 
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "sample_data"}',
  NOW(),
  NOW()
);

-- 8. Time on Calls (longer calls for enterprise deals)
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'time_on_calls', 
  2700, -- 45 hours in minutes
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "sample_data"}',
  NOW(),
  NOW()
);

-- 9. Average Call Duration 
INSERT INTO "Analytics" (metric, value, period, period_start, period_end, rep_id, metadata_json, created_at, updated_at)
VALUES (
  'avg_call_duration', 
  60, -- 60 minutes average for enterprise calls
  'Q1-2025', 
  '2025-01-01', 
  '2025-03-31', 
  'cmebbk9f30000hib1lraflkzl',
  '{"source": "sample_data"}',
  NOW(),
  NOW()
);

-- Verify the data was inserted
SELECT 
  metric, 
  value, 
  period 
FROM "Analytics" 
WHERE rep_id = 'cmebbk9f30000hib1lraflkzl' 
ORDER BY metric;