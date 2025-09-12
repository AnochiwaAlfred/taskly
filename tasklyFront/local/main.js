// BACKEND_URL = "http://127.0.0.1:8000"   
const BACKEND_URL = "https://taskly-f9fl.onrender.com"

function showLoader() {
    document.getElementById("apiLoader").style.display = "block";
}

function hideLoader() {
    document.getElementById("apiLoader").style.display = "none";
}


function requireLogin() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "login.html";
    }
}

async function logout() {
    const token = localStorage.getItem("access_token");
    if (token) {
        showLoader();

        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/auth/logout/`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.clear();
                window.location.href = "login.html";
            } else {
                console.log("Logout failed:", data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }finally {
            hideLoader(); // 👈 always hide
        }
    }
}

async function refreshTasksUI() {
    await getTasks();
    tasks();
    document.dispatchEvent(new Event("tasksUpdated"));
}


async function changeTaskStatus(task_id) {
    const token = localStorage.getItem("access_token");
    if (token) {
        showLoader();
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${task_id}/update_task_status/`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const data = await response.json();
            if (response.ok) {
                // ✅ refresh tasks and UI instead of clearing localStorage
                refreshTasksUI()
            } else {
                console.log("Update failed:", data.message || data);
            }
        } catch (error) {
            console.error("Update error:", error);
        }finally {
            hideLoader(); // 👈 always hide
        }
    }
}


async function deleteTask(task_id) {
    const token = localStorage.getItem("access_token");
    if (token) {
        showLoader();
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${task_id}/delete/`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const data = await response.json();
            if (response.ok) {
                // ✅ refresh tasks and UI instead of clearing localStorage
                $(`#deleteModal-${task_id}`).modal('hide');
                refreshTasksUI()

            } else {
                console.log("Delete failed:", data.message || data);
            }
        } catch (error) {
            console.error("Delete error:", error);
        }finally {
            hideLoader(); // 👈 always hide
        }
    }
}

async function editTask(task_id) {
    const token = localStorage.getItem("access_token");
    if (token) {
        showLoader();
        try {
            // Get values from the modal inputs
            const title = document.querySelector(`#editTaskModal-${task_id} #modalTitle`).value;
            const description = document.querySelector(`#editTaskModal-${task_id} #modalDescription`).value;

            const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${task_id}/update_task/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ title, description })  
            });

            const data = await response.json();
            if (response.ok) {
                // Close the modal (if you’re using Bootstrap)
                $(`#editTaskModal-${task_id}`).modal('hide');

                // Refresh tasks and UI
                refreshTasksUI()
            } else {
                console.log("Update failed:", data.message || data);
            }
        } catch (error) {
            console.error("Update error:", error);
        }finally {
            hideLoader(); // 👈 always hide
        }
    }
}


async function changeTaskPriority(task_id) {
    const token = localStorage.getItem("access_token");
    if (token) {
        showLoader();
        try {
            const priority = document.querySelector(`#prioritySelect-${task_id}`).value;

            const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${task_id}/update_task_priority/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ priority })   
            });

            const data = await response.json();
            if (response.ok) {
                $(`#priorityModal-${task_id}`).modal("hide");

                // Refresh tasks & UI
                refreshTasksUI()
            } else {
                console.log("Priority update failed:", data.message || data);
            }
        } catch (error) {
            console.error("Priority update error:", error);
        }finally {
            hideLoader(); // 👈 always hide
        }
    }
}

async function addTask() {
    const token = localStorage.getItem("access_token");
    if (token) {
        showLoader();
        try {
            const title = document.getElementById("newTaskTitle").value;
            const description = document.getElementById("newTaskDescription").value;
            const priority = document.getElementById("newTaskPriority").value;

            const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${localStorage.getItem("id")}/create_task/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ title, description, priority })
            });

            const data = await response.json();
            if (response.ok) {
                $("#addTaskModal").modal("hide");

                document.getElementById("addTaskForm").reset();

                refreshTasksUI();
            } else {
                console.log("Add failed:", data.message || data);
            }
        } catch (error) {
            console.error("Add error:", error);
        }finally {
            hideLoader(); // 👈 always hide
        }
    }
}









window.TasksData = {
    lowPriority: [],
    midPriority: [],
    highPriority: [],
    isCompletedTrue: [],
    isCompletedFalse: [],
    allTasks: []
};

// utils



function getPriorityBadgeClass(priority) {
    if (priority === "low") return ["badge-info-inverse", "Low"];
    if (priority === "medium") return ["badge-success-inverse", "Medium"];
    if (priority === "high") return ["badge-danger-inverse", "High"];
    return "badge-secondary"; // fallback
}



function formatDate(isoString){
    const date = new Date(isoString);
    const formatted = date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    return formatted
}

async function getTasks() {
    const id = localStorage.getItem("id");
    if (id) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/tasks/${id}/get_user_tasks/`);
            const data = await response.json();

            if (response.ok) {
                let { lowPriority, midPriority, highPriority, isCompletedTrue, isCompletedFalse, allTasks } = window.TasksData;
                
                // reset arrays
                lowPriority.length = midPriority.length = highPriority.length = 0;
                isCompletedTrue.length = isCompletedFalse.length = allTasks.length = 0;

                for (const task of data) {
                    if (task.is_completed) isCompletedTrue.push(task);
                    else isCompletedFalse.push(task);

                    if (task.priority === "low") lowPriority.push(task);
                    else if (task.priority === "medium") midPriority.push(task);
                    else if (task.priority === "high") highPriority.push(task);

                    allTasks.push(task);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}


// main render function
function renderTaskList(taskArray, filterValue="all") {
    let taskItemsHTML = "";

    for (const task of taskArray) {
        const badgeClass = getPriorityBadgeClass(task.priority);
        const buttonLabel = task.is_completed ? "Mark Incomplete" : "Mark Complete";
        const buttonClass = task.is_completed ? "btn-danger" : "btn-warning";

        taskItemsHTML += `
            <div class="card-body">
                <div class="media">
                    <div class="media-body ml-2">
                        <div class="row align-items-center mb-3">
                            <div class="col-12 col-md-6 mb-2 mb-md-0">
                                <h4 class="mb-0">${task.title}</h4>
                                <span class="mr-2 mb-2 mr-sm-0 mb-sm-0 badge ${badgeClass[0]}">${badgeClass[1]}</span>
                            </div>

                            <div class="col-12 col-md-6 d-flex justify-content-md-end flex-wrap gap-2">
                                <button onclick="" class="btn btn-sm btn-icon btn-outline-info mr-1 mb-1" data-toggle="modal" data-target="#editTaskModal-${task.id}"><i class="fe fe-edit" title="Edit"></i></button>
                                <button onclick="" class="btn btn-sm btn-icon btn-outline-danger mr-1 mb-1" data-toggle="modal" data-target="#deleteModal-${task.id}"><i class="fe fe-trash-2" title="Delete"></i></button>
                                <button onclick="" class="btn btn-sm btn-outline-primary mr-1 mb-1" data-toggle="modal" data-target="#priorityModal-${task.id}">Change Priority</button>
                                <button onclick="changeTaskStatus('${task.id}')" class="btn btn-sm ${buttonClass} mb-1">${buttonLabel}</button>
                            </div>
                        </div>

                        <p>${task.description}</p>
                        <span class="text-muted small">${formatDate(task.modified)}</span>
                    </div>

                </div>
             </div>  


             <div class="modal fade" id="deleteModal-${task.id}" tabindex="-1" role="dialog" aria-labelledby="deleteModal-${task.id}" aria-hidden="true">
                 <div class="modal-dialog" role="document">
                     <div class="modal-content">
                         <div class="modal-header">
                             <h5 class="modal-title">Delete Task?</h5>
                             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">×</span>
                             </button>
                         </div>
                         <div class="modal-body">
                             You absolutely sure you want to delete this task - ${task.title}? 
                         </div>
                         <div class="modal-footer">
                             <button type="button" class="btn btn-danger" data-dismiss="modal">Nahh</button>
                             <button type="button" onclick="deleteTask('${task.id}')" class="btn btn-success">Alright</button>
                         </div>
                     </div>
                 </div>
             </div>



             <div class="modal fade" id="editTaskModal-${task.id}" tabindex="0" role="dialog" aria-labelledby="editTaskModal-${task.id}" aria-hidden="true" >
                 <div class="modal-dialog modal-dialog-centered" role="document">
                     <div class="modal-content">
                         <div class="modal-header">
                             <h5 class="modal-title">Edit Task</h5>
                             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">×</span>
                             </button>
                         </div>
                         <div class="modal-body">
                             <form>
                                 <div class="form-group">
                                     <label for="modalTitle">Title</label>
                                     <input type="text" class="form-control" id="modalTitle" value="${task.title}">
                                 </div>
                                 <div class="form-group">
                                     <label for="modalDescription">Description</label>
                                     <textarea type="text" class="form-control" id="modalDescription">${task.description}</textarea>
                                 </div>
                                 <button type="button" onclick="editTask('${task.id}')" class="btn btn-primary">SAVE</button>
                             </form>
                         </div>
                     </div>
                 </div>
             </div>



             <div class="modal fade" id="priorityModal-${task.id}" tabindex="-1" role="dialog" aria-labelledby="priorityModal-${task.id}" aria-hidden="true">
                 <div class="modal-dialog modal-dialog-centered" role="document">
                     <div class="modal-content">
                         <div class="modal-header">
                             <h5 class="modal-title">Change Task Priority</h5>
                             <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">×</span>
                             </button>
                         </div>
                         <div class="modal-body">
                             <form>
                                 <div class="form-group">
                                     <label for="prioritySelect-${task.id}">Select Priority</label>
                                     <select class="form-control" id="prioritySelect-${task.id}">
                                         <option value="low" ${task.priority === "low" ? "selected" : ""}>Low</option>
                                         <option value="medium" ${task.priority === "medium" ? "selected" : ""}>Medium</option>
                                         <option value="high" ${task.priority === "high" ? "selected" : ""}>High</option>
                                     </select>
                                 </div>
                             </form>
                         </div>
                         <div class="modal-footer">
                             <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                             <button type="button" class="btn btn-primary" onclick="changeTaskPriority('${task.id}')">Save</button>
                         </div>
                     </div>
                 </div>
             </div>  
        `;
    }

    const titleMap = {
        all: "All Tasks",
        completed: "Completed Tasks",
        incomplete: "Incomplete Tasks",
        low: "Low Priority Tasks",
        medium: "Medium Priority Tasks",
        high: "High Priority Tasks"
    };


    const taskListHTML = `
        <div class="card card-statistics h-100 mb-0 widget-support-list">
            <div class="card-header">
                <div class="card-heading">
                    <h4 class="card-title">${titleMap[filterValue] || "Tasks"} (${taskArray.length})</h4>
                </div>
            </div>
            ${taskItemsHTML || `<div class="p-3 text-muted">No tasks found</div>`}
        </div>
    `;

    document.getElementById('taskList').innerHTML = taskListHTML;
}


// filter wrapper
function filterTasks(filterValue) {
    let filtered = [];
    switch(filterValue) {
        case "completed": filtered = window.TasksData.isCompletedTrue; break;
        case "incomplete": filtered = window.TasksData.isCompletedFalse; break;
        case "low": filtered = window.TasksData.lowPriority; break;
        case "medium": filtered = window.TasksData.midPriority; break;
        case "high": filtered = window.TasksData.highPriority; break;
        default: filtered = window.TasksData.allTasks;
    }
    renderTaskList(filtered, filterValue);
}



// initial load
async function tasks() {
    document.getElementById("usernamePlace").innerText = localStorage.getItem("username");
    await getTasks();

    const sum = window.TasksData.isCompletedTrue.length + window.TasksData.isCompletedFalse.length;
    const completedRatio = sum ? Number((window.TasksData.isCompletedTrue.length/sum)*100).toFixed(1) : 0;
    const inCompletedRatio = sum ? Number((window.TasksData.isCompletedFalse.length/sum)*100).toFixed(1) : 0;

    document.getElementById('priorityList').innerHTML = `
        <li class="d-flex py-1"><span><i class="fa fa-circle text-info pr-2"></i> Low Priority</span><span class="pl-2 font-weight-bold">${window.TasksData.lowPriority.length}</span></li>
        <li class="d-flex py-1"><span><i class="fa fa-circle text-success pr-2"></i> Mid Priority</span><span class="pl-2 font-weight-bold">${window.TasksData.midPriority.length}</span></li>
        <li class="d-flex py-1"><span><i class="fa fa-circle text-danger pr-2"></i> High Priority</span><span class="pl-2 font-weight-bold">${window.TasksData.highPriority.length}</span></li>
    `;
    

    document.getElementById('highPriorityIn').innerText = window.TasksData.highPriority.length;
    document.getElementById('midPriorityIn').innerText = window.TasksData.midPriority.length;
    document.getElementById('lowPriorityIn').innerText = window.TasksData.lowPriority.length;

    document.getElementById('statusChart').innerHTML =  `
         <div class="border-bottom pb-2 pb-xxs-4">
             <div class="row">
                 <div class="col-xxs-6 mb-3 mb-xxs-0">
                     <span class="font-17">Completed Tasks</span>
                     <h3 class="mt-1 mb-1">${window.TasksData.isCompletedTrue.length}</h3>
                     <span class="d-block"> <i class="fa fa-arrow-down text-cyan"></i> <b class="text-cyan">+23%</b> Vs last months </span>
                 </div>
                 <div class="col-xxs-6 mb-3 mb-xxs-0">
                     <span class="font-17">Incompleted Tasks</span>
                     <h3 class="mt-1 mb-1">${window.TasksData.isCompletedFalse.length}</h3>
                     <span class="d-block"> <i class="fa fa-arrow-down text-danger"></i> <b class="text-danger">+65%</b> Vs last months </span>
                 </div>
             </div>
         </div>
         <div class="row">
             <div class="col-xxs-6 pt-2 pt-xxs-4">
                 <div class="d-flex justify-content-between">
                     <span class="font-16"><b>${window.TasksData.isCompletedTrue.length}</b> Completed Tasks</span>
                     <span class="font-16"><b>${completedRatio}%</b> of tasks</span>
                 </div>
                 <div class="progress my-3" style="height: 6px;">
                     <div class="progress-bar bg-success" role="progressbar" style="width: ${completedRatio}%;" aria-valuenow="${completedRatio}" aria-valuemin="0" aria-valuemax="100"></div>
                 </div>
             </div>
             <div class="col-xxs-6 pt-2 pt-xxs-4">
                 <div class="d-flex justify-content-between">
                     <span class="font-16"><b>${window.TasksData.isCompletedFalse.length}</b> Incomplete Tasks</span>
                     <span class="font-16"><b>${inCompletedRatio}%</b> of tasks</span>
                 </div>
                 <div class="progress my-3" style="height: 6px;">
                     <div class="progress-bar bg-danger" role="progressbar" style="width: ${inCompletedRatio}%;" aria-valuenow="${inCompletedRatio}" aria-valuemin="0" aria-valuemax="100"></div>
                 </div>
             </div>
         </div>
    
     `;

    renderTaskList(window.TasksData.allTasks, "all");
}

// Hook up filter dropdown
document.addEventListener("DOMContentLoaded", () => {
    const filterDropdown = document.getElementById("taskGroupSelect");
    if (filterDropdown) {
        filterDropdown.addEventListener("change", (event) => {
            const value = event.target.value;
            filterTasks(value);
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("autocomplete-ajax");

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();

        if (!query) {
            renderTaskList(window.TasksData.allTasks, "all"); // show all if empty
            return;
        }

        const filtered = window.TasksData.allTasks.filter(task => 
            task.title.toLowerCase().includes(query) || 
            task.description.toLowerCase().includes(query)
        );

        renderTaskList(filtered, "search");
    });
});





requireLogin();
tasks()



