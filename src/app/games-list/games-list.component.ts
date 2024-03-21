import { Component } from '@angular/core';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.css'
})
export class GamesListComponent {

}

export class GamesListScene extends Phaser.Scene {

  constructor() {
    super({ key: 'gamesList' });
  }

}
