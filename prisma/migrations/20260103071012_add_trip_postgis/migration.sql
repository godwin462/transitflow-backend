-- 4326 is the standard "World" coordinate system (WGS84)
ALTER TABLE "Trip" ADD COLUMN route geometry(LINESTRING, 4326);

-- 3. Create Spatial Indexes (This makes searching 10,000 locations instant)
CREATE INDEX trip_route_idx ON "Trip" USING GIST (route);
