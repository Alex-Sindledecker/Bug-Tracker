class Database{
    constructor(){
        if (this.constructor == Database)
            throw new Error("Cannot instantiate abstract class 'Database'!");
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

    getProjects(username){
        throw new Error("Method 'getProjects()' must be implemented!");
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

//Stores data in the instance of the application - all data is lost when the app stops
export class InstanceDatabase extends Database{
    constructor(){
        super();
        this.bugs = [];
        this.projects = [];
        this.nextBugId = 0;
        this.nextProjecctId = 0;
    }

    addProject(name, description){
        const model = {
            id: this.nextProjecctId,
            name: name,
            description: description
        };
        this.nextProjecctId += 1;

        this.projects.push(model);

        return model;
    }

    addBug(projectId, level, name, description){
        const model = {
            id: this.nextBugId,
            projectId: projectId,
            level: level,
            name: name,
            description: description,
            archived: false
        };
        this.nextBugId += 1;

        this.bugs.push(model);

        return model;
    }

    getProject(id){
        if (id < this.projects.length && this.projects[id] !== null)
            return this.projects[id];
        throw new Error(`Could not find database with id '${id}'!`);
    }

    getBug(id){
        this.__validateBug(id);
        return this.bugs[id];
    }

    getBugs(projectId, filter){
        return this.bugs.filter(filter);
    }

    updateBug(id, newModel){
        this.__validateBug(id);

        if (Object.keys(newModel).sort().toString() !== Object.keys(this.bugs[id]).sort().toString())
            throw new Error("Invalid Model!");

        this.bugs[id] = newModel;
        
    }

    modifyBug(id, key, value){
        this.__validateBug(id);

        if (key in this.bugs[id] === false)
            throw new Error(`Key '${key}' not found in bug model!`);

        this.bugs[id][key] = value;
    }

    deleteBug(id){
        this.__validateBug(id);

        this.bugs.splice(id, 1);
    }

    __validateBug(id){
        if (this.bugs[id] === null)
            throw new Error(`Could not find the bug with id '${id}`);
    }
}

export class SQLDatabase extends Database{
    constructor(){ super(); }

    addBug(){}
}

export class MongoDatabase extends Database{
    constructor(){ super(); }

    addBug(){}
}

export class DataManager{
    constructor(database){
        this.database = database;
    }

    createProject(name, description){
        return this.database.addProject(name, description);
    }

    createBug(projectId, name, description, level){
        return this.database.addBug(projectId, level, name, description);
    }

    getProject(id){
        return this.database.getProject(id);
    }

    getBug(id){
        return this.database.getBug(id);
    }

    getBugs(projectId){
        return this.database.getBugs(projectId, bug => bug.projectId === projectId && bug.archived === false);
    }

    getArchivedBugs(projectId){
        return this.database.getBugs(projectId, bug => bug.projectId === projectId && bug.archived === true);
    }

    archiveBug(id){
        this.database.modifyBug(id, "archived", true);
    }

    unarchiveBug(id){
        this.database.modifyBug(id, "archived", false);
    }

    deleteBug(id){
        this.database.deleteBug(id);
    }

    deleteProject(id){

    }
}