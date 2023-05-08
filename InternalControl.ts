enum ElevatorStatus {
  Idle,
  Running
}

interface InternalControl {
  getCurrentStatus(): ElevatorStatus;

  getCurrentFloor(): number;

  // Moves the elevator up 1 floor from where it is
  // When the elevator starts moving, the getCurrentStatus() change to Running,
  // Once it reaches the floor, promise is resolved, callback is called,
  // the getCurrentStatus() change to Idle
  up(callback?: () => void): Promise<void>;

  down(callback?: () => void): Promise<void>;
}

export { InternalControl, ElevatorStatus }