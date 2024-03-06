import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

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
      scene: [ MainScene ],
      scale: {
        mode: Phaser.Scale.RESIZE, // Use the RESIZE scale mode for responsiveness
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          // debug: true
        }
      }
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

}

class MainScene extends Phaser.Scene {

  NUM_STARS = 18;
  PARCHMENT_COLOR = 0xFCF5E5;

  stars!: Phaser.GameObjects.Sprite[];
  
  heartCounter!: Phaser.GameObjects.Sprite;
  heartCount!: number;
  heartCountText!: Phaser.GameObjects.Text;

  wizard!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  princess!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  platforms!: Phaser.Physics.Arcade.StaticGroup;

  frame = 0;
  wizardFrame = 9;

  constructor() {
    super({ key: 'main' });
  }

  // init(params: any): void {
  //   // TODO
  // }

  preload() {

    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('scroll', 'assets/scroll.png');
    this.load.image('heartCounter', 'assets/small_heart.png');
    this.load.spritesheet('wizard',
        'assets/wizard_idle.png',
        { frameWidth: 163, frameHeight: 185 }
    );
    this.load.spritesheet('princess',
        'assets/princess.png',
        { frameWidth: 127, frameHeight: 185 }
    );
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
    this.drawDialogueBox(this.cameras.main.centerX, this.cameras.main.centerY, 300, 163, this.PARCHMENT_COLOR, "Welcome, traveler!\n\nI am the famed wizard\nSaj I. Tarius.\n\nWelcome to my wizardly world!");

  }
  
  override update() {
    this.frame += 1;
    // if (wizardSpeaking) {}
    if (this.frame % 30 == 0) {
      // console.log("yo");
      if (this.wizardFrame == 9) this.wizardFrame = 10;
      else this.wizardFrame = 9;
      this.wizard = this.physics.add.sprite((this.cameras.main.width / 2) - (this.cameras.main.width / 4), (this.cameras.main.height - (185/2) - 15), 'wizard', this.wizardFrame);
      this.frame = 0;
    }

    // Move stars downward and check for regeneration
    this.stars.forEach(star => {
      star.y += 1; // Adjust the speed of falling stars as needed

      // Check if star reaches the bottom of the screen
      if (star.y > this.sys.game.canvas.height) {
          // Reposition star to the top of the screen
          star.y = -star.height;

          // Randomize star position
          star.x = Phaser.Math.Between(0, this.sys.game.canvas.width);
      }
    });

  }

  generateStar() {
    // Create a new star sprite at a random position at the top of the screen
    const star = this.add.sprite(
        Phaser.Math.Between(0, this.sys.game.canvas.width),
        Phaser.Math.Between(0, -1000), // Start above the top of the screen
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

drawDialogueBox(x: number, y: number, width: number, height: number, color: number, text: string) {
    // Create the dialogue box sprite
    const dialogueBox = this.add.sprite(x, y, 'scroll');
    dialogueBox.displayWidth = width;
    dialogueBox.displayHeight = height;

    const dialogueText = this.add.text(x, y, text, {
      fontFamily: 'Courier New',
      fontSize: '16px', // Increase the font size to 24px
      color: '#ffe27d',
      fontStyle: 'bold', // Set font weight to bold
      align: 'center',
      wordWrap: { width: width - 20, useAdvancedWrap: true } // Wrap the text
    }).setOrigin(0.5, 0); // Set origin to center horizontally and vertically

  // Adjust the text position to fit within the dialogue box
  dialogueText.setPosition(x, y - dialogueText.displayHeight / 2);
}

createButtons() {
  // Create next and back buttons
  // Implement button creation logic here
}

}
