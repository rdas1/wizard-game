import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
// import { SudokuScene } from '../sudoku/sudoku.component';
import { PuzzleScene } from "../tile-swap/tile-swap.component";
import { LetterScene } from '../end/end.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class RpgComponent implements OnInit {

  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      scene: [ MainScene, PuzzleScene, LetterScene ],
      scale: {
        mode: Phaser.Scale.RESIZE, // Use the RESIZE scale mode for responsiveness
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          tileBias: 32
        }
      }
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

}

export class MainScene extends Phaser.Scene {

  DIALOGUE = [
    { text: "Welcome, traveler!\n\nI am the famed wizard\nSaj I. Tarius.\n\nWelcome to my wizardly world!", options: ["Next"]},
    { text: "I am ancient, and have seen much of the universe;\n\nbut I have never seen eyes as beautiful as yours.", options: ["Next"]},
    { text: "Can it be, that you are the legendary Princess Gina?\n\nAll the stories say that the light of a million stars dances in her eyes...", options: ["Next"]},
    { text: "If you are indeed the famed Princess Gina, then I have a letter for you!", options: ["Next"]},
    { text: "Prince Raj personally asked me to deliver it to Princess Gina, the great love of his life.", options: ["Next"]},
    { text: "But if you are NOT Princess Gina, then I ABSOLUTELY CANNOT give you this letter!", options: ["Next"]},
    { text: "Prince Raj said it's for Princess Gina's eyes only!", options: ["Next"]},
    { text: "It's top-top-top-secret!\n\nNot even I can read it!", options: ["Next"]},
    { text: "How can I be sure that you are indeed Princess Gina,\ntrue love and LOML of Prince Raj?", options: ["Next"]},
    { animation: "first heart animation" },
    { text: "What's this?\n\nA mystical heart falling from the sky, incrementing the number in the top left corner??", options: ["Next"]},
    { text: "Can it be, that you LOVE Raj?", options: ["Yes!"]},
    { text: "Hmm... Princess Gina is, according to all the prophecies, the one true love of Prince Raj.", options: ["Next"]},
    { text: "So this magically appearing heart makes a pretty good case that you are, indeed, Princess Gina.", options: ["Next"]},
    { text: "Still, one can never be too careful...", options: ["Next"]},
    { text: "Ah! I know what to do!", options: ["Next"]},
    { text: "All the legends say that Raj and Gina not only love each other...", options: ["Next"]},
    { text: "but they love each other 10!!", options: ["Next"]},
    { text: "They also say that Princess Gina is the universe's greatest puzzler!", options: ["Next"]},
    { text: "Why don't I give you a puzzle that will prove once and for all whether you love Raj 10?", options: ["Sure!"]},
    { animation: "minigames" },
    { animation: "second heart animation" },
    { text: "Wow -- you really are Princess Gina, the legendary puzzle master! It is an honor to meet you.", options: ["Next"]},
    { text: "Now that you, and the 9 hearts that just fell from the heavens, have verified your identity as Prince Raj's one and only LOML,\n\nI am dutybound to share with you the top-top-top-secret letter Raj wrote for you.", options: ["Yay!"]},
    { text: "Let me know if he says anything about me!", options: ["Okay!"]},
    { animation: "letter" },
    { text: "Yay!!!!!"} // if time: falling hearts animation
  ];

  numDialogue = this.DIALOGUE.length;

  optionsGroup!: Phaser.GameObjects.Group;

  gameButtonsGroup!: Phaser.GameObjects.Group;
  
  currentDialogueIndex = 0;
  dialogueX = 0;
  dialogueY = 0;

  NUM_STARS = 30;
  PARCHMENT_COLOR = 0xFCF5E5;

  dialogueBox!: Phaser.GameObjects.Sprite;
  dialogueText!: Phaser.GameObjects.Text;

  stars!: Phaser.GameObjects.Sprite[];
  
  heartCounter!: Phaser.GameObjects.Sprite;
  heartCount!: number;
  heartCountText!: Phaser.GameObjects.Text;
  
  fallingHeart!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  wizard!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  princess!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  platforms!: Phaser.Physics.Arcade.StaticGroup;

  frame = 0;
  wizardFrame = 9;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {

    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('dialogueBox', 'assets/black-dialog.png');
    this.load.image('buttonGreen', 'assets/black-button-off.png');
    this.load.image('buttonOrange', 'assets/black-button-on.png');
    this.load.image('heartCounter', 'assets/small_heart.png');
    this.load.spritesheet('wizard',
        'assets/wizard_idle.png',
        { frameWidth: 163, frameHeight: 185 }
    );
    this.load.spritesheet('princess',
        'assets/princess.png',
        { frameWidth: 127, frameHeight: 185 }
    );
    this.load.spritesheet('heart', 'assets/heart.png', { frameWidth: 48, frameHeight: 48 });
  }


  create() {

    // Calculate the screen width
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Calculate the horizontal midpoint
    const horizontalMidpoint = screenWidth / 2;
    const verticalMidpoint = screenHeight / 2;

    // Calculate the x-coordinate for the wizard sprite
    const wizardX = horizontalMidpoint - (screenWidth / 4); // x/4 pixels to the left

    // Calculate the x-coordinate for the princess sprite
    const princessX = horizontalMidpoint + (screenWidth / 4); // x/4 pixels to the right

    // const yVal = verticalMidpoint + (screenHeight / 4);
    const yVal = screenHeight - (185/2) - 15;

    // Create an array to store star sprites
    this.stars = [];

    // Generate initial stars
    for (let i = 0; i < this.NUM_STARS; i++) {
        this.generateStar();
    }

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(1000, screenHeight + 30, 'ground').setScale(5).refreshBody();

    // Position the wizard sprite
    this.wizard = this.physics.add.sprite(wizardX, yVal, 'wizard', this.wizardFrame);

    // Position the princess sprite
    this.princess = this.physics.add.sprite(princessX, yVal, 'princess');
    this.princess.body.setGravity(0, 0);

    this.physics.add.collider(this.princess, this.platforms);

      // Create heart count text
    this.heartCountText = this.add.text(50, 15, 'x0', {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#ffffff'
    });

    // Set initial heart count
    this.heartCount = 0;
    this.updateHeartCountText();

    // Create heart sprite
    this.heartCounter = this.add.sprite(
        this.heartCountText.x - 16, // Adjust the x position based on the text position and size
        this.heartCountText.y + 16, // Align with the text vertically
        'heartCounter'
    );
    this.heartCounter.displayWidth = 32;
    this.heartCounter.displayHeight = 32;


    // Draw dialogue box
    this.dialogueX = this.cameras.main.centerX;
    this.dialogueY = this.cameras.main.centerY;
    // this.drawDialogueBox("Welcome, traveler!\n\nI am the famed wizard\nSaj I. Tarius.\n\nWelcome to my wizardly world!");
    this.displayDialogue();

    // Create the heart sprite at the starting position
    this.fallingHeart = this.physics.add.sprite(this.princess.x, -20, 'heart');
    this.fallingHeart.displayWidth = 48;
    this.fallingHeart.displayHeight = 48;

    // Create game buttons group
    this.gameButtonsGroup = this.add.group();

    // Initially hide the game buttons group
    this.gameButtonsGroup.setVisible(false);

  }
  
  override update() {
    this.frame += 1;
    // if (wizardSpeaking) {}
    if (this.frame % 30 == 0) {
      // console.log("yo");
      if (this.wizardFrame == 9) this.wizardFrame = 10;
      else this.wizardFrame = 9;
      this.wizard = this.physics.add.sprite(this.wizard.x, this.wizard.y, 'wizard', this.wizardFrame);
      this.frame = 0;
    }

    // Move stars downward and to the right, and check for regeneration
    this.stars.forEach(star => {
      star.x += 0.5; // Adjust the horizontal movement of stars (to the right)
      star.y += 0.5; // Adjust the vertical movement of stars (downwards)

      // Check if star reaches the bottom of the screen
      if (star.y > this.sys.game.canvas.height) {
          // Reposition star to the top of the screen
          star.y = -star.height;

          // Randomize star position horizontally
          star.x = Phaser.Math.Between(0, this.sys.game.canvas.width);
      }

      // Check if star goes off-screen to the right
      if (star.x > this.sys.game.canvas.width) {
          // Reposition star to the left side of the screen
          star.x = 0 - star.width;
      }
    });

  }

  generateStar() {
    // Create a new star sprite at a random position at the top of the screen
    const star = this.add.sprite(
        Phaser.Math.Between(-100, this.sys.game.canvas.width - 100),
        Phaser.Math.Between(0, -1000), // Start above the top of the screen. Spread them out vertically
        'star'
    );

    // Set the display size of the star sprite
    star.displayWidth = 24;
    star.displayHeight = 22;

    // Add the star to the stars array
    this.stars.push(star);
  }

  updateHeartCountText() {
    // Update heart count text
    this.heartCountText.setText('x' + this.heartCount);
  }

  drawDialogueBox(text: string, x: number = this.dialogueX, y: number = this.dialogueY, width: number = 300, height: number = 163, color: number = this.PARCHMENT_COLOR) {
      // Create the dialogue box sprite
      this.dialogueBox = this.add.sprite(x, y, 'dialogueBox');
      this.dialogueBox.displayWidth = width;
      this.dialogueBox.displayHeight = height;

      this.dialogueText = this.add.text(x, y, text, {
        fontFamily: 'Courier New',
        fontSize: '16px', // Increase the font size to 24px
        color: '#ffe27d',
        fontStyle: 'bold', // Set font weight to bold
        align: 'center',
        wordWrap: { width: width - 20, useAdvancedWrap: true } // Wrap the text
      }).setOrigin(0.5, 0); // Set origin to center horizontally and vertically

    // Adjust the text position to fit within the dialogue box
    this.dialogueText.setPosition(x, y - this.dialogueText.displayHeight / 2);
  }

  clearDialogue() {
    this.dialogueBox.destroy();
    this.dialogueText.destroy();
  }

  public progressDialogue() {
    console.log("inside progressDialogue()");
    this.clearDialogue()
    this.clearOptions();
    // Progress to the next dialogue
    this.currentDialogueIndex++;
  
    // Check if there are more dialogues
    if (this.currentDialogueIndex < this.numDialogue) {
        // Display the next dialogue
        this.displayDialogue();
    } else {
        this.clearDialogue()
        this.clearOptions();
        console.log("End of dialogues.");
    }
  }
  

  displayDialogue() {
    console.log("inside displayDialogue");
    const currentDialogue = this.DIALOGUE[this.currentDialogueIndex];
    console.log(currentDialogue);

    if (currentDialogue.text) {
        // Display dialogue text
        this.drawDialogueBox(currentDialogue.text);
    } else {
      this.clearDialogue();
    }

    if (currentDialogue.options) {
        // Display dialogue options as buttons
        this.displayOptions(currentDialogue.options);
    } else {
      this.clearOptions();
    }

    if (currentDialogue.animation) {
      this.clearDialogue();
      this.clearOptions();
        if (currentDialogue.animation === "first heart animation") {
          this.fallingHeartAnimation();
        } else if (currentDialogue.animation === "minigames") {
          // this.transitionToGamesList()
          this.goToScene('PuzzleScene'); // restore after testing
          // this.progressDialogue(); // remove after testing
        } else if (currentDialogue.animation === "second heart animation") {
          this.secondHeartAnimation();
        } else if (currentDialogue.animation === "letter") {
          // this.letterAnimation();
          this.goToScene('LetterScene');
        }

    }
  }

  // Modify displayOptions function to use options group
  displayOptions(options: string[]) {
    // Clear existing options
    this.clearOptions();

    // Create a new options group
    this.optionsGroup = this.add.group();

    // Create sprites for each option and add them to the options group
    options.forEach((option, index) => {
        const button = this.add.sprite(
            /* Specify position and size for each button */
            this.dialogueX,  // Example x position
            this.dialogueY + 110 + index * 50, // Example y position (adjust as needed)
            'buttonGreen' // Use the 'buttonGreen' alias
        ).setInteractive();
        button.scale = 0.7;

        // Add text to the button
        const buttonText = this.add.text(
            button.x, // Use button's x position
            button.y, // Use button's y position
            option, // Option text
            { fontFamily: 'Courier New', fontSize: '16px', fontStyle: 'bold', color: "#ffe27d" }
        ).setOrigin(0.5);

        // Add the button and text to the options group
        this.optionsGroup.addMultiple([button, buttonText]);

        // Handle button click event
        button.on('pointerdown', () => {
            // Handle button click event, e.g., progress dialogue
            this.progressDialogue();
        });
    });
  }

  // Modify clearOptions function to clear options group
  clearOptions() {
    if (this.optionsGroup) {
        // Destroy the options group and its children
        this.optionsGroup.clear(true, true);
    }
  }

  fallingHeartAnimation() {

    // Enable physics for the heart sprite
    this.physics.world.enable(this.fallingHeart);

    // Set up collision detection with the princess
    this.physics.add.collider(this.fallingHeart, this.princess, () => {
        // Increment the heart counter
        this.heartCount++;
        // this.scene.scene.setData('heartCount', this.heartCount);
        this.updateHeartCountText();

        // Remove the heart sprite
        this.fallingHeart.destroy();

        // Perform a small jump animation for the princess
        const jumpDistance = 50;
        const jumpDuration = 200; // Duration of each phase of the jump animation

        // Calculate the target y-coordinate for the princess
        const targetY = Math.max(this.princess.y - jumpDistance, 0); // Ensure princess stays within the screen bounds

        // Move the princess sprite up
        this.tweens.add({
            targets: this.princess,
            y: targetY,
            duration: jumpDuration,
            ease: 'Linear',
            onComplete: () => {
                // After the jump animation, move the princess sprite back down to her original position
                this.tweens.add({
                    targets: this.princess,
                    y: this.princess.y + jumpDistance,
                    duration: jumpDuration,
                    ease: 'Linear'
                });
                this.progressDialogue();
            }
        });
    });

    // Set the velocity for the heart sprite to make it fall
    this.fallingHeart.setVelocityY(500); // Adjust the falling speed as needed
  }

  secondHeartAnimation() {
    const numHearts = 9;
    const hearts: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];

    let originalPrincessY = this.princess.y;

    // Create an array to store the falling heart sprites
    for (let i = 0; i < numHearts; i++) {
        // Create a new falling heart sprite
        const fallingHeart = this.physics.add.sprite(this.princess.x, -20, 'heart');
        fallingHeart.displayWidth = 48;
        fallingHeart.displayHeight = 48;

        // Set the x-position of each heart to be evenly spaced
        fallingHeart.y -= i * 50; // Adjust the spacing as needed

        // Set the velocity for the heart sprite to make it fall
        fallingHeart.setVelocityY(500); // Adjust the falling speed as needed

        // Enable collision detection with the princess
        this.physics.add.collider(fallingHeart, this.princess, () => {
            // Increment the heart counter
            this.heartCount++;
            this.updateHeartCountText();

            // Remove the heart sprite
            fallingHeart.destroy();

            // Perform a small jump animation for the princess
            const jumpDistance = 50;
            const jumpDuration = 200; // Duration of each phase of the jump animation

            // Calculate the target y-coordinate for the princess
            const targetY = Math.max(this.princess.y - jumpDistance, 0); // Ensure princess stays within the screen bounds

            // Move the princess sprite up
            this.tweens.add({
                targets: this.princess,
                y: targetY,
                duration: jumpDuration,
                ease: 'Linear',
                onComplete: () => {
                    // After the jump animation, move the princess sprite back down to her original position
                    this.tweens.add({
                        targets: this.princess,
                        y: originalPrincessY, // this.princess.y + (jumpDistance * 1),
                        duration: jumpDuration,
                        ease: 'Linear',
                        onComplete: () => {
                            // Progress the dialogue after the princess has returned to her original position
                            console.log("yo 1");
                            if (i == numHearts - 1) {
                              console.log("yo 2");
                              this.progressDialogue();
                            }
                        }
                    });
                }
            });

            // Progress the dialogue if all hearts have fallen
            if (hearts.every(heart => heart === undefined)) {
                this.progressDialogue();
            }
        });

        // Add the heart sprite to the hearts array
        hearts.push(fallingHeart);
    }
}

  // Function to transition to the games list and show game buttons
  transitionToGamesList() {
    // Show the game buttons group
    this.gameButtonsGroup.setVisible(true);

    // Add game buttons
    const games = ['Puzzle', 'Trivia'];
    const buttonSpacing = 80; // Adjust as needed

    games.forEach((game, index) => {
      const button = this.add.sprite(
        this.dialogueX,
        this.dialogueY - 100 + (index * buttonSpacing),
        'buttonGreen'
      ).setInteractive();

      // Double the scale of the button
      button.setScale(1.25);

      // Add text to the button
      const buttonText = this.add.text(
        button.x,
        button.y,
        game,
        { fontFamily: 'Courier New', fontSize: '16px', fontStyle: 'bold', color: "#ffe27d" }
      ).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.goToScene(game + 'Scene');
      });

      // Add button and text to the game buttons group
      this.gameButtonsGroup.addMultiple([button, buttonText]);
    });
  }

  goToScene(sceneKey: string) {
    this.scene.pause('MainScene');
    this.scene.setVisible(false, 'MainScene')
    this.scene.run(sceneKey);
  }

  letterAnimation() {

  }

}

