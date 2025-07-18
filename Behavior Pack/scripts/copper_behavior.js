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
}
// De-Oxidization Map
const deoxidizeMap = {
	"kado:exposed_cut_copper_vertical_slab": "kado:cut_copper_vertical_slab",
	"kado:weathered_cut_copper_vertical_slab": "kado:exposed_cut_copper_vertical_slab",
	"kado:oxidized_cut_copper_vertical_slab": "kado:weathered_cut_copper_vertical_slab",
}
// Waxing Map
const waxMap = {
	"kado:cut_copper_vertical_slab": "kado:waxed_cut_copper_vertical_slab",
	"kado:exposed_cut_copper_vertical_slab": "kado:waxed_exposed_cut_copper_vertical_slab",
	"kado:weathered_cut_copper_vertical_slab": "kado:waxed_weathered_cut_copper_vertical_slab",
	"kado:oxidized_cut_copper_vertical_slab": "kado:waxed_oxidized_cut_copper_vertical_slab",
}
// Un-Waxing Map
const unwaxMap = {
	"kado:waxed_cut_copper_vertical_slab": "kado:cut_copper_vertical_slab",
	"kado:waxed_exposed_cut_copper_vertical_slab": "kado:exposed_cut_copper_vertical_slab",
	"kado:waxed_weathered_cut_copper_vertical_slab": "kado:weathered_cut_copper_vertical_slab",
	"kado:waxed_oxidized_cut_copper_vertical_slab": "kado:oxidized_cut_copper_vertical_slab",
}
// All Copper Blocks List
const allCopperBlocks = [
	"minecraft:copper_block",
	"minecraft:exposed_copper",
	"minecraft:weathered_copper",
	"minecraft:oxidized_copper",
	"minecraft:waxed_copper",
	"minecraft:waxed_exposed_copper",
	"minecraft:waxed_weathered_copper",
	"minecraft:waxed_oxidized_copper",
	"minecraft:cut_copper",
	"minecraft:exposed_cut_copper",
	"minecraft:weathered_cut_copper",
	"minecraft:oxidized_cut_copper",
	"minecraft:waxed_cut_copper",
	"minecraft:waxed_exposed_cut_copper",
	"minecraft:waxed_weathered_cut_copper",
	"minecraft:waxed_oxidized_cut_copper",
	"minecraft:cut_copper_stairs",
	"minecraft:exposed_cut_copper_stairs",
	"minecraft:weathered_cut_copper_stairs",
	"minecraft:oxidized_cut_copper_stairs",
	"minecraft:waxed_cut_copper_stairs",
	"minecraft:waxed_exposed_cut_copper_stairs",
	"minecraft:waxed_weathered_cut_copper_stairs",
	"minecraft:waxed_oxidized_cut_copper_stairs",
	"minecraft:cut_copper_slab",
	"minecraft:exposed_cut_copper_slab",
	"minecraft:weathered_cut_copper_slab",
	"minecraft:oxidized_cut_copper_slab",
	"minecraft:waxed_cut_copper_slab",
	"minecraft:waxed_exposed_cut_copper_slab",
	"minecraft:waxed_weathered_cut_copper_slab",
	"minecraft:waxed_oxidized_cut_copper_slab",
	"minecraft:chiseled_copper",
	"minecraft:exposed_chiseled_copper",
	"minecraft:weathered_chiseled_copper",
	"minecraft:oxidized_chiseled_copper",
	"minecraft:waxed_chiseled_copper",
	"minecraft:waxed_exposed_chiseled_copper",
	"minecraft:waxed_weathered_chiseled_copper",
	"minecraft:waxed_oxidized_chiseled_copper",
	"minecraft:copper_grate",
	"minecraft:exposed_copper_grate",
	"minecraft:weathered_copper_grate",
	"minecraft:oxidized_copper_grate",
	"minecraft:waxed_copper_grate",
	"minecraft:waxed_exposed_copper_grate",
	"minecraft:waxed_weathered_copper_grate",
	"minecraft:waxed_oxidized_copper_grate",
	"minecraft:copper_door",
	"minecraft:exposed_copper_door",
	"minecraft:weathered_copper_door",
	"minecraft:oxidized_copper_door",
	"minecraft:waxed_copper_door",
	"minecraft:waxed_exposed_copper_door",
	"minecraft:waxed_weathered_copper_door",
	"minecraft:waxed_oxidized_copper_door",
	"minecraft:copper_trapdoor",
	"minecraft:exposed_copper_trapdoor",
	"minecraft:weathered_copper_trapdoor",
	"minecraft:oxidized_copper_trapdoor",
	"minecraft:waxed_copper_trapdoor",
	"minecraft:waxed_exposed_copper_trapdoor",
	"minecraft:waxed_weathered_copper_trapdoor",
	"minecraft:waxed_oxidized_copper_trapdoor",
	"minecraft:copper_bulb",
	"minecraft:exposed_copper_bulb",
	"minecraft:weathered_copper_bulb",
	"minecraft:oxidized_copper_bulb",
	"minecraft:waxed_copper_bulb",
	"minecraft:waxed_exposed_copper_bulb",
	"minecraft:waxed_weathered_copper_bulb",
	"minecraft:waxed_oxidized_copper_bulb",
	//FGD"minecraft:copper_chest",
	//FGD"minecraft:exposed_copper_chest",
	//FGD"minecraft:weathered_copper_chest",
	//FGD"minecraft:oxidized_copper_chest",
	//FGD"minecraft:waxed_copper_chest",
	//FGD"minecraft:waxed_exposed_copper_chest",
	//FGD"minecraft:waxed_weathered_copper_chest",
	//FGD"minecraft:waxed_oxidized_copper_chest",
	"kado:cut_copper_vertical_slab",
	"kado:exposed_cut_copper_vertical_slab",
	"kado:weathered_cut_copper_vertical_slab",
	"kado:oxidized_cut_copper_vertical_slab",
	"kado:waxed_cut_copper_vertical_slab",
	"kado:waxed_exposed_cut_copper_vertical_slab",
	"kado:waxed_weathered_cut_copper_vertical_slab",
	"kado:waxed_oxidized_cut_copper_vertical_slab"
];
// All Vanilla Axe Type IDs
const axeIds = [
	"minecraft:wooden_axe",
	"minecraft:stone_axe",
	//FGD"minecraft:copper_axe",
	"minecraft:iron_axe",
	"minecraft:diamond_axe",
	"minecraft:netherite_axe",
	"minecraft:golden_axe",
];
// Gets the necessary inventory components
class GetMainhandInfo {
	constructor(player) {
		const inventory = player.getComponent('inventory');
		const slot = inventory.container.getSlot(player.selectedSlotIndex);
		this.slot = slot;
		const item = slot.getItem();
		if (!item) return;
		this.item = item;
		const itemTypeId = item.typeId;
		this.itemTypeId = itemTypeId;
	}
}
// Used to spawn the interaction particles
function spawnParticles(player, block, particle, color) {
  	const blockLocation = block.location;
 	for (let particleCount = 0; particleCount < 15; particleCount++) {
    		let particleLocation = {
     		x: blockLocation.x + Math.random(),
    		y: blockLocation.y + Math.random(),
    		z: blockLocation.z + Math.random(),
   		}
    	player.spawnParticle(particle, particleLocation, color);
  	}
}
// Reduce Axe Durability Accounting for Unbreaking Enchantment
function damageAxe(player) {
	const axeInfo = new GetMainhandInfo(player);
	if (!axeInfo.item || !axeIds.includes(axeInfo.itemTypeId)) return;
	// Get unbreaking enchantment level
	let unbreakingLevel = 0;
	const durabilityComponent = axeInfo.item.getComponent('minecraft:durability');
	const enchantableComponent = axeInfo.item.getComponent('minecraft:enchantable');
	const hasUnbreaking = enchantableComponent.hasEnchantment('minecraft:unbreaking');
	if (hasUnbreaking) unbreakingLevel = enchantableComponent.getEnchantment('minecraft:unbreaking').level;
	// Calculate chance to consume durability
	const damageChance = 1 / (unbreakingLevel + 1);
	const damageRoll = Math.random();
	// Saved by Unbreaking
	if (damageRoll > damageChance) return;
	// Damage the axe if it has the durability left
	if (durabilityComponent.damage < durabilityComponent.maxDurability) {
	  	let newAxe = new ItemStack(axeInfo.itemTypeId);
	  	newAxe = axeInfo.item
	  	let newDurabilityComponent = newAxe.getComponent('minecraft:durability');
	  	newDurabilityComponent.damage++;
	  	axeInfo.slot.setItem(newAxe);
	  	return;
	}
	// Axe is broken
	player.playSound('random.break', { location: player.location });
	axeInfo.slot.setItem();
}
// Determine oxidation level
function getOxidationLevel(blockTypeId) {
	if (blockTypeId.includes("oxidized")) return 4;
	if (blockTypeId.includes("weathered")) return 3;
	if (blockTypeId.includes("exposed")) return 2;
	if (blockTypeId.includes("copper") && !blockTypeId.includes("waxed")) return 1;
	return 0; // Not a copper block or is waxed
}
// Unified Custom Component Behavior
const copperBehaviorComponent = {
  // Oxidization Logic (Triggered by minecraft:tick)
onTick({ block }) {
    	const currentBlockId = block.typeId;
    	const nextBlockId = oxidizeMap[currentBlockId];
    	// Only proceed if this block can oxidize and is not waxed
    	if (!nextBlockId || currentBlockId.includes("waxed")) return;
    	// Pre-oxidation check
    	if (Math.random() > (64 / 1125)) return;
    	const blockLocation = block.location;
    	const currentOxidizationLevel = getOxidationLevel(currentBlockId);
    	let copperNearbyCount = 0;
    	let moreOxidizedCopperNearbyCount = 0;
    	let hasLowerOxidationNeighbor = false;
    	// Check nearby blocks (taxicab distance)
    	for (let xDirection = -4; xDirection <= 4; xDirection++) {
      		for (let yDirection = -4; yDirection <= 4; yDirection++) {
        		for (let zDirection = -4; zDirection <= 4; zDirection++) {
        		if (Math.abs(xDirection) + Math.abs(yDirection) + Math.abs(zDirection) > 4) continue; // Taxicab distance calculation
          		const neighborLocation = { x: blockLocation.x + xDirection, y: blockLocation.y + yDirection, z: blockLocation.z + zDirection };
          		const neighborBlock = world.getDimension(block.dimension.id).getBlock(neighborLocation);
          		if (neighborBlock && allCopperBlocks.includes(neighborBlock.typeId) && !neighborBlock.typeId.includes("waxed")) {
            			copperNearbyCount++;
            			const neighborOxidationLevel = getOxidationLevel(neighborBlock.typeId);
            			if (neighborOxidationLevel < currentOxidizationLevel) {
              				hasLowerOxidationNeighbor = true;
              				break; // Found a lower oxidation level, pre-oxidation ends
            				}
            				if (neighborOxidationLevel > currentOxidizationLevel) {
						// Debug: Oxidization Levels - Remove when finished
 	             				console.warn(`Oxidization Levels:\nNeighbor: ${neighborOxidationLevel}\nCurrent:${currentOxidizationLevel}`)
 	             				moreOxidizedCopperNearbyCount++; // Count higher oxidation level neighbors
 	           			}
 	         		}
 	       		}
 	       		if (hasLowerOxidationNeighbor) break;
 	     	}
      		if (hasLowerOxidationNeighbor) break;
    	}
    	if (hasLowerOxidationNeighbor) return; // Do not oxidize if a lower oxidation neighbor is found
    		// Calculate ratio of nearby copper
		let copperNearbyRatio = 0;
		if (copperNearbyCount === 0) {
			copperNearbyRatio = 0;
		} else {
			copperNearbyRatio = (moreOxidizedCopperNearbyCount + 1) / (copperNearbyCount + 1);
		}
    	let modifierValue = 1;
		if (currentOxidizationLevel === 1) { // Bare copper
			modifierValue = 0.75;
			}
    		// Calculate final oxidation probability
    		const finalOxidationProbability = modifierValue * (copperNearbyRatio * copperNearbyRatio);
    		// Apply oxidation based on probability
    		if (Math.random() < finalOxidationProbability) {
			const blockState = block.permutation.getAllStates();
			const newBlockPermutations = BlockPermutation.resolve(nextBlockId, blockState);
			block.setPermutation(newBlockPermutations);
		}
	},
	// Interaction Logic
	onPlayerInteract({ block, player }) {
		const mainhandInfo = new GetMainhandInfo(player);
		const waxOnParticleColor = new MolangVariableMap();
		const waxOffParticleColor = new MolangVariableMap();
		const deoxidizeParticleColor = new MolangVariableMap();
		waxOnParticleColor.setColorRGB('variable.color', {red: 1.0, green: 0.5, blue: 0.0});
		waxOffParticleColor.setColorRGB('variable.color', {red: 1.0, green: 1.0, blue: 1.0});
		deoxidizeParticleColor.setColorRGB('variable.color', {red: 0.0, green: 1.0, blue: 0.7});
		if (!mainhandInfo.item) return;
		const currentBlockId = block.typeId;
		const blockState = block.permutation.getAllStates();
		const itemIsHoneycomb = mainhandInfo.itemTypeId === 'minecraft:honeycomb';
		const itemIsAxe = axeIds.includes(mainhandInfo.itemTypeId);
		if (!itemIsHoneycomb && !itemIsAxe) return;
		// Waxing Logic
		if (itemIsHoneycomb && waxMap[currentBlockId]) {
			block.setPermutation(BlockPermutation.resolve(waxMap[currentBlockId], blockState));
			if (mainhandInfo.item.amount == 1) {
			  mainhandInfo.slot.setItem();
			}
			const newHoneycombAmount = new ItemStack(mainhandInfo.itemTypeId, mainhandInfo.item.amount - 1)
			mainhandInfo.slot.setItem(newHoneycombAmount)
			player.playSound("copper.wax.on", { location: player.location });
			spawnParticles(player, block, 'minecraft:wax_particle', waxOnParticleColor);
			return;
		}
		// Un-Waxing Logic
		if (itemIsAxe && unwaxMap[currentBlockId]) {
			block.setPermutation(BlockPermutation.resolve(unwaxMap[currentBlockId], blockState));
			player.playSound('copper.wax.off', { location: player.location });
			spawnParticles(player, block, 'minecraft:wax_particle', waxOffParticleColor);
			damageAxe(player);
			return;
		}
		// De-Oxidization Logic
		if (itemIsAxe && deoxidizeMap[currentBlockId]) {
			block.setPermutation(BlockPermutation.resolve(deoxidizeMap[currentBlockId], blockState));
			player.playSound('scrape', { location: player.location });
			spawnParticles(player, block, 'minecraft:wax_particle', deoxidizeParticleColor);
			damageAxe(player);
			return;
		}
	}
}
// Component Registration
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  	blockComponentRegistry.registerCustomComponent('kado:copper_behavior', copperBehaviorComponent);
});
