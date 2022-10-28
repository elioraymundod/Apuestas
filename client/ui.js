const taskForm = document.querySelector("#taskForm")

document.addEventListener("DOMContentLoaded", () => {
    App.init()
})

/*taskForm.addEventListener("submit", e => {
    e.preventDefault()

    App.createTask(taskForm["title"].value,taskForm["description"].value);
});*/

taskForm.addEventListener("submit", e => {
    e.preventDefault()

    App.createBet(taskForm["description"].value);
});