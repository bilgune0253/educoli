
BEGIN;

-- Өмнөх status constraint-ийг олж шинэчилнэ.
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class tbl ON tbl.oid = con.conrelid
    JOIN pg_attribute att
      ON att.attrelid = tbl.oid
      AND att.attnum = ANY(con.conkey)
    WHERE tbl.oid = 'learning_requests'::regclass
      AND con.contype = 'c'
      AND att.attname = 'status'
  LOOP
    EXECUTE format(
      'ALTER TABLE learning_requests DROP CONSTRAINT %I',
      constraint_name
    );
  END LOOP;
END $$;

ALTER TABLE learning_requests
ADD CONSTRAINT learning_requests_status_check
CHECK (
  status IN (
    'open',
    'matched',
    'closed',
    'completion_pending',
    'completed',
    'disputed'
  )
);

ALTER TABLE learning_requests
ADD COLUMN IF NOT EXISTS completion_requested_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS disputed_at TIMESTAMPTZ;

COMMIT;
