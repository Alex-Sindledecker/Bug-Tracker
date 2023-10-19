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

    getBugs(projectId){
        throw new Error("Method 'getBugs()' must be implemented!");
    }

    getProject(id){
        throw new Error("Method 'getProject()' must be implemented!");
    }

    getProjects(username){
        throw new Error("Method 'getProjects()' must be implemented!");
    }

    archiveBug(id){
        throw new Error("method 'archiveBug()' must be implemented!");
    }

    unarchiveBug(id){
        throw new Error("Method 'unarchiveBug()' must be implemented!");
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
        if (this.bugs[id] === null)
            throw new Error(`Could not find the bug with id '${id}`);
        return this.bugs[id];
    }

    getBugs(projectId){
        return this.bugs.filter(bug => bug.projectId === projectId && bug.archived === false);
    }

    archiveBug(id){
        if (this.bugs[id] === null)
            throw new Error(`Could not find the bug with id ${id}`);

        this.bugs[id].archived = true;
    }

    unarchiveBug(id){
        if (this.bugs[id] === null)
            throw new Error(`Could not find the bug with id ${id}`);

        this.bugs[id].archived = false;
    }

    deleteBug(id){
        if (this.bugs[id] === null)
            throw new Error(`Could not find the bug with id ${id}`);

        this.bugs.splice(id, 1);
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