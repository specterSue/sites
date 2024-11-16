// Constants for image paths for each character type
const murlocImages = ['murloc/murloc1.jpg', 'murloc/murloc2.jpg', 'murloc/murloc3.jpg', 'murloc/murloc4.jpg', 'murloc/murloc5.jpg', 'murloc/murloc6.jpg', 'murloc/murloc7.jpg'];
const demonImages = ['demons/demon1.jpg', 'demons/demon2.jpg', 'demons/demon3.jpg', 'demons/demon4.jpg', 'demons/demon5.jpg', 'demons/demon6.jpg'];

// Event listeners for adding characters and initiating the fight
document.getElementById('holyday').addEventListener('click', () => addCharacterToTeam('team1', 'murloc'));
document.getElementById('notEveryDayIsAHolyday').addEventListener('click', () => addCharacterToTeam('team2', 'demon'));
document.getElementById('fightButton').addEventListener('click', startFight);

// Add a character to a specified team with checks for box overflow
function addCharacterToTeam(teamId, type) {
    const teamElement = document.getElementById(teamId);
    if (!teamElement) return; // Exit if team element is not found

    const container = createCharacterContainer(type);
    if (canAddCharacter(teamElement, container)) {
        teamElement.appendChild(container);
    } else {
        console.log(`Cannot add ${type}: would overflow the box.`);
    }
}

// Creates a character container with image, type, and stats
function createCharacterContainer(type) {
    const container = document.createElement('div');
    container.classList.add('character-container', 'container');
    container.appendChild(createImageElement(type));
    container.appendChild(createStatElement(generateStat(), 'character-health-stat'));
    container.appendChild(createStatElement(generateStat(), 'character-attack-stat'));
    container.appendChild(createTypeElement(type));
    return container;
}

// Adds character type label (e.g., 'murloc' or 'demon')
function createTypeElement(type) {
    const typeChar = document.createElement('div');
    typeChar.classList.add('character-type');
    typeChar.textContent = type;
    return typeChar;
}

// Creates the character's image element with a random image source
function createImageElement(type) {
    const img = document.createElement('img');
    img.classList.add("container-img");
    img.src = getRandomImage(type);
    img.alt = type;
    return img;
}

// Creates a health or attack stat element with a given value and class
function createStatElement(value, className) {
    const statElement = document.createElement('div');
    statElement.classList.add(className);
    statElement.textContent = value;
    return statElement;
}

// Selects a random image from the appropriate array based on character type
function getRandomImage(type) {
    const images = type === 'murloc' ? murlocImages : demonImages;
    return images[Math.floor(Math.random() * images.length)];
}

// Checks if a character can be added to a team without exceeding 80% of viewport height
function canAddCharacter(teamElement, container) {
    return teamElement.clientHeight + container.clientHeight <= 0.8 * window.innerHeight;
}

// Generates a random stat value between 1 and 10
function generateStat() {
    return Math.floor(Math.random() * 10 + 1).toString();
}

// Initiates the fight if both teams have at least one character
function startFight() {
    const team1 = getTeamCharacters('team1');
    const team2 = getTeamCharacters('team2');
    if (team1.length && team2.length) fightRound(team1, team2);
    else console.log("Both teams must have at least one character to fight!");
}

// Retrieves an array of character containers for the specified team
function getTeamCharacters(teamId) {
    return Array.from(document.querySelectorAll(`#${teamId} .character-container`));
}

// Conducts a single fight round between two teams
function fightRound(team1, team2) {
    const [character1, character2] = [team1[0], team2[0]]; // Select the first character in each team
    animateMoveToCenter(character1, character2); // Animate movement to center
    setTimeout(() => resolveRound(character1, character2, team1, team2), 1000);
}

// Announces the winner when one team is depleted
function announceWinner(winner) {
    setTimeout(() => alert(`${winner} won the battle!`), 400);
}

// Adds CSS classes to animate characters moving to the center for the fight
function animateMoveToCenter(character1, character2) {
    character1.classList.add('moveToCenterTeam1');
    character2.classList.add('moveToCenterTeam2');
}

// Resolves a single fight round, applying animations and updating health
function resolveRound(character1, character2, team1, team2) {

    const char1Stats = getCharacterStats(character1);
    const char2Stats = getCharacterStats(character2);


    if (char1Stats.health > 0 && char2Stats.health > 0) {
        setTimeout(() => {
            applyRoundAnimations(character2);
            applyDamage(char1Stats, char2Stats.attack); // Apply damage to each character

            checkCharacterHealth(char1Stats, character1, team1); // Remove if health <= 0

            setTimeout(() => {
                if (char1Stats.health > 0) {
                applyRoundAnimations(character1);
                applyDamage(char2Stats, char1Stats.attack);

                checkCharacterHealth(char2Stats, character2, team2);
                }
            }, 500);
        }, 500);

    }
    // Continue fight if both teams still have characters
    if (team1.length && team2.length){ setTimeout(() => fightRound(team1, team2), 1000)}
    else winnerAnnoucer(team1,team2)
    
}

function winnerAnnoucer(team1,team2){
    if (!team1.length && team2.length) { announceWinner('demons') }
    else if (!team2.length && team1.length) { announceWinner('murlocs') }
    else { announceWinner('no one') }
    return
}

// Triggers animations for attack moves for both characters in a round
function applyRoundAnimations(character1) {
    const char1Stats = getCharacterStats(character1);
    animateAttack(char1Stats.type, character1);
}

// Retrieves health, attack, and type data from a character container
function getCharacterStats(character) {
    return {
        healthElem: character.querySelector('.character-health-stat'),
        attack: parseInt(character.querySelector('.character-attack-stat').textContent),
        health: parseInt(character.querySelector('.character-health-stat').textContent),
        type: character.querySelector('.character-type').textContent.trim(),
    };
}

// Applies damage to a character's health and updates the display
function applyDamage(stats, damage) {
    stats.health = Math.max(stats.health - damage, 0); // Health can't go below 0
    stats.healthElem.textContent = stats.health;
}

// Checks character health and removes them if defeated
function checkCharacterHealth(stats, character, team) {
    if (stats.health <= 0) {
        removeCharacter(character, team);
    }
}

// Adds 'loser' class and removes defeated character from the DOM and team array
function removeCharacter(character, team) {
    character.classList.add('loser');
    setTimeout(() => {
        character.remove();
        team.shift();
    }, 500);
}

// Animates the character's attack based on its type
function animateAttack(type, character) {
    const animationElement = createAttackAnimationElement(type);
    document.body.appendChild(animationElement);
    setTimeout(() => animationElement.remove(), 500);
}

// Creates attack animation element for the specified character type
function createAttackAnimationElement(type) {
    const animationElement = document.createElement('div');
    animationElement.classList.add(type === 'murloc' ? 'murlocAttackAnime' : 'demonAttackAnime');
    return animationElement;
}

