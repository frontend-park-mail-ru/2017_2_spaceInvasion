import {EVENT} from '../../../utils/constants';

interface ConstructableController {
  new(): ControllerInterface;
}

interface ControllerInterface {
  diff(): EVENT[]
  is(event: EVENT): boolean;
  init(): void;
  destroy(): void;
  getEvents(): Map<EVENT, boolean>;
}

export {ConstructableController};
export default ControllerInterface;