import { MainScene } from "../start/start.component";

export class LetterScene extends Phaser.Scene {
  currentPageIndex: number = 0;
  scrollBackground!: Phaser.GameObjects.Image;
  letterTexts: string[] = [
    "Gina baby,", "Words can’t express what you mean to me; neither can music, paintings, film, dance, sculpture, or any other art form.",
    "This game can’t express what you mean to me either.",
    "But I wanted to build it anyway, because among art forms, I think games come closest to meeting the impossible task of expressing what life with you is like.",
    "In Tomorrow and Tomorrow and Tomorrow (and Tomorrow), one of the central themes is that games allow us to create an infinity of worlds, and live infinitely within them.", "And that’s what life with you is like:", "Infinity.", "The experience of loving you is the experience of the infinite.", "I never knew I could love someone as infinitely as I love you.",
    "I never knew anyone could love me the way you love me.", "I never knew someone could be so infinitely funny, sweet, kind, caring, creative, as you.", "I fell in love with you when you looped your arm through mine on the way to Whole Foods.", "I fell in love with you when we offered each other the booth on our first date.",
    "I fell in love with you the first time I saw you cuddling Johnny Cakes.", "I fell in love with you the first time we talked on the phone.", "I fell in love with you when you pranked me.", "I fell in love with you when we took a bath together.",
    "I fell in love with you when we went to the library together,", "and especially when I read the note you left in the book. ", "I fell in love with you in December,", "and I fell in love with you yesterday,", "and I fell in love with you just now, ", "when you knocked on the door.",
    "I fall in love with you every day, every moment.",
    "You, Gina Gisselle, are the love of my life.",
    "You’re my darling,",
    "my sweetheart,",
    "my LOML,",
    "my alpaca,",
    "my best friend,",
    "my person.",
    "Will you do me the greatest honor of my life, and be my girlfriend?"
];

  totalPages: number = this.letterTexts.length; // Change this to the total number of pages in your letter

  heartCounter!: Phaser.GameObjects.Sprite;
  heartCountText!: Phaser.GameObjects.Text;

  constructor() {
    super('LetterScene');
  }

  preload() {
    this.load.image('scrollBackground', 'assets/scroll_background.png');
    this.load.image('heartCounter', 'assets/small_heart.png');
    // Load other assets here if needed
  }

  create() {
    // Create black background
    this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000
    ).setDepth(0);

    // Create scroll background
    this.scrollBackground = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'scrollBackground'
    ).setDisplaySize(390, 390).setDepth(1);

    // Display text on the scroll
    const letterText = this.add.text(
      this.scrollBackground.x,
      this.scrollBackground.y,
      this.letterTexts[this.currentPageIndex],
      {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#000000',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: this.cameras.main.width - 20, useAdvancedWrap: true }
      }
    ).setOrigin(0.5).setDepth(2);

    // Create buttons
    const prevButton = this.add.text(
      100,
      this.scrollBackground.y + 200,
      'Prev',
      {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#ffe27d',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setInteractive().setDepth(2);

    const nextButton = this.add.text(
      this.cameras.main.width - 100,
      this.scrollBackground.y + 200,
      this.currentPageIndex < this.totalPages - 1 ? 'Next' : 'Yes!',
      {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#ffe27d',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setInteractive().setDepth(2);

    // Add button events
    prevButton.on('pointerdown', () => {
      if (this.currentPageIndex > 0) {
        this.currentPageIndex--;
        letterText.setText(this.letterTexts[this.currentPageIndex]);
        nextButton.setText('Next');
      }
    });

    nextButton.on('pointerdown', () => {
      if (this.currentPageIndex < this.totalPages - 1) {
        this.currentPageIndex++;
        letterText.setText(this.letterTexts[this.currentPageIndex]);
        if (this.currentPageIndex === this.totalPages - 1) {
          nextButton.setText('Yes!');
        }
      } else {
        // Handle "Yes!" button click action
        // For example, you can transition to another scene here
        // Return to MainScene
        this.scene.pause();
        this.scene.setVisible(false, 'LetterScene');
        this.scene.setVisible(true, 'MainScene');
        this.scene.resume('MainScene');
        let mainScene = this.scene.get('MainScene') as MainScene;
        mainScene.progressDialogue();
      }
    });

    // Create heart count text
    this.heartCountText = this.add.text(50, 15, 'x infinity', {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#ffffff'
    });

    // Create heart counter (infinity symbol)
    this.heartCounter = this.add.sprite(
      this.heartCountText.x - 16,
      this.heartCountText.y + 16, // Align with the text vertically
      'heartCounter'
    ).setDepth(2);

    this.heartCounter.displayWidth = 32;
    this.heartCounter.displayHeight = 32;

    // Display infinity symbol
    this.add.text(
      100,
      50,
      '∞',
      {
        fontFamily: 'Courier New',
        fontSize: '24px',
        color: '#ffe27d',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setDepth(2);
  }
}
