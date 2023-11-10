export default class Database{
    constructor(){
        if (this.constructor == Database)
            throw new Error("Cannot instantiate abstract class 'Database'!");
    }

    addUser(username, password){
        throw new Error("Method 'addUser()' must be implemented!");
    }

    getUser(username){
        throw new Error("Method 'getUser()' must be implemented!");
    }

    init(url){
        throw new Error("Method 'init()' must be implemented!");
    }

    disconnect(url){
        throw new Error("Method 'disconnect()' must be implemented!");
    }

    addProject(name, description){
        throw new Error("Method 'addProject()' must be implemented!");
    }

    addBug(projectId, level, name, description){
        throw new Error("Method 'addBug()' must be implemented!");
    }

    getBug(id){
        throw new Error("Method 'getBug()' must be implemented!");
    }

    getBugs(projectId, filter){
        throw new Error("Method 'getBugs()' must be implemented!");
    }

    getProject(id){
        throw new Error("Method 'getProject()' must be implemented!");
    }

    getProjects(filter){
        throw new Error("Method 'getProjects()' must be implemented!");
    }

    getProjects(username){
        throw new Error("Method 'getProjects()' must be implemented!");
    }

    pushProjectToUser(username, projectId){
        throw new Error("Method 'pushProjectToUser()' must be implemented!");
    }

    modifyProject(id, key, value){
        throw new Error("Method 'modifyProject()' must be implemented");
    }

    updateBug(id, newModel){
        throw newError("Method 'updateBug()' must be implemented!");
    }

    modifyBug(id, key, value){
        throw newError("Method 'modifyBug()' must be implemented!");
    }

    deleteBug(id){
        throw new Error("Method 'deleteBug()' must be implemented!");
    }

    deleteProject(id){
        throw new Error("Method 'deleteProject()' must be implemented");
    }
}

export class SQLDatabase extends Database{
    constructor(){ super(); }

    addBug(){}
}