// Carrega tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Adiciona uma nova tarefa
document.getElementById('add_task_btn').addEventListener('click', () => {
    const taskName = document.getElementById('task_name').value.trim();
    const steps = parseInt(document.getElementById('steps_task').value, 10);

    if (taskName && steps > 0) {
        addTaskToUI(taskName, steps);
        saveTaskToLocalStorage(taskName, steps);

        // Clear inputs
        document.getElementById('task_name').value = '';
        document.getElementById('steps_task').value = '';
    } else {
        alert('Please enter a valid task name and number of steps!');
    }
});

// Adiciona uma tarefa na interface
function addTaskToUI(taskName, steps, completedSteps = []) {
    const timeline = document.getElementById('task_timeline');

    const partTask = document.createElement('div');
    partTask.classList.add('part_task');

    // Nome da tarefa
    const taskLabel = document.createElement('div');
    taskLabel.classList.add('task_name');
    taskLabel.innerText = taskName;
    partTask.appendChild(taskLabel);

    // Container de passos
    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('steps_container');

    for (let i = 0; i < steps; i++) {
        const stepTask = document.createElement('div');
        stepTask.classList.add('step_task');

        // Marca o passo se ele já estiver completo
        if (completedSteps.includes(i)) {
            stepTask.classList.add('active');
        }

        stepTask.addEventListener('click', () => toggleStep(stepTask, taskName, i));

        const lineTask = document.createElement('div');
        lineTask.classList.add('line_task');

        stepsContainer.appendChild(stepTask);
        if (i < steps - 1) {
            stepsContainer.appendChild(lineTask);
        }
    }

    partTask.appendChild(stepsContainer);
    timeline.appendChild(partTask);
}

// Alterna o estado do passo (ativo/inativo)
function toggleStep(step, taskName, stepIndex) {
    const isActive = step.classList.contains('active');
    step.classList.toggle('active');

    updateTaskInLocalStorage(taskName, stepIndex, !isActive);

    if (!isActive) {
        triggerConfetti(step);
    }
}

// Salva uma nova tarefa no LocalStorage
function saveTaskToLocalStorage(taskName, steps) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ name: taskName, steps, completedSteps: [] });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Atualiza o estado de um passo no LocalStorage
function updateTaskInLocalStorage(taskName, stepIndex, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.name === taskName);

    if (task) {
        if (isCompleted) {
            task.completedSteps.push(stepIndex);
        } else {
            task.completedSteps = task.completedSteps.filter(s => s !== stepIndex);
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Carrega tarefas do LocalStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToUI(task.name, task.steps, task.completedSteps);
    });
}

// Gera confetes
function triggerConfetti(step) {
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.setProperty('--random-x', Math.random());
        confetti.style.setProperty('--random-y', Math.random());
        confetti.style.backgroundColor = getRandomColor();

        step.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 1500);
    }
}

// Gera uma cor aleatória
function getRandomColor() {
    const colors = ['#FFD700', '#FF4500', '#4CAF50', '#00BFFF', '#FF1493'];
    return colors[Math.floor(Math.random() * colors.length)];
}
