import mongoose, {Schema, Types} from "mongoose";

import Database from "./database.js";

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
            ownerUsername: String,
            name: String,
            description: String
        }

        this._userSchema = {
            username: String,
            password: String,
            projects: [Schema.ObjectId]
        }
    }

    async init(url){
        await mongoose.connect(url).then(() => console.log("Succesfully connected to the mongo database!\n"));

        this._BugModel = mongoose.model("bug", this._bugSchema);
        this._ProjectModel = mongoose.model("project", this._projectSchema);
        this._UserModel = mongoose.model("user", this._userSchema);
    }

    async disconnect(){
        await mongoose.disconnect();
    }

    async addUser(username, password){
        let user = new this._UserModel({
            username: username,
            password: password,
            projects: []
        });

        await user.save();

        return {username: username, password: password};
    }

    async getUser(username){
        const user = await this._UserModel.findOne({username: username});

        if (user == null)
            return null;

        return {
            username: user.username,
            password: user.password,
            projects: user.projects
        };
    }

    async addProject(creatorUsername, name, description){
        let project = new this._ProjectModel({
            ownerUsername: creatorUsername,
            name: name,
            description: description
        });

        await project.save();

        return this.__toRawProject(project.toObject());
    }

    async addBug(projectId, level, name, description){
        let bug = new this._BugModel({
            projectId: new Types.ObjectId(projectId),
            name: name,
            description: description,
            level: level,
            archived: false
        });

        await bug.save();
        return this.__toRawBug(bug.toObject());
    }

    async getProject(id){
        const project = await this._ProjectModel.findById({_id: new Types.ObjectId(id)});
        if (project == null)
            throw new Error(`Project with id ${id} not found!`);

        return this.__toRawProject(project);
    }

    async getProjects(filter){
        let projects = [];

        for await (const model of this._ProjectModel.find(this.__convertFilter(filter))){
            projects.push(await this.__toRawProject(model));
        }

        return projects;
    }

    async getBug(id){
        const bug = await this._BugModel.findById({_id: new Types.ObjectId(id)});
        if (bug == null)
            throw new Error(`Bug with id ${id} not found!`);

        return this.__toRawBug(bug);
    }

    async getBugs(projectId, filter){
        let models = [];

        for await (const model of this._BugModel.find(this.__convertFilter(filter))){
            models.push(await this.__toRawBug(model));
        }

        return models;
    }

    async pushProjectToUser(username, projectId){
        if (this._ProjectModel.findById(new Types.ObjectId(projectId)) != null){
            const user = await this._UserModel.findOne({username: username});
            user.projects.push(projectId);
            return await user.save();
        }
    }

    async modifyProject(id, key, value){
        let project = await this._ProjectModel.findById(new Types.ObjectId(id));

        project[key] = value;

        return this.__toRawProject(await project.save());
    }

    async updateBug(id, newModel){
        await this._BugModel.updateOne({_id: new Types.ObjectId(id)}, {
            projectId: new Types.ObjectId(newModel.projectId),
            name: newModel.name,
            description: newModel.description,
            level: newModel.level,
            archived: newModel.archived
        });
        const model = await this._BugModel.findOne({_id: new Types.ObjectId(id)});

        return this.__toRawBug(model);
    }

    async modifyBug(id, key, value){
        await this._BugModel.updateOne({_id: new Types.ObjectId(id)}, {
            [key]: value
        });
        const model = await this._BugModel.findOne({_id: new Types.ObjectId(id)});

        return this.__toRawBug(model);
    }

    async deleteBug(id){
        return (await this._BugModel.deleteOne({_id: new Types.ObjectId(id)})).deletedCount > 0;
    }

    async deleteProject(id){
        const result = await this._ProjectModel.deleteOne({_id: new Types.ObjectId(id)});

        return result.deletedCount > 0;
    }

    async __toRawProject(project){
        return {
            id: project._id.toString(),
            name: project.name,
            description: project.description,
            ownerUsername: project.ownerUsername
        }
    }

    async __toRawBug(bug){
        return {
            id: bug._id.toString(),
            projectId: bug.projectId.toString(),
            name: bug.name,
            description: bug.description,
            level: bug.level,
            archived: bug.archived
        }
    }

    //Returns the same filter, but with any id reshaped into a 'Schema.ObjectId'
    __convertFilter(filter){
        let result = filter;

        Object.keys(filter).forEach(key => {
            if (key === "projectId" || key == "_id")
                result[key] = new Types.ObjectId(filter[key]);

            if (key == "$array"){
                const arr = filter[key];

                Object.keys(arr).forEach(k => {
                    let v = arr[k];
                    if (k === "_id")
                        v = v.map(i => new Types.ObjectId(i));

                    result[k] = {
                        $in: v
                    };
                });

                delete result[key];
            }
        });

        return result;
    }
}