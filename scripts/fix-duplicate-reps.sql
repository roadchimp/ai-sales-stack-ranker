-- Fix duplicate rep records by updating foreign keys to point to primary reps
-- Using correct IDs from the database

-- 1. Update Sarah Johnson opportunities to point to the primary record
UPDATE "Opportunity" 
SET owner_id = 'cmebbk9f30001hib1xfiwokhv' -- Primary Sarah Johnson (East)
WHERE owner_id = 'cmebmou6z0001rodqw6qndp64'; -- Duplicate Sarah Johnson (West)

-- 2. Update Mike Chen opportunities to point to the primary record  
UPDATE "Opportunity"
SET owner_id = 'cmebbk9f30003hib1bap22isv' -- Primary Mike Chen (Central)
WHERE owner_id = 'cmebmou710002rodq4hkheaim'; -- Duplicate Mike Chen (Northeast)

-- 3. Update Emily Davis opportunities to point to the primary record
UPDATE "Opportunity" 
SET owner_id = 'cmebbk9f30002hib1ie3af10i' -- Primary Emily Davis (National)
WHERE owner_id = 'cmebmou720003rodqf441y83h'; -- Duplicate Emily Davis (Central)

-- 4. Update interactions to point to primary reps
UPDATE "Interaction"
SET rep_id = 'cmebbk9f30001hib1xfiwokhv' -- Primary Sarah Johnson
WHERE rep_id = 'cmebmou6z0001rodqw6qndp64'; -- Duplicate Sarah Johnson

UPDATE "Interaction"  
SET rep_id = 'cmebbk9f30003hib1bap22isv' -- Primary Mike Chen
WHERE rep_id = 'cmebmou710002rodq4hkheaim'; -- Duplicate Mike Chen

UPDATE "Interaction"
SET rep_id = 'cmebbk9f30002hib1ie3af10i' -- Primary Emily Davis  
WHERE rep_id = 'cmebmou720003rodqf441y83h'; -- Duplicate Emily Davis

-- 5. Update analytics to point to primary reps
UPDATE "Analytics"
SET rep_id = 'cmebbk9f30001hib1xfiwokhv' -- Primary Sarah Johnson
WHERE rep_id = 'cmebmou6z0001rodqw6qndp64'; -- Duplicate Sarah Johnson

UPDATE "Analytics"
SET rep_id = 'cmebbk9f30003hib1bap22isv' -- Primary Mike Chen  
WHERE rep_id = 'cmebmou710002rodq4hkheaim'; -- Duplicate Mike Chen

UPDATE "Analytics"
SET rep_id = 'cmebbk9f30002hib1ie3af10i' -- Primary Emily Davis
WHERE rep_id = 'cmebmou720003rodqf441y83h'; -- Duplicate Emily Davis

-- 6. Now safe to delete the duplicate rep records
DELETE FROM "Rep" WHERE id = 'cmebmou6z0001rodqw6qndp64'; -- Duplicate Sarah Johnson
DELETE FROM "Rep" WHERE id = 'cmebmou710002rodq4hkheaim'; -- Duplicate Mike Chen  
DELETE FROM "Rep" WHERE id = 'cmebmou720003rodqf441y83h'; -- Duplicate Emily Davis

-- Verify the cleanup
SELECT COUNT(*) as total_reps FROM "Rep" WHERE is_active = true;
SELECT name, COUNT(*) as count FROM "Rep" WHERE is_active = true GROUP BY name HAVING COUNT(*) > 1;