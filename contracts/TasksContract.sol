// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TasksContract {
    uint256 public contadorTask = 0;
    uint256 public contadorBet = 0;

    constructor() {
        // createTask("Fase 1 de grupos", "Mexico vs Qatar");
    }

    event TaskCreated(
        uint id,
        string title,
        string description,
        bool done,
        uint createdAt
    );

    event BetCreated(
        uint id,
        string description,
        address creator,
        address user1,
        address user2,
        uint amount,
        bool user1Transfer,
        bool user2Transfer,
        uint betBalance,
        bool finished,
        string apuestaUser1,
        string apuestaUser2
    );

    event TaskToggleDone(uint id, bool done);
    event BetInicializated(uint id, address user1, uint amount, bool user1Transfer, uint betBalance);
    
    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    struct Bet {
        uint256 id;
        string description;
        address creator;
        address user1;
        address user2;
        uint amount;
        bool user1Transfer;
        bool user2Transfer;
        uint betBalance;
        bool finished;
        string apuestaUser1;
        string apuestaUser2;
    }

    mapping(uint256 => Task) public tasks;
    mapping(uint256 => Bet) public bets;

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

    function createBet(string memory _description)payable
    public
    {
        contadorBet++;
        bets[contadorBet] = Bet(
            contadorBet,
            _description,
            msg.sender,
            0x0000000000000000000000000000000000000000,
            0x0000000000000000000000000000000000000000,
            msg.value,
            true,
            false,
            0,
            false,
            "",
            ""
        );
        emit BetCreated((contadorBet), _description, msg.sender, msg.sender, msg.sender, msg.value, true, false, 0, false, "", "");
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggleDone(_id, _task.done);
    }

    function iniciarApuesta(uint256 _id, uint _amount, string memory _apuestaUser1) public payable
    {
        Bet memory _bet = bets[_id];
        _bet.user1 = msg.sender;
        //_bet.amount = _amount;
        _bet.amount = msg.value;
        _bet.user1Transfer = true;
        _bet.betBalance = _amount;
        _bet.apuestaUser1 = _apuestaUser1;
        if(_bet.creator == msg.sender) {
            revert();
        } else {
            bets[_id] = _bet;
            emit BetInicializated(_id, _bet.user1, _bet.amount, _bet.user1Transfer, _bet.betBalance);
        }
    }

    function emparejarApuesta(uint256 _id, uint _amount, string memory _apuestaUser2) public payable
    {
        Bet memory _bet = bets[_id];
        _bet.user2 = msg.sender;
        //_bet.amount = _amount;
        _bet.amount = msg.value;
        _bet.user2Transfer = true;
        // _bet.betBalance = _bet.betBalance + _amount;
        _bet.apuestaUser2 = _apuestaUser2;
        if(_bet.creator == msg.sender || _bet.user1 == msg.sender) {
            revert();
        } else {
            bets[_id] = _bet;
            emit BetInicializated(_id, _bet.user1, _bet.amount, _bet.user1Transfer, _bet.betBalance);
        }
    }

    function finalizarApuesta(uint256 _id, address payable _winner) public payable
    {
        Bet storage _bet = bets[_id];
        require(_bet.user1Transfer == true && _bet.user2Transfer == true);
        uint amount = _bet.amount * 2;
        if(_bet.user1 == msg.sender || _bet.user2 == msg.sender) {
            revert();
        } else {
            _winner.transfer(amount);
            _bet.finished = true;
            bets[_id] = _bet;
            emit BetInicializated(_id, _bet.user1, _bet.amount, _bet.user1Transfer, _bet.betBalance);
        }
    }
}
