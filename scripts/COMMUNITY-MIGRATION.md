# Community media migration — phase 1

The default command is read-only:

    node scripts/migrate-community-media.js

Production procedure (requires explicit approval):

1. Deploy the profile upload fix and confirm Cloudinary is configured.
2. Temporarily stop every writer to this MongoDB database (Render and local POS/app instances). Keep them stopped through migration. A script flag is an acknowledgement, not an automatic lock.
3. Run from the project directory:

       node scripts/migrate-community-media.js --apply --writers-stopped

4. The script saves and verifies a full EJSON backup in ignored backups/ before uploading images. It deduplicates identical embedded images, preserves all other data, and rejects its final update if the original data changed during execution. Upload failures leave MongoDB unchanged. Uploaded assets are retained for retry; nothing is deleted from Cloudinary.
5. Restart all app instances to clear old caches. Reload browsers. Verify profiles, images, posts, login and business data. Repeat the read-only command and measure a cold database read.

Do not restore the old document blindly after users resume editing: later changes would be lost. Keep the backup private; it contains application data.

Phase 2: after measuring phase 1, move social collections out of master_db with a separate reviewed migration and compatible read/write paths. This migration does not separate MongoDB collections.
