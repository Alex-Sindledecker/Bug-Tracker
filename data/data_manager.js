export class DataManager{
    constructor(database){
        this.database = database;
        this.password = null;
    }

    async initDb(dbUrl){
        await this.database.init(dbUrl);
    }

    async closeDb(){
        await this.database.disconnect();
    }

    async createNewUser(username, password){
        return await this.database.addUser(username, password);
    }

    async getUser(username){
        return await this.database.getUser(username);
    }

    async assignProjectOwner(projectId, newOwnerUsername){
        if (this.getUser(newOwnerUsername) != null)
            return this.database.modifyProject(projectId, "ownerUsername", newOwnerUsername);
        return null;
    }

    async giveProjectAccess(projectId, username){
        this.database.pushProjectToUser(username, projectId);
    }

    async createProject(creatorUsername, name, description){
        const model = await this.database.addProject(creatorUsername, name, description);
        return model;
    }

    async createBug(projectId, name, description, level){                
        return this.database.addBug(projectId, level, name, description);
    }

    async getProject(id){
        return this.database.getProject(id);
    }

    //Returns all projects that 'username' is involved in
    async getProjects(username){
        const user = await this.getUser(username);
        return this.database.getProjects({
            $array: {
                _id: user.projects
            }
        });
    }

    async getBug(id){
        return this.database.getBug(id);
    }

    async getBugs(projectId){
        return this.database.getBugs(projectId, {
            projectId: projectId,
            archived: false
        });
    }

    async getArchivedBugs(projectId){
        return this.database.getBugs(projectId, {
            projectId: projectId,
            archived: true
        });
    }

    async archiveBug(id){
        this.database.modifyBug(id, "archived", true);
    }

    async unarchiveBug(id){
        this.database.modifyBug(id, "archived", false);
    }

    async deleteBug(id){
        return this.database.deleteBug(id);
    }

    async deleteProject(id){
        return this.database.deleteProject(id);
    }
}