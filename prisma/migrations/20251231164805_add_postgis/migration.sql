-- This is an empty migration.
-- 1. Enable PostGIS if you haven't
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add the Route column (LINESTRING)
-- 4326 is the standard "World" coordinate system (WGS84)
ALTER TABLE "Shift" ADD COLUMN route geometry(LINESTRING, 4326);

-- 3. Create Spatial Indexes (This makes searching 10,000 locations instant)
CREATE INDEX shift_route_idx ON "Shift" USING GIST (route);
