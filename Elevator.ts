import { InternalControl, ElevatorStatus } from './InternalControl';

type Direction = 'Up' | 'Down';

type UserRequest = {
  requestedFloor: number,
  directionFromRequestedFloor: Direction
}

type Queue = UserRequest[];

class Elevator implements InternalControl {
  constructor(
    public currentFloor: number,
    public direction: Direction,
    public queue: Queue,
    public isElevatorMoving: boolean
  ) {};

  getCurrentStatus(): ElevatorStatus {
    if (this.isElevatorMoving) {
      return ElevatorStatus.Running;
    }

    return ElevatorStatus.Idle;
  }

  getCurrentFloor(): number {
    return this.currentFloor;
  }

  up(callback?: () => void) {
    const next = this.queue[0];
    this.isElevatorMoving = true;

    while(this.getCurrentFloor() < next.requestedFloor) {
      this.currentFloor = this.currentFloor + 1;
    }
    return Promise.resolve()
      .then(callback)
      .catch(err => console.log(err));
  }

  down(callback?: () => void) {
    const next = this.queue[0];
    this.isElevatorMoving = true;

    while(this.getCurrentFloor() > next.requestedFloor) {
      this.currentFloor = this.currentFloor - 1;
    }
    return Promise.resolve()
      .then(callback)
      .catch(err => console.log(err));
  }

  private openElevatorDoors(): void {}

  private arriveAtTheFloor() {
    this.isElevatorMoving = false;
    this.openElevatorDoors();
  }

  public async internalRequest(floorNum: number): Promise<void> {
    const direction: Direction = this.getCurrentFloor() < floorNum ? 'Up' : 'Down';
    this.queue.push({ requestedFloor: floorNum, directionFromRequestedFloor: direction });
    const next = this.queue[0];

    if (next.directionFromRequestedFloor == 'Up') {
      await this.up(() => this.arriveAtTheFloor());
    } else {
      await this.down(() => this.arriveAtTheFloor());
    }
  }
  
  public async externalRequest(externalDirection: Direction, floorNum: number): Promise<void> {
    this.queue.push({ requestedFloor: floorNum, directionFromRequestedFloor: externalDirection });

    const next = this.queue[0];
    if (this.getCurrentFloor() <= floorNum) {
      if (next.requestedFloor >= floorNum && externalDirection == next.directionFromRequestedFloor) {
        await this.up(() => this.arriveAtTheFloor());
      } else {
        await this.down();
        await this.up(() => this.arriveAtTheFloor());
      }
    } else {
      if (next.requestedFloor > floorNum) {
        await this.up();
        await this.down(() => this.arriveAtTheFloor());
      } else {
        await this.down(() => this.arriveAtTheFloor());
      }
    }
  }
}

export { Elevator };