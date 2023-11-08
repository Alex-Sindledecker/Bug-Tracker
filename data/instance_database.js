import Database from "./database.js";

//Stores data in the instance of the application - all data is lost when the app stops
export class InstanceDatabase extends Database{
    constructor(){
        super();
        this.bugs = [];
        this.projects = [];
        this.nextBugId = 0;
        this.nextProjecctId = 0;
    }

    async init(url){}
    async disconnect(){}

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
        return this.bugs.filter(this.__convertFilter(filter));
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

    //Converts a filter to the required format
    __convertFilter(filter){
        return (model) => {
            let result = true;
            Object.keys(filter).forEach(key => {
                if (model[key] !== filter[key])
                    result = false;
            });
            return result;
        }
    }
}