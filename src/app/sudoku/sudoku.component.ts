import { Component } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.css'
})
export class SudokuComponent {

}

export class SudokuScene extends Phaser.Scene {  

  constructor() {
      super({ key: 'SudokuScene' });
  }

  preload() {
      this.load.image("emptytile", "assets/sprites/emptytile.png");
      this.load.image("line", "assets/sprites/line.png");
      this.load.image("retry", "assets/sprites/retry.png");
      this.load.image("menu", "assets/sprites/menu.png");
      // Load additional images here if needed
  }

  create() {
      // Add your game-related logic here
      this.scene.start("PlayGame");
  }
}

class PlayGame extends Phaser.Scene {

  tileArray: any[] = [];
  timeText!: Phaser.GameObjects.Text;
  gameTimer!: Phaser.Time.TimerEvent;
  myTime!: number;
  startTimer!: number;
  level!: string;
  randomOrder: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  levelList: string[] = [];
  sudokuMap!: any;
  goToMenu!: boolean;
  reset!: boolean;
  startGame: boolean = false;
  stopTimer: boolean = false;
  stopMinutes!: number;
  stopSeconds!: number;
  levelIndex: number = 0;
  displayDialog: boolean = false;
  nextGame: boolean = false;


  gameOptions = {
    tileSize: 288,
    tileSpacing: 20,
    boardSize: {rows: 9, cols: 9},
    tweenSpeed: 50,
    aspectRatio: 16 / 9
  };

  constructor() {
      super({ key: "PlayGame" });
  }

  create() {
    // Set up background, time box, and game counter
    let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "background");
    background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.add.image(this.cameras.main.width / 5, this.cameras.main.height / 22, "time");
    this.add.image(this.cameras.main.width / 2 + (this.cameras.main.width / 2.8), this.cameras.main.height - (this.cameras.main.height / 26), "counter");
    this.add.text(this.cameras.main.width / 2 + (this.cameras.main.width / 3.8), this.cameras.main.height - (this.cameras.main.height / 20), (levelIndex + 1) + "/" + levelList.length, { fontSize: '100px', fill: "#fff" });

    // Initialize timer values
    this.myTime = 0;
    this.startTimer = 0;
    this.timeText = this.add.text(this.cameras.main.width / 9, this.cameras.main.height / 28, "_", { fontSize: '100px', fill: '#fff' });
    this.gameTimer = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

    this.addTilesToScreen();
    this.addLinesToScreen();

    // Set up the retry button
    let retry = this.add.sprite(this.cameras.main.width / 2 + (this.cameras.main.width / 2.5), 600, 'retry').setInteractive();
    retry.on("pointerdown", () => {
        retry.setTint(0xff0000);
    });

    retry.on('pointerout', () => {
        retry.clearTint();
    });

    retry.on('pointerup', () => {
        retry.clearTint();
        this.myTime = 0;
        this.startTimer = 0;
        this.reset = true;
    });
}

  onEvent() {
      if (this.startTimer === 1) {
          this.myTime++;
      }
  }

  addTilesToScreen() {
      let map = this.createMap(sudokuMap[levelList[levelIndex]].map);
      let visibleMap = this.createVisibleTiles(sudokuMap[levelList[levelIndex]].visible);

      for (let i = 0; i < this.gameOptions.boardSize.rows; i++) {
          this.tileArray[i] = [];
          for (let j = 0; j < this.gameOptions.boardSize.cols; j++) {
              let tilePosition = this.getTilePosition(i, j);
              this.add.image(tilePosition.x, tilePosition.y, "emptytile");
              let tile = this.add.image(tilePosition.x, tilePosition.y, map[i][j].toString());
              tile.visible = visibleMap[i][j];
              this.tileArray[i][j] = {
                  tileValue: map[i][j],
                  tileSprite: tile
              }
          }
      }
      this.showMovableNumbers();
  }

  getTilePosition(row, col) {
      let posX = this.gameOptions.tileSpacing * (col + 1) + this.gameOptions.tileSize * (col + 0.5);
      let posY = this.gameOptions.tileSpacing * (row + 1) + this.gameOptions.tileSize * (row + 0.5);
      let boardHeight = this.gameOptions.boardSize.rows * this.gameOptions.tileSize;
      boardHeight += (this.gameOptions.boardSize.rows + 1) * this.gameOptions.tileSpacing;
      posY += (this.cameras.main.height - boardHeight) / 2;
      return new Phaser.Geom.Point(posX, posY);
  }

  addLinesToScreen() {
      // Vertical lines
      let pos = this.getTilePosition(4, 0);
      this.add.image(pos.x - this.gameOptions.tileSize + (this.gameOptions.tileSize / 2), pos.y, "line").setScale(1, 9.6);
      pos = this.getTilePosition(4, 2);
      this.add.image(pos.x + (this.gameOptions.tileSize / 2) + (this.gameOptions.tileSpacing / 2), pos.y, "line").setScale(1, 9.6);
      pos = this.getTilePosition(4, 5);
      this.add.image(pos.x + (this.gameOptions.tileSize / 2) + (this.gameOptions.tileSpacing / 2), pos.y, "line").setScale(1, 9.6);
      pos = this.getTilePosition(4, 8);
      this.add.image(pos.x + (this.gameOptions.tileSize / 2), pos.y, "line").setScale(1, 9.6);

      // Horizontal lines
      pos = this.getTilePosition(0, 4);
      this.add.image(pos.x, pos.y - this.gameOptions.tileSize - this.gameOptions.tileSpacing + (this.gameOptions.tileSize / 2) + (this.gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
      pos = this.getTilePosition(2, 4);
      this.add.image(pos.x, pos.y + (this.gameOptions.tileSize / 2) + (this.gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
      pos = this.getTilePosition(5, 4);
      this.add.image(pos.x, pos.y + (this.gameOptions.tileSize / 2) + (this.gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
      pos = this.getTilePosition(8, 4);
      this.add.image(pos.x, pos.y + (this.gameOptions.tileSize / 2) + (this.gameOptions.tileSpacing / 2), "line").setScale(1, 9.6).setAngle(90);
  }

  createMap(values) {
      var arr = [];
      var index = -1;
      for (var i = 0; i < values.length; i++) {
          if (i % this.gameOptions.boardSize.cols === 0) {
              index++;
              arr[index] = [];
          }
          arr[index].push(values[i]);
      }
      return arr;
  }

    createVisibleTiles(values) {
      let arr = [];
      let index = -1;
      for (let i = 0; i < values.length; i++) {
          if (i % this.gameOptions.boardSize.cols === 0) {
              index++;
              arr[index] = [];
          }
          if (values[i] === 1) {
              arr[index].push(true);
          } else {
              arr[index].push(false);
          }
      }
      return arr;
  }

    getPosition(x: number, y:number) {
    for (let i = 0; i < this.gameOptions.boardSize.rows; i++) {
        for (let j = 0; j < this.gameOptions.boardSize.cols; j++) {
            let pos = this.getTilePosition(i, j);
            if (x >= pos.x - (this.gameOptions.tileSize / 2) &&
                x <= pos.x + (this.gameOptions.tileSize / 2) &&
                y >= pos.y - (this.gameOptions.tileSize / 2) &&
                y <= pos.y + (this.gameOptions.tileSize / 2)) {
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

showMovableNumbers(){
  let numberList = [];

  //dynamically decide where the movable tiles will be placed
  let pos = playGame.getTilePosition(gameOptions.boardSize.cols, gameOptions.boardSize.rows);
  let freeSpace = game.config.height - (pos.y + (gameOptions.tileSize / 2) + gameOptions.tileSpacing);
  let posY = pos.y + (freeSpace / 2);

  //add empty tile images
  for(let i = 0; i < gameOptions.boardSize.cols; i++){
      pos = playGame.getTilePosition(0, i);
      this.add.image(pos.x, posY, "emptytile");
      numberList[i] = [pos.x, posY];
  }

  //create a group consisting of tiles from 1 to 9 which are draggable. Place them in a row on top of
  //the empty tiles
  this.items = this.add.group([
      {
        key: "1",
        setXY: {
            x: numberList[0][0], y: numberList[0][1]
        }
      },
      {
        key: "2",
        setXY: {
            x: numberList[1][0], y: numberList[1][1]
        }
      },
      {
          key: "3",
          setXY: {
              x: numberList[2][0], y: numberList[2][1]
          }
      },
      {
          key: "4",
          setXY: {
              x: numberList[3][0], y: numberList[3][1]
          }
      },
      {
          key: "5",
          setXY: {
              x: numberList[4][0], y: numberList[4][1]
          }
      },
      {
          key: "6",
          setXY: {
              x: numberList[5][0], y: numberList[5][1]
          }
      },
      {
          key: "7",
          setXY: {
              x: numberList[6][0], y: numberList[6][1]
          }
      },
      {
          key: "8",
          setXY: {
              x: numberList[7][0], y: numberList[7][1]
          }
      },
      {
          key: "9",
          setXY: {
              x: numberList[8][0], y: numberList[8][1]
          }
      }
  ]);

  this.items.setDepth(1); //set the group to be drawn over the other images in the game

  //make the group interactive and able to be dragged by the player.
  Phaser.Actions.Call(this.items.getChildren(), function(item){
      item.setInteractive();
      this.input.setDraggable(item);

      item.on('dragstart', function (pointer) {
          item.setTint(0xff0000);

          //start incrementing timer once player has moved the first tile
          if(startTimer === 0) {
              startTimer = 1;
          }
      });

      //set the dragged tile to be the same position as the mouse pointer
      item.on('drag', function (pointer, dragX, dragY) {
          item.x = dragX;
          item.y = dragY;
      });

      //If the tile is placed in the correct position then the hidden tile is revealed
      //This dragged tile goes back to original position.
      item.on('dragend', function (pointer) {
          item.clearTint();
          var withinBounds = playGame.getPosition(item.x, item.y);
          if(withinBounds[0] !== -1 && withinBounds[1] !== -1){
              if(tileArray[withinBounds[0]][withinBounds[1]].tileValue === parseInt(item.texture.key, 10)){
                  tileArray[withinBounds[0]][withinBounds[1]].tileSprite.visible = true;
              }
          }
          item.x = numberList[parseInt(item.texture.key, 10) - 1][0];
          item.y = numberList[parseInt(item.texture.key, 10) - 1][1];
          if(playGame.hasWon()){
              stopTimer = true;
              let completedTime = myTime;
              stopMinutes = Math.floor(completedTime / 60);

              if (completedTime > 59) {
                  stopSeconds = completedTime % 60;
              } else {
                  stopSeconds = completedTime;
              }
              displayDialog = true;
          }
      });
  }, this);
}


}