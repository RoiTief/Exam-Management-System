const { Task, PRIORITIES } = require("../../main/business/Tasks/Task");

describe('Task', () => {
  let taskDb;
  let task;

  beforeEach(() => {
    taskDb = {
      update: jest.fn(),
    };

    task = new Task({
      taskId: 'task-1',
      priority: PRIORITIES.HIGH,
      description: 'Add key',
      pendingUsers: ['user1', 'user2'],
      doneUsers: [],
      finished: false,
      taskDb,
    });
  });

  test('User 1 done task', async () => {
    await task.userDoneA('user1');

    expect(task._pendingUsers).toEqual(['user2']);
    expect(task._doneUsers).toEqual(['user1']);
    expect(taskDb.update).toHaveBeenCalledWith(task);
  });

  test('should change the finished state', async () => {
    await task.changeFinished(true);

    expect(task._finished).toBe(true);
    expect(taskDb.update).toHaveBeenCalledWith(task);
  });

  test('should change the priority', async () => {
    await task.changePriority(PRIORITIES.MEDIUM);

    expect(task._priority).toBe(PRIORITIES.MEDIUM);
    expect(taskDb.update).toHaveBeenCalledWith(task);
  });

  test('should change the description', async () => {
    await task.changeDescription('Update key');

    expect(task._description).toBe('Update key');
    expect(taskDb.update).toHaveBeenCalledWith(task);
  });
});