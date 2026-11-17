/* --------------------------------------------------------------
   Street Racer — Phaser Preloader Scene
   Shows racing flag logo with smooth fade animation
   -------------------------------------------------------------- */
export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {
    // No external assets — everything is procedural
  }

  create() {
    const { width, height } = this.cameras.main;
    const cx = width / 2;
    const cy = height / 2;

    // Outer racing ring
    this.ring = this.add.circle(cx, cy, 35, 0x00f3ff);
    this.ring.setStrokeStyle(3, 0x00f3ff);
    this.ring.setFillStyle(0x00f3ff, 0.05);

    // Racing flag (pole + waving flag)
    this.flagPole = this.add.line(cx - 25, cy - 20, 0, 0, 0, 30, 0x00f3ff);
    this.flagPole.lineWidth = 3;

    this.flag = this.add.triangle(cx - 25, cy - 20, 0, 0, 20, -10, 20, 10, 0x00f3ff);
    this.flag.setStrokeStyle(2, 0x00f3ff);
    this.flag.setFillStyle(0x00f3ff, 0.1);

    // Core glow
    this.core = this.add.circle(cx, cy, 8, 0x00f3ff);
    this.core.setStrokeStyle(2, 0x66fdff);
    this.core.setFillStyle(0x00f3ff, 0.3);

    // Animate: ring spin, flag wave, core pulse
    this.tweens.add({
      targets: this.ring,
      angle: 360,
      duration: 1500,
      repeat: -1,
      ease: 'Linear',
    });

    this.tweens.add({
      targets: this.flag,
      angle: { from: -5, to: 5 },
      duration: 1200,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.core,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 1,
      duration: 800,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });

this.scene.start('PlayScene');
  }
}
