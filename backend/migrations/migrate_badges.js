#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const users = await User.find();
  console.log(`Found ${users.length} users`);

  let updatedCount = 0;

  for (const user of users) {
    const update = {};
    let willUpdate = false;

    // Ensure collectibles exists
    if (!user.collectibles) {
      update['collectibles'] = { badges: [] };
      willUpdate = true;
    }

    // 1) Convert old `collectibles.badgeIds` (if present) -> `collectibles.badges` [{id, level}]
    if (Array.isArray(user.collectibles && user.collectibles.badgeIds) && (!Array.isArray(user.collectibles.badges) || user.collectibles.badges.length === 0)) {
      update['collectibles.badges'] = user.collectibles.badgeIds.map(id => ({ id, level: 0 }));
      willUpdate = true;
      console.log(`User ${user._id}: will migrate collectibles.badgeIds -> collectibles.badges (${user.collectibles.badgeIds.length} items)`);
    }

    // 2) If collectibles.badges is an array of strings, convert
    if (Array.isArray(user.collectibles && user.collectibles.badges) && user.collectibles.badges.length > 0 && typeof user.collectibles.badges[0] === 'string') {
      update['collectibles.badges'] = user.collectibles.badges.map(id => ({ id, level: 0 }));
      willUpdate = true;
      console.log(`User ${user._id}: will convert collectibles.badges string[] -> object[]`);
    }

    // 3) Normalize badgesEquipped
    if (!Array.isArray(user.badgesEquipped)) {
      // ensure default two slots
      update['badgesEquipped'] = [{ id: 'default', level: 0 }, { id: 'default', level: 0 }];
      willUpdate = true;
      console.log(`User ${user._id}: will initialize missing badgesEquipped`);
    } else if (user.badgesEquipped.length > 0) {
      // if badgesEquipped contains strings -> convert
      if (typeof user.badgesEquipped[0] === 'string') {
        update['badgesEquipped'] = user.badgesEquipped.map(id => {
          if (id === 'default') return { id: 'default', level: 0 };
          const owned = (user.collectibles && Array.isArray(user.collectibles.badges)) ? user.collectibles.badges.find(b => b.id === id) : null;
          return { id, level: owned ? (owned.level ?? 0) : 0 };
        });
        willUpdate = true;
        console.log(`User ${user._id}: will convert badgesEquipped string[] -> object[]`);
      } else if (user.badgesEquipped.length > 0 && user.badgesEquipped[0] && user.badgesEquipped[0]._id) {
        // maybe equipped items are objects with _id
        update['badgesEquipped'] = user.badgesEquipped.map(e => {
          const id = e.id || e._id || (e._id && e._id._id) || null;
          if (!id) return { id: 'default', level: e.level ?? 0 };
          const owned = (user.collectibles && Array.isArray(user.collectibles.badges)) ? user.collectibles.badges.find(b => b.id === id) : null;
          return { id, level: owned ? (owned.level ?? e.level ?? 0) : (e.level ?? 0) };
        });
        willUpdate = true;
        console.log(`User ${user._id}: will normalize badgesEquipped objects -> {id,level}`);
      }
    }

    if (willUpdate) {
      try {
        await User.updateOne({ _id: user._id }, { $set: update });
        updatedCount++;
      } catch (err) {
        console.error(`Failed to update user ${user._id}:`, err.message || err);
      }
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} users.`);
  await mongoose.disconnect();
  process.exit(0);
}

// Simple CLI: run with `--run` to execute (this script applies changes by default)
main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
