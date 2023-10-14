class Database{
    constructor(){}
    addBug(){}
}

//Stores data in the instance of the application - all data is lost when the app stops
export class InstanceDatabase extends Database{
    constructor(){
        super();
        this.bugs = [];
        this.nextId = 1;
    }

    addBug(projectId, level, name, description){
        const model = {
            id: this.nextId,
            projectId: projectId,
            level: level,
            name: name,
            description: description
        };
        this.nextId += 1;

        return model;
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

export class BugManager{
    constructor(database){
        this.db = database;
        this.project = 0;
    }

    setTargetProject(projectId){
        this.project = projectId;
    }

    makeBug(level, name, description){
        if (this.project === 0)
            throw "No target project! Use 'BugManager.setTargetProject' to set a project to make the bug in!";

        return this.db.addBug(this.project, level, name, description);
    }
}