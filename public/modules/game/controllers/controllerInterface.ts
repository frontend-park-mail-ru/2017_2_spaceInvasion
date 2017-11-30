import {EVENT} from '../../../utils/constants';

interface ConstructableController {
  new(): ControllerInterface;
}

interface ControllerInterface {
  diff(): EVENT[]
  newCommands(): EVENT[];
  stoppedCommands(): EVENT[];
  is(event: EVENT): boolean;
  init(): void;
  destroy(): void;
}

export {ConstructableController};
export default ControllerInterface;