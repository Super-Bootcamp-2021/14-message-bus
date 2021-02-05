const { write,read,destroy,finish } = require('../models/task-model');

async function register(data){
    try {
        const task = {  
            assignee_id :data.assigneeId,        
            name: data.name,
            attachment:  data.attachment, 
        }
        await write(task);
        return;
    } catch (error) {
        throw error
    }
}

async function listTask(){
    try {
        const result = await read();
        const data = result.map(result =>result.dataValues);
        return data;
    } catch (error) {
        throw error
    }
}

async function removeTask(id) {
    try {
        const result = await destroy(id);
        return result;

    } catch (error) {
        throw error
    }
}

async function completedTask(id){
    try {
        const result = await finish(id);
        const data = result.map(result =>result.dataValues);
        return data;
    } catch (error) {
        throw error
    }
}

module.exports = {register,listTask,removeTask,completedTask}