import {
  world,
  system,
  BlockPermutation,
  ItemStack,
  MolangVariableMap,
} from '@minecraft/server';
// Oxidization Map
const oxidizeMap = {
  "kado:cut_copper_vertical_slab": "kado:exposed_cut_copper_vertical_slab",
  "kado:exposed_cut_copper_vertical_slab": "kado:weathered_cut_copper_vertical_slab",
  "kado:weathered_cut_copper_vertical_slab": "kado:oxidized_cut_copper_vertical_slab",
};
// De-Oxidization Map
const deoxidizeMap = {
  "kado:exposed_cut_copper_vertical_slab": "kado:cut_copper_vertical_slab",
  "kado:weathered_cut_copper_vertical_slab": "kado:exposed_cut_copper_vertical_slab",
  "kado:oxidized_cut_copper_vertical_slab": "kado:weathered_cut_copper_vertical_slab",
};
// Waxing Map
const waxMap = {
  "kado:cut_copper_vertical_slab": "kado:waxed_cut_copper_vertical_slab",
  "kado:exposed_cut_copper_vertical_slab": "kado:waxed_exposed_cut_copper_vertical_slab",
  "kado:weathered_cut_copper_vertical_slab": "kado:waxed_weathered_cut_copper_vertical_slab",
  "kado:oxidized_cut_copper_vertical_slab": "kado:waxed_oxidized_cut_copper_vertical_slab",
};
// Un-Waxing Map
const unwaxMap = {
  "kado:waxed_cut_copper_vertical_slab": "kado:cut_copper_vertical_slab",
  "kado:waxed_exposed_cut_copper_vertical_slab": "kado:exposed_cut_copper_vertical_slab",
  "kado:waxed_weathered_cut_copper_vertical_slab": "kado:weathered_cut_copper_vertical_slab",
  "kado:waxed_oxidized_cut_copper_vertical_slab": "kado:oxidized_cut_copper_vertical_slab",
};
// All Vanilla Axe Type IDs
const axeIds = [
  "minecraft:wooden_axe",
  "minecraft:stone_axe",
  // "minecraft:copper_axe",  - Fall Game Drop -
  "minecraft:iron_axe",
  "minecraft:diamond_axe",
  "minecraft:netherite_axe",
  "minecraft:golden_axe",
];
class GetMainhandInfo {
  constructor(player) {
    const inventory = player.getComponent('inventory');
    const slot = inventory.container.getSlot(player.selectedSlotIndex);
    this.slot = slot;
    const item = slot.getItem();
    this.item = item;
    const itemTypeId = item.typeId;
    this.itemTypeId = itemTypeId;
  }
};
// Reduce Axe Durability Accounting for Unbreaking Enchantment
// NOT WORKING ~~~~~~~
function damageAxe(playerInfo) {
  if (!playerInfo.item || !axeIds.includes(playerInfo.itemTypeId)) return;
  // Get unbreaking enchantment level
  const durability = playerInfo.item.getComponent('minecraft:durability');
  const enchantable = playerInfo.item.getComponent('minecraft:enchantable');
  const hasUnbreaking = enchantable.hasEnchantment('minecraft:unbreaking');
  if (!hasUnbreaking) {
    //Damage item
    console.warn(`No Unbreaking Enchantment?!\nYou just got damaged!`)
    return;
  }
  const unbreaking = enchantable.getEnchantment('minecraft:unbreaking');
  const unbreakingLevel = unbreaking.level;
  const damageChance = 1 / (unbreakingLevel + 1);
  const damageRoll = Math.random();
  console.warn(`\nHas Unbreaking: ${hasUnbreaking}\nLevel: ${unbreakingLevel}\nDamage Chance: ${damageChance}\nDamage Roll: ${damageRoll}`);
  // Calculate chance to consume durability --- NOT WORKING.. Need to look at better documentation maybe..
  if (damageRoll < damageChance) {
    console.warn('UNLUCKY'); // THIS
    const newAxe = playerInfo.item.clone(); // SHIT
    newAxe.durability = durability.damage - 1; // FUCKIN
    playerInfo.slot.setItem(newAxe); // SUCKS
  } else {
    console.warn('LUCKY');
  }
  // If the axe is broken, remove it
  if (durability.damage >= durability.maxDurability) {
    playerInfo.slot.setItem();
    //Might not work because doesn't have player initialized..?
    player.playSound('random.break', { location: player.location });
  }
};
// Unified Custom Component Behavior
const copperBehaviorComponent = {
  // Oxidization Logic (Triggered by minecraft:tick)
  // Needs vanilla 'other copper nearby' proximity testing.
  onTick({ block }) {
    const currentBlockId = block.typeId;
    const nextBlockId = oxidizeMap[currentBlockId];
    if (!nextBlockId) return;
    const blockState = block.permutation.getAllStates();
    const newBlockPermutations = BlockPermutation.resolve(nextBlockId, blockState);
    block.setPermutation(newBlockPermutations);
  },
  // Interaction Logic
  onPlayerInteract({ block, player }) {
    const playerInfo = new GetMainhandInfo(player);
    const blockLocation = block.location;
    const waxOnParticleColor = new MolangVariableMap();
    const waxOffParticleColor = new MolangVariableMap();
    waxOnParticleColor.setColorRGB('variable.color', {red: 255, green: 180, blue: 0});
    waxOffParticleColor.setColorRGB('variable.color', {red: 150, green: 150, blue: 150});
    if (!playerInfo.item) return;
    const currentBlockId = block.typeId;
    const blockState = block.permutation.getAllStates();
    const itemIsAxe = axeIds.includes(playerInfo.itemTypeId);
    const itemIsHoneycomb = playerInfo.itemTypeId === 'minecraft:honeycomb';
    // Waxing Logic
    if (itemIsHoneycomb && waxMap[currentBlockId]) {
      block.setPermutation(BlockPermutation.resolve(waxMap[currentBlockId], blockState));
      if (playerInfo.item.amount > 1) {
      const newHoneycombAmount = new ItemStack(playerInfo.itemTypeId, playerInfo.item.amount - 1)
      playerInfo.slot.setItem(newHoneycombAmount)
      } else {
        playerInfo.slot.setItem();
      };
      player.playSound("copper.wax.on", { location: player.location });
      for (let i = 0; i < 15; i++) {
        let particleLocation = {
          x: blockLocation.x + Math.random(),
          y: blockLocation.y + Math.random(),
          z: blockLocation.z + Math.random(),
        };
        player.spawnParticle('minecraft:wax_particle', particleLocation, waxOnParticleColor);
      };
      return;
    };
    // Un-Waxing Logic
    if (itemIsAxe && unwaxMap[currentBlockId]) {
      block.setPermutation(BlockPermutation.resolve(unwaxMap[currentBlockId], blockState));
      player.playSound('copper.wax.off', { location: player.location });
      for (let i = 0; i < 15; i++) {
        let particleLocation = {
          x: blockLocation.x + Math.random(),
          y: blockLocation.y + Math.random(),
          z: blockLocation.z + Math.random(),
        };
        player.spawnParticle('minecraft:wax_particle', particleLocation, waxOffParticleColor);
      };
      damageAxe(playerInfo);
      return;
    };
    // De-Oxidization Logic
    if (itemIsAxe && deoxidizeMap[currentBlockId]) {
      block.setPermutation(BlockPermutation.resolve(deoxidizeMap[currentBlockId], blockState));
      player.playSound('copper.wax.off', { location: player.location });
      for (let i = 0; i < 15; i++) {
        let particleLocation = {
          x: blockLocation.x + Math.random(),
          y: blockLocation.y + Math.random(),
          z: blockLocation.z + Math.random(),
        };
        player.spawnParticle('minecraft:wax_particle', particleLocation, waxOffParticleColor);
      };
      damageAxe(playerInfo);
      return;
    }
    }
  };
// Component Registration
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent('kado:copper_behavior', copperBehaviorComponent);
});
