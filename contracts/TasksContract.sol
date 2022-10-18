// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TasksContract {
    uint256 public contadorTask = 0;

    constructor() {
        createTask("mi primer tarea de example", "To do");
    }

    event TaskCreated(
        uint id,
        string title,
        string description,
        bool done,
        uint createdAt
    );

    event TaskToggleDone(uint id, bool done);

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description)
        public
    {
        contadorTask++;
        tasks[contadorTask] = Task(
            contadorTask,
            _title,
            _description,
            false,
            block.timestamp
        );
        emit TaskCreated(contadorTask, _title, _description, false, block.timestamp);
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggleDone(_id, _task.done);
    }
}
