import mongoose, {Schema} from "mongoose";

class Database{
    constructor(){
        if (this.constructor == Database)
            throw new Error("Cannot instantiate abstract class 'Database'!");
    }

    async init(url){
        throw new Error("Method 'init()' must be implemented!");
    }

    async disconnect(url){
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
    constructor(){ 
        super();
    
        this._bugSchema = {
            projectId: Schema.ObjectId,
            level: Number,
            name: String,
            description: String,
            archived: Boolean
        }

        this._projectSchema = {
            name: String,
            description: String
        }
    }

    async init(url){
        await mongoose.connect(url).then(() => console.log("Succesfully connected to the mongo database!\n"));

        this._BugModel = mongoose.model("bug", this._bugSchema);
        this._ProjectModel = mongoose.model("project", this._projectSchema);
    }

    async disconnect(){
        await mongoose.disconnect();
    }

    async addProject(name, description){
        let project = new this._ProjectModel({
            name: name,
            description: description
        });

        await project.save();

        return project.toObject();
    }

    async addBug(projectId, level, name, description){
        
    }

    async getProject(id){
        
    }

    async getBug(id){
        
    }

    async getBugs(projectId, filter){
        
    }

    async updateBug(id, newModel){
        
        
    }

    async modifyBug(id, key, value){
        
    }

    async deleteBug(id){
        
    }

    async deleteProject(id){
        const result = await this._ProjectModel.deleteOne({_id: id});

        return result.deletedCount > 0;
    }
}

export class DataManager{
    constructor(database){
        this.database = database;
    }

    async initDb(dbUrl){
        await this.database.init(dbUrl);
    }

    async closeDb(){
        await this.database.disconnect();
    }

    async createProject(name, description){
        const model = await this.database.addProject(name, description);
        return model;
    }

    async createBug(projectId, name, description, level){
        return this.database.addBug(projectId, level, name, description);
    }

    async getProject(id){
        return this.database.getProject(id);
    }

    async getBug(id){
        return this.database.getBug(id);
    }

    async getBugs(projectId){
        return this.database.getBugs(projectId, bug => bug.projectId === projectId && bug.archived === false);
    }

    async getArchivedBugs(projectId){
        return this.database.getBugs(projectId, bug => bug.projectId === projectId && bug.archived === true);
    }

    async archiveBug(id){
        this.database.modifyBug(id, "archived", true);
    }

    async unarchiveBug(id){
        this.database.modifyBug(id, "archived", false);
    }

    async deleteBug(id){
        this.database.deleteBug(id);
    }

    async deleteProject(id){
        return this.database.deleteProject(id);
    }
}