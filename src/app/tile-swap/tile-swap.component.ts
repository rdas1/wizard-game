import { Component } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from '../start/start.component';

@Component({
  selector: 'app-tile-swap',
  standalone: true,
  imports: [],
  templateUrl: './tile-swap.component.html',
  styleUrl: './tile-swap.component.css'
})
export class TileSwapComponent {

}

export class PuzzleScene extends Phaser.Scene {
  private tiles: Tile[] = []; // Changed type to Tile[]
  private selectedTile: Tile | null = null; // Changed type to Tile
  private highlightBox!: Phaser.GameObjects.Graphics;

  IMAGE_WIDTH = 390;
  IMAGE_HEIGHT = 520;

  gridSize: Phaser.Math.Vector2 = new Phaser.Math.Vector2(3, 4);

  tileWidth = this.IMAGE_WIDTH / 3;
  tileHeight = this.IMAGE_HEIGHT / 4;

  SOLUTION_BOARD: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(function() {
    return 0.5 - Math.random();
  });
  

  constructor() {
    super('PuzzleScene');
  }

  preload() {
    this.load.spritesheet('tiles', 'assets/image.jpg', {
      frameWidth: this.IMAGE_WIDTH / 3,
      frameHeight: this.IMAGE_HEIGHT / 4
    });
  }

  create() {
    this.createTiles();
    // this.shuffleTiles();

    // Create a red highlight box
    this.highlightBox = this.add.graphics();
    this.highlightBox.lineStyle(2, 0xFF0000);
    this.highlightBox.strokeRect(0, 0, this.tileWidth, this.tileHeight);
    this.highlightBox.visible = false; // Initially hidden
  }
  createTiles() {

    // Create tiles and assign shuffled gameBoardIndex
    for (let i = 0; i < this.gridSize.y; i++) {
      for (let j = 0; j < this.gridSize.x; j++) {
        const tileIndex = i * this.gridSize.x + j; // index in the tiles array; i.e., gameBoardIndex. 1, 2, 3, 4...
        const solutionBoardIndex = this.SOLUTION_BOARD[tileIndex]; // corresponding tile in solutionBoard
        let tileSprite = this.add.sprite(j * this.tileWidth, i * this.tileHeight, 'tiles', solutionBoardIndex);
        tileSprite.setOrigin(0);
        tileSprite.setInteractive();
        tileSprite.on('pointerdown', () => this.onTileClicked(tile));
        const tile = new Tile(tileSprite, solutionBoardIndex, tileIndex); // Create Tile object
        this.tiles.push(tile);
      }
    }
  
    console.log(this.tiles.map(tile => `${tile.gameBoardIndex}, ${tile.solutionBoardIndex}`));

  }
  
  onTileClicked(tile: Tile) {
    console.log(tile);
    if (this.selectedTile === tile) {
      // Toggle highlight off if the same tile is tapped again
      this.highlightBox.visible = false;
      this.selectedTile = null;
    } else if (!this.selectedTile) {
      // First tile selection
      this.selectedTile = tile;
      this.highlightBox.visible = true;
      this.highlightBox.setPosition(tile.sprite.x, tile.sprite.y);
    } else {
      // Second tile selection, swap tiles
      const index1 = this.tiles.indexOf(this.selectedTile);
      const index2 = this.tiles.indexOf(tile);

      // Swap tiles in array
      [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];

      // Swap gameBoardIndex properties of tiles
      const tempIndex = this.selectedTile.gameBoardIndex;
      this.selectedTile.gameBoardIndex = tile.gameBoardIndex;
      console.log(tile.gameBoardIndex, tile.solutionBoardIndex);
      tile.gameBoardIndex = tempIndex;
      console.log(tile.gameBoardIndex, tile.solutionBoardIndex);

      // Swap tiles visually
      const tempX = this.selectedTile.sprite.x;
      const tempY = this.selectedTile.sprite.y;
      this.selectedTile.sprite.setPosition(tile.sprite.x, tile.sprite.y);
      tile.sprite.setPosition(tempX, tempY);

      this.highlightBox.visible = false; // Hide highlight box
      this.selectedTile = null; // Reset selected tile

      // Check if puzzle is solved
      if (this.isPuzzleSolved()) {
        console.log('Congratulations! You solved the puzzle.');
        this.showCongratulationsMessage(); // Show congratulations message
      }
    }
  }

  showCongratulationsMessage() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Display congratulations message
    this.add.text(centerX, centerY + 150, 'Congratulations, Gina!', {
      fontFamily: 'Courier New',
      fontSize: '24px',
      color: '#ffe27d',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.cameras.main.width - 20, useAdvancedWrap: true }
    }).setOrigin(0.5);

    // Display Next button
    const nextButton = this.add.image(centerX, centerY + 250, 'buttonGreen');
    nextButton.setInteractive();
    nextButton.on('pointerdown', () => {
      // Return to MainScene
      this.scene.pause();
      this.scene.setVisible(false, 'PuzzleScene');
      this.scene.setVisible(true, 'MainScene');
      this.scene.resume('MainScene');
      let mainScene = this.scene.get('MainScene') as MainScene;
      mainScene.progressDialogue();
    });

    // Add text to the button
    const buttonText = this.add.text(
      nextButton.x, // Use button's x position
      nextButton.y, // Use button's y position
      "Next", // Option text
      { fontFamily: 'Courier New', fontSize: '16px', fontStyle: 'bold', color: "#ffe27d" }
  ).setOrigin(0.5);

  }

  isPuzzleSolved(): boolean {
    console.log(this.tiles.map(tile => `${tile.gameBoardIndex}, ${tile.solutionBoardIndex}`));
    if (this.tiles.every((tile) => tile.gameBoardIndex === tile.solutionBoardIndex)) {
      return true;
    }
    return false;
  }
}

// Custom Tile class
class Tile {
  constructor(public sprite: Phaser.GameObjects.Sprite, public solutionBoardIndex: number, public gameBoardIndex: number) {}
}
