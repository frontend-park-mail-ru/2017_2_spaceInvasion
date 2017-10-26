window.GameScene = (function (window) {

  //Scaling
  let scaleCoeff = window.innerHeight/modelHeight;
  const RED = "#F00";
  const BLUE = "#000dd4";
  const BLACK = "black";
  let FONT = "italic 20pt Arial";

	class GameScene {

		constructor(canvas) {

			this.canvas = canvas;
			this.ctx = this.canvas.getContext('2d');

			this.bindedResizer = this.resizer.bind(this);
			window.addEventListener('resize', this.bindedResizer);
			this.resizer();

			// TODO есть ли смысл?
			this.setState({});
			this.render();
		}

    resizer() {

		  // TODO убрать в другое место
      document.body.style.overflow = "hidden";

      scaleCoeff = window.innerHeight/modelHeight;
      this.canvas.height = window.innerHeight;
      this.canvas.width = modelWidth*scaleCoeff;
      FONT = "italic "+20*scaleCoeff + "pt Arial";
    }

		setState(state) {
			this.state = state;
		}

		render() {

			const ctx = this.ctx;

      this.renderBackground(ctx);

      this.renderHalfLine(ctx);

      this.renderBases(ctx);

      this.renderMen(ctx);

      this.renderTowers(ctx);

      this.renderBullets(ctx);

      this.renderText(ctx);

      this.renderBombs(ctx);

      this.renderCoins(ctx);

		}

		renderBackground(ctx){
      const moonSerface = new Image();
      moonSerface.src    = "images/moonBackground.png";
      moonSerface.onload = function() {
        ctx.drawImage(moonSerface,
          0,
          0,
          this.canvas.width,
          this.canvas.height);
      }.bind(this)
    }

		renderBases(ctx){
      if (this.state.opponent){
        ctx.drawImage(this.state.opponent.base.image,
          this.state.opponent.base.x_position*scaleCoeff,
          this.state.opponent.base.y_position*scaleCoeff,
          this.state.opponent.base.width*scaleCoeff,
          this.state.opponent.base.height*scaleCoeff);
      }
      if (this.state.me){
        ctx.drawImage(this.state.me.base.image,
          this.state.me.base.x_position*scaleCoeff,
          this.state.me.base.y_position*scaleCoeff,
          this.state.me.base.width*scaleCoeff,
          this.state.me.base.height*scaleCoeff);
      }
    }

		renderMen(ctx){
      if (this.state.opponent){
        ctx.drawImage(this.state.opponent.unit.image,
          this.state.opponent.unit.x_position*scaleCoeff,
          this.state.opponent.unit.y_position*scaleCoeff,
          this.state.opponent.unit.width*scaleCoeff,
          this.state.opponent.unit.height*scaleCoeff);
      }
      if (this.state.me){
        ctx.drawImage(this.state.me.unit.image,
          this.state.me.unit.x_position*scaleCoeff,
          this.state.me.unit.y_position*scaleCoeff,
          this.state.me.unit.width*scaleCoeff,
          this.state.me.unit.height*scaleCoeff);
      }
    }

		renderTowers(ctx){
      if (this.state.opponent) {
        this.state.opponent.towers.forEach(tower => {
          ctx.drawImage(tower.image,
            tower.x_position * scaleCoeff,
            tower.y_position * scaleCoeff,
            tower.width * scaleCoeff,
            tower.height * scaleCoeff);
          this.renderHealthOfTower(ctx, tower);
        })
      }
        if (this.state.me){
          this.state.me.towers.forEach(tower=>{
            ctx.drawImage(tower.image,
              tower.x_position*scaleCoeff,
              tower.y_position*scaleCoeff,
              tower.width*scaleCoeff,
              tower.height*scaleCoeff);
            this.renderHealthOfTower(ctx, tower);
          })
      }
    }

		renderBullets (ctx) {
      if (this.state.bullets) {
        this.state.bullets.forEach(blt => {
          ctx.drawImage(blt.image,
            blt.x_position*scaleCoeff,
            blt.y_position*scaleCoeff,
            blt.width*scaleCoeff,
            blt.height*scaleCoeff);
        });
      }
    }

    renderText(ctx){
		  // TODO масштабирование текста
      // TODO убрать захардкоженые координаты
      ctx.font = FONT;
      if (this.state.opponent) {
          ctx.shadowColor = RED;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          ctx.shadowBlur = 5;
          ctx.strokeText(this.state.opponent.name, 10*scaleCoeff, 40*scaleCoeff);
          ctx.strokeText("Base bombs: " + +(this.state.opponent.base.health), 10*scaleCoeff, 80*scaleCoeff);
          ctx.strokeText("Sprite health: " + +(this.state.opponent.unit.health), 10*scaleCoeff, 120*scaleCoeff);
          if (this.state.opponent.bomb){
            ctx.strokeText("Bomb in: " + Math.ceil((this.state.opponent.bomb.coolDown)/20), 400*scaleCoeff, 40*scaleCoeff);

          }
      }
      if (this.state.me) {
        ctx.shadowColor = BLUE;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 5;
        ctx.strokeText(this.state.me.name, 700*scaleCoeff, 40*scaleCoeff);
        ctx.strokeText("Base bombs: " + +(this.state.me.base.health), 700*scaleCoeff, 80*scaleCoeff);
        ctx.strokeText("Sprite health: " + +(this.state.me.unit.health), 700*scaleCoeff, 120*scaleCoeff);
        ctx.strokeText("Coins: " + this.state.me.coins,700*scaleCoeff,160*scaleCoeff);
      }
      ctx.shadowColor = "";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }

    renderBombs(ctx){
      if (this.state.opponent && this.state.opponent.bomb){
        ctx.drawImage(this.state.opponent.bomb.image,
          this.state.opponent.bomb.x_position*scaleCoeff,
          this.state.opponent.bomb.y_position*scaleCoeff,
          this.state.opponent.bomb.width*scaleCoeff,
          this.state.opponent.bomb.height*scaleCoeff);
      }
        // TODO моя бомба
    }

    renderCoins(ctx){
      if (this.state && this.state.coins){
        this.state.coins.forEach(coin => {
          ctx.drawImage(coin.image,
            coin.x_position*scaleCoeff,
            coin.y_position*scaleCoeff,
            coin.width*scaleCoeff,
            coin.height*scaleCoeff);
        });
      }
    }

    renderHealthOfTower(ctx, tower){
      ctx.strokeStyle = RED;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(tower.x_position*scaleCoeff, tower.y_position*scaleCoeff);
      ctx.lineTo((tower.x_position*scaleCoeff + (tower.width*(tower.health)/100)*scaleCoeff),
        tower.y_position*scaleCoeff);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeStyle = BLACK;
      ctx.lineWidth = 1;
    }

    renderHalfLine(ctx){
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(modelWidth/2 * scaleCoeff, 0);
      ctx.lineTo(modelWidth/2 * scaleCoeff,
        modelHeight * scaleCoeff);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeStyle = BLACK;
      ctx.lineWidth = 1;
    }

		destroy() {
			window.removeEventListener('resize', this.bindedResizer);
		}
	}

	return GameScene;
})(window);
