const TasksContract = artifacts.require("TasksContract")

contract("TasksContract", () => {


    before(async () => {
        this.tasksContract = await TasksContract.deployed()
    })

    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it('get Tasks List', async () => {

        const contadorTask = await this.tasksContract.contadorTask()
        const task = await this.tasksContract.tasks(contadorTask)

        assert.equal(task.id.toNumber(), contadorTask);
        assert.equal(task.title, "mi primer tarea de example");
        assert.equal(task.description, "To do");
        assert.equal(task.done, false);
        assert.equal(contadorTask, 1);
    })

    it("task created successfully", async () => {
        const result = await this.tasksContract.createTask("otra tarea", "Nueva descripcion");
        const taskEvent = result.logs[0].args;
        const contadorTask = await this.tasksContract.contadorTask();

        assert.equal(contadorTask, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "otra tarea");
        assert.equal(taskEvent.description, "Nueva descripcion");
        assert.equal(taskEvent.done, false);
    });

    it("task toggle done", async () => {
        const result = await this.tasksContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.tasksContract.tasks(1);
        
        assert.equal(task.done, true);
        assert.equal(taskEvent.id, 1);
        assert.equal(taskEvent.done, true);
    });
});