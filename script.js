let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
let lastMultipleOf20 = 0;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

//Weapons and monsters constructor functions
const weapons = [];

class Weapons {
  constructor(name, power) {
    this.name = name;
    this.power = power;
    weapons.push(this);
  }
}

const stick = new Weapons("stick", 5);
const dagger = new Weapons("dagger", 30);
const clawHammer = new Weapons("claw hammer", 50);
const sword = new Weapons("sword", 100);

const monsters = [];

class Monsters {
  constructor(name, level, health) {
    this.name = name;
    this.level = level;
    this.health = health;
    monsters.push(this);
  }
}

const slime = new Monsters("slime", 2, 15);
const fangedBeast = new Monsters("fanged beast", 8, 60);
const dragon = new Monsters("dragon", 20, 300);

//Locations constructor function
const locations = [];

class Locations {
  constructor(name, buttonText, buttonFunctions, text) {
    this.name = name;
    this["button text"] = buttonText;
    this["button functions"] = buttonFunctions;
    this.text = text;
    locations.push(this);
  }
}

const townSquare = new Locations(
  "town square",
  ["Go to store", "Go to cave", "Fight dragon"],
  [goStore, goCave, fightDragon],
  'You are in the town square. You see a sign that says "Store".'
);

const store = new Locations(
  "store",
  ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
  [buyHealth, buyWeapon, goTown],
  "You enter the store."
);

const cave = new Locations(
  "cave",
  ["Fight slime", "Fight fanged beast", "Go to town square"],
  [fightSlime, fightBeast, goTown],
  "You enter the cave. You see some monsters."
);

const fight = new Locations(
  "fight",
  ["Attack", "Dodge", "Run"],
  [attack, dodge, goTown],
  "You are fighting a monster."
);

const killMonster = new Locations(
  "kill monster",
  ["Go to town square", "Fight again", "Go to store"],
  [goTown, goCave, goStore],
  'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
);

const loseBattle = new Locations(
  "lose",
  ["REPLAY?", "REPLAY?", "REPLAY?"],
  [restart, restart, restart],
  "You die. ☠️"
);

const winBattle = new Locations(
  "win",
  ["REPLAY?", "REPLAY?", "REPLAY?"],
  [restart, restart, restart],
  "You defeat the dragon! YOU WIN THE GAME! 🎉"
);

const easter_egg = new Locations(
  "easter egg",
  ["2", "8", "Go to town square?"],
  [pickTwo, pickEight, goTown],
  "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
);

//initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  Math.random() < 0.1 ? easterEgg() : update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = `You now have a ${newWeapon}.`;
      inventory.push(newWeapon);
      text.innerText += ` In your inventory you have: ${inventory.join(", ")}.`;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = `You sold a ${currentWeapon}.`;
    text.innerText += ` In your inventory you have:${inventory.join(", ")}.`;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsters[fighting].health;
}

function attack() {
  text.innerText = `The ${monsters[fighting].name} attacks.`;
  text.innerText += ` You attack it with your ${weapons[currentWeapon].name}.`;
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += ` Your ${inventory.pop()} BREAKS.`;
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = `You dodge the attack from the ${monsters[fighting].name}.`;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 8);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
  if (xp >= lastMultipleOf20 + 20) {
    lastMultipleOf20 += 20;
    health += 10;
    healthText.innerText = health;
    gold += 10;
    goldText.innerText = gold;
    text.innerText += " You gain 10 health and 10 gold.";
  }
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = `You picked ${guess}. Here are the random numbers:\n`;
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}
