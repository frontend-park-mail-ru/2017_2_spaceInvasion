import {ACTION_MAPPER, EVENT} from '../../../utils/constants';
import ControllerInterface from './controllerInterface';
import {debug} from 'util';
import {getTheme} from '../../../modules/themes'

class GameJoystick implements ControllerInterface {
  private options = {
    zone: document.querySelector("div.joystick-area"),                  // active zone
    color: getTheme() == 'man' ? '#2185d0' : '#00b5ad',
    size: 150,
    threshold: 0.1,               // before triggering a directional event
    fadeTime: 250,              // transition time
    multitouch: false,
    maxNumberOfNipples: 1,     // when multitouch, what is too many?
    dataOnly: false,              // no dom element whatsoever
    position: {top: '100%', left: '15%'},               // preset position for 'static' mode
    mode: 'static',                   // 'dynamic', 'static' or 'semi'
    restOpacity: 0.5,            // opacity when not 'dynamic' and rested
    catchDistance: 200           // distance to recycle previous joystick in
    // 'semi' mode
  };

  private joystickManager = require('nipplejs').create(this.options);

  diff(): EVENT[] {
    throw new Error("Method not implemented.");
  }

  is(event: EVENT): boolean {
    throw new Error("Method not implemented.");
  }

  init(): void {

    var lastKey: any = undefined;
    var lastDegree: any = undefined;

    const topMove = new KeyboardEvent("keydown", {
      key: "ArrowUp",
    });
    const bottomMove = new KeyboardEvent("keydown", {
      key: "ArrowDown",
    });
    const leftMove = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
    });
    const rightMove = new KeyboardEvent("keydown", {
      key: "ArrowRight",
    });
    const endMove = new KeyboardEvent("keyup", {
      key: "ArrowUp",
    });
    this.joystickManager.on('move', (evt: any, pad: any) => {
      var angle = pad.angle.degree;
      if (pad.direction && lastKey != pad.direction.angle || pad.angle && angle != pad.angle.degree) {
        this.dropKeys();
      }

      if (pad.direction) {
        lastKey = pad.direction.angle;
        lastDegree = angle;
        switch (lastKey) {
          case "up":
            if (angle > 90 && angle < 180) document.dispatchEvent(leftMove);
            if (angle < 90 && angle > 0) document.dispatchEvent(rightMove);
            document.dispatchEvent(topMove);
            break;
          case "down":
            if (angle > 0 && angle > 270) document.dispatchEvent(rightMove);
            if (angle < 270 && angle > 180) document.dispatchEvent(leftMove);
            document.dispatchEvent(bottomMove);
            break;
          case "left":
            document.dispatchEvent(leftMove);
            if (angle > 180) document.dispatchEvent(bottomMove);
            if (angle < 180) document.dispatchEvent(topMove);
            break;
          case "right":
            if (angle < 45 && angle > 0) document.dispatchEvent(topMove);
            if (angle < 270 && angle > 315) document.dispatchEvent(bottomMove);
            document.dispatchEvent(rightMove);
            break;
        }
      }
    });
    this.joystickManager.on('end', (evt: any, pad: any) => {
      this.dropKeys();
    })
  }

  dropKeys(): void {
    const direction = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    direction.forEach(_key => {
      document.dispatchEvent(new KeyboardEvent("keyup", {key: _key}));
    });
  }

  destroy(): void {
    this.destroy;
  }

  getEvents(): Map<EVENT, boolean> {
    throw new Error("Method not implemented.");
  }

  resetEvent(event: EVENT): void {
    throw new Error("Method not implemented.");
  }
}


export default GameJoystick;