
App = {
    contracts: {},
    idSelected: 0,
    apuestaSelected: '',

    init: async () => {
        console.log('Loaded')
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        App.renderTasks()
    },

    loadEthereum: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({method: 'eth_requestAccounts'})
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider)
        }    else {
            console.log('No tiene instalado ethereum')
        }
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        App.account= accounts[0]
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json()
        
        App.contracts.tasksContract = TruffleContract(tasksContractJSON)
        App.contracts.tasksContract.setProvider(App.web3Provider)

        App.tasksContract = await App.contracts.tasksContract.deployed()
    },

    render: async () => {
        document.getElementById('account').innerText = App.account
    },

    renderTasks: async () => {
        const betCounter = await App.tasksContract.contadorBet()
        const betCounterNumber = betCounter.toNumber()
        let html = ''
        
        for (let i = 1; i <= betCounterNumber ;  i++) {
            const bet = await App.tasksContract.bets(i)
            const betId = bet[0]
            const betDescription = bet[1]
            const betCreator = bet[2]
            const betUser1 = bet[3]
            const betUser2 = bet[4]
            const betAmount = bet[5]
            const betUser1Transfer = bet[6]
            const betUser2Transfer = bet[7]
            const betBalance = bet[8]
            const betFinished = bet[9]
            const betApuesta1 = bet[10]
            const betApuesta2 = bet[11]

            console.log('creando con ', betDescription)
            let betElement = `
            <div class="card mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${betDescription}</span>
                    <!--div class="form-check form-switch">
                        <input class="form-check-input" data-id="${betId}" type="checkbox" ${betFinished && "checked"} 
                            onchange="App.toggleDone(this)"
                        />
                    </div-->
                </div>
                <div class="card-body">
                    <p><b>Valor de la apuesta:</b> ${betBalance}</p>
                    <!--p><b>Usuario 1:</b> ${betCreator}</p-->
                    <p><b>Usuario 1:</b> ${betApuesta1}</p>
                    <p><b>Usuario 2:</b> ${betApuesta2}</p>
                    ` 
                        
            if(betApuesta1 === '' && betApuesta2 === '') {
                betElement += 
                `
                    <div class="row">
                        <button type="button" class="btn btn-primary col-2" data-id="${betId}" onclick="App.selectId(${betId})" data-toggle="modal" data-target="#inicializarApuesta" >Iniciar apuesta</button>
                        </div>
                    
                    </div>
                </div>
                `
            } else if(betApuesta1 !== '' && betApuesta2 === '') {
                betElement += 
                `
                    <div class="row">
                        <button type="button" class="btn btn btn-dark col-3" data-id="${betId}" onclick="App.selectId(${betId})" data-toggle="modal" data-target="#emparejarApuesta" >Emparejar apuesta</button>
                        </div>
                    
                    </div>
                </div>
                `
            } else if(betApuesta1 !== '' && betApuesta2 !== '' && betFinished === false) {
                betElement += 
                `
                    <div class="row">
                        <button type="button" class="btn btn btn-success col-3" data-id="${betId}" onclick="App.selectId(${betId})" data-toggle="modal" data-target="#finalizarApuesta" >Finalizar apuesta</button>
                        </div>
                    
                    </div>
                </div>
                `
            } 
            else {
                betElement += 
                `
                    </div>
                </div>
                `
            }

            betElement += 
            `
            <!--Iniciar apuesta-->
            <div class="modal fade" id="inicializarApuesta" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Finalizar apuesta</h5>
                    <!--button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button-->
                    </div>
                    <div class="modal-body">
                        <form class="card card-body " id="betForm">
                        <input class="form-control" type="text" placeholder="Ingrese nombre del equipo que apoya" name="nombrePais"><br>
                        <input class="form-control" type="number" placeholder="Ingrese cantidad a apostar" name="totalApuesta">
                        </form>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" data-id="App.idSelected"  onclick="App.iniciarApuesta(this)">Apostar</button>
                    </div>
                </div>
                </div>
            </div>

            <!--Emparejar apuesta-->
            <div class="modal fade" id="emparejarApuesta" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Emparejar apuesta</h5>
                    <!--button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button-->
                    </div>
                    <div class="modal-body">
                        <form class="card card-body " id="emparejarForm">
                            <input class="form-control" type="text" placeholder="Ingrese nombre del equipo que apoya" name="segundoPais"><br>
                            <input class="form-control" type="number" placeholder="Ingrese cantidad a apostar" name="segundaApuesta">
                        </form>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" data-id="App.idSelected"  onclick="App.emparejarApuesta(this)">Apostar</button>
                    </div>
                </div>
                </div>
            </div>

            <!--Finalizar apuesta-->
            <div class="modal fade" id="finalizarApuesta" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Emparejar apuesta</h5>
                    <!--button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button-->
                    </div>
                    <div class="modal-body">
                        <form class="card card-body " id="finalizarForm">
                            <input class="form-control" type="text" placeholder="Ingrese la cuenta del ganador" name="winner"><br>
                        </form>
                    </div>
                    <div class="modal-footer">
                    <!--button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar apuesta</button-->
                    <button type="button" class="btn btn-success" data-id="App.idSelected"  onclick="App.finalizarApuesta(this)">Finalizar apuesta</button>
                    </div>
                </div>
                </div>
            </div>
            `

            html += betElement;
        }

        /*
        for (let i = 1; i <= taskCounterNumber ;  i++) {
            const task = await App.tasksContract.tasks(i)
            const taskId = task[0]
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreated = task[4]

            let taskElement = `
            <div class="card mb-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${taskTitle}</span>
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} 
                            onchange="App.toggleDone(this)"
                        />
                    </div>
                </div>
                <div class="card-body">
                    <span>${taskDescription}</span>
                    <p class="text-muted">Esta tarea fue creada el ${new Date(taskCreated * 1000).toLocaleString()}</p>
                </div>
            </div>
            `
            html += taskElement;

        }
        */
        document.querySelector('#tasklist').innerHTML = html;
    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, {
            from: App.account
        })
        console.log(result.logs[0].args)
    },

    createBet: async (description) => {
        const result = await App.tasksContract.createBet(description, {
            from: App.account
        })
        console.log(result.logs[0].args)
        window.location.reload();
    },

    toggleDone: async (element) => {
        const taskId = element.dataset.id
        console.log(taskId)
        /*await App.tasksContract.toggleDone(taskId, {
            from: App.account
        })

        window.location.reload()*/
    },

    iniciarApuesta: async (element) => {
        const totalApuesta = document.querySelector("#betForm")
        const betId = element.dataset.id
        await App.tasksContract.iniciarApuesta(App.idSelected, totalApuesta["totalApuesta"].value, totalApuesta["nombrePais"].value, {
            from: App.account
        })
        window.location.reload();
    },

    emparejarApuesta: async (element) => {
        const emparejarApuesta = document.querySelector("#emparejarForm")
        const betId = element.dataset.id
        await App.tasksContract.emparejarApuesta(App.idSelected, emparejarApuesta["segundaApuesta"].value, emparejarApuesta["segundoPais"].value, {
            from: App.account
        })
        window.location.reload();
    },

    finalizarApuesta: async (element) => {
        const emparejarApuesta = document.querySelector("#finalizarForm")
        await App.tasksContract.finalizarApuesta(App.idSelected, emparejarApuesta["winner"].value, {
            from: App.account
        })
        window.location.reload();
    },

    selectId: async(id) => {
        App.idSelected = id;
        //App.apuestaSelected = apuesta;
        console.log(id)
    }


}