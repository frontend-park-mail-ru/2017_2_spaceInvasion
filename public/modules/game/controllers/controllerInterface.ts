import {EVENT} from '../../../utils/constants';

interface ConstructableController {
  new(): ControllerInterface;
}

interface ControllerInterface {
  diff(): Map<EVENT, boolean>

  is(event: EVENT): boolean;

  init(): void;

  destroy(): void;
}

export {ConstructableController};
export default ControllerInterface;