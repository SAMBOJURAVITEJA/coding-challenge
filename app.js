let express = require("express");
let DB = null;
let app = express();
app.use(express.json());
let isValid = require("date-fns/isValid");
let format = require("date-fns/format");
module.exports = app;
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let DBpath = path.join(__dirname, "todoApplication.db");
let initializing = async () => {
  try {
    DB = await open({
      filename: DBpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running Properly");
    });
  } catch (e) {
    console.log("error Message");
    process.exit(1);
  }
};
initializing();
var categoryAndStatus = (requestObject) => {
  let { category, status } = requestObject;
  if (category !== undefined && status !== undefined) {
    return true;
  } else {
    return false;
  }
};
var categoryAndPriority = (requestObject) => {
  let { category, priority } = requestObject;
  if (category !== undefined && priority !== undefined) {
    return true;
  } else {
    return false;
  }
};
var category1 = (requestObject) => {
  console.log("Loose");
  let { category } = requestObject;
  if (category !== undefined) {
    return true;
  } else {
    return false;
  }
};

var hasTodo = (requestObject) => {
  let { todo } = requestObject;
  if (todo !== undefined) {
    return true;
  }
};

var hasPriority = (requestObject) => {
  console.log("ravi");
  let { priority } = requestObject;
  if (priority !== undefined) {
    return true;
  } else {
    return false;
  }
};
var hasStatus = (requestObject) => {
  let { status } = requestObject;
  console.log(status);
  if (status !== undefined) {
    return true;
  } else {
    return false;
  }
};
var hasStatusAndPriority = (requestObject) => {
  let { status, priority } = requestObject;
  if (status !== undefined && priority !== undefined) {
    return true;
  } else {
    return false;
  }
};
app.get("/todos/", async (request, response) => {
  let {
    priority = "",
    category = "",
    due_date = "",
    search_q = "",
    status = "",
  } = request.query;
  console.log(search_q);
  let data = "";
  let finalresult = null;
  switch (true) {
    case categoryAndStatus(request.query):
      data = `select * from
           todo where category
            like "${category}" and status like "${status}";`;
      finalresult = await DB.all(data);
      var array = [];
      let got1;
      var modifying = (Object) => {
        let object = {
          id: Object.id,
          todo: Object.todo,
          priority: Object.priority,
          status: Object.status,
          category: Object.category,
          dueDate: Object.due_date,
        };
        array.push(object);
        return array;
      };
      for (let part of finalresult) {
        got1 = modifying(part);
      }
      response.send(got1);
      break;
    case categoryAndPriority(request.query):
      console.log("ravi");
      data = `select * from todo where category like "${category}"
                and priority like "${priority}";`;
      finalresult = await DB.all(data);
      var array = [];
      let got2;
      var modifying = (Object) => {
        let object = {
          id: Object.id,
          todo: Object.todo,
          priority: Object.priority,
          status: Object.status,
          category: Object.category,
          dueDate: Object.due_date,
        };
        array.push(object);
        return array;
      };
      for (let part of finalresult) {
        got2 = modifying(part);
      }
      response.send(got2);
      break;
    case category1(request.query):
      console.log("win");
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        data = `select * from todo where category like "${category}";`;
        finalresult = await DB.all(data);
        var array = [];
        let got3;
        var modifying = (Object) => {
          let object = {
            id: Object.id,
            todo: Object.todo,
            priority: Object.priority,
            status: Object.status,
            category: Object.category,
            dueDate: Object.due_date,
          };
          array.push(object);
          return array;
        };
        for (let part of finalresult) {
          got3 = modifying(part);
        }
        response.send(got3);
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case hasStatusAndPriority(request.query):
      data = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND todo.status like '${status}'
    AND todo.priority like '${priority}';`;
      finalresult = await DB.all(data);
      var array = [];
      let got4;
      var modifying = (Object) => {
        let object = {
          id: Object.id,
          todo: Object.todo,
          priority: Object.priority,
          status: Object.status,
          category: Object.category,
          dueDate: Object.due_date,
        };
        array.push(object);
        return array;
      };
      for (let part of finalresult) {
        got4 = modifying(part);
      }
      response.send(got4);
      break;
    case hasPriority(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        data = `
           select 
           *
           from 
           todo 
          where todo.priority like "${priority}" ;  
             `;
        finalresult = await DB.all(data);
        var array = [];
        let got5;
        var modifying = (Object) => {
          let object = {
            id: Object.id,
            todo: Object.todo,
            priority: Object.priority,
            status: Object.status,
            category: Object.category,
            dueDate: Object.due_date,
          };
          array.push(object);
          return array;
        };
        for (let part of finalresult) {
          got5 = modifying(part);
        }
        response.send(got5);
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;
    case hasStatus(request.query):
      if (status === "TO DO" || status == "IN PROGRESS" || status === "DONE") {
        data = `
             select 
                *
              from 
              todo 
              where 
            status like "${status}";   
               `;
        finalresult = await DB.all(data);
        var array = [];
        let got6;
        var modifying = (Object) => {
          let object = {
            id: Object.id,
            todo: Object.todo,
            priority: Object.priority,
            status: Object.status,
            category: Object.category,
            dueDate: Object.due_date,
          };
          array.push(object);
          return array;
        };
        for (let part of finalresult) {
          got6 = modifying(part);
        }
        response.send(got6);
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    default:
      console.log(search_q);
      data = `select 
                        *
                      from 
                     todo 
                    where 
                todo 
                like "%${search_q}%" ; `;

      finalresult = await DB.all(data);
      var array = [];
      let got7;
      var modifying = (Object) => {
        let object = {
          id: Object.id,
          todo: Object.todo,
          priority: Object.priority,
          status: Object.status,
          category: Object.category,
          dueDate: Object.due_date,
        };
        array.push(object);
        return array;
      };
      for (let part of finalresult) {
        got7 = modifying(part);
      }
      response.send(got7);
  }
});

app.get("/todos/:todoId/", async (request, response) => {
  console.log("ravi");
  let { todoId } = request.params;
  let data = `select * from todo where id=${todoId};`;
  let finalresult = await DB.get(data);
  let got7;
  var modifying = (Object) => {
    let object = {
      id: Object.id,
      todo: Object.todo,
      priority: Object.priority,
      status: Object.status,
      category: Object.category,
      dueDate: Object.due_date,
    };
    return object;
  };

  got7 = modifying(finalresult);
  response.send(got7);
});
app.get("/agenda/", async (request, response) => {
  let formedDate = format(new Date(2021, 0, 12), "yyyy-MM-dd");
  console.log(formedDate);
  let valid = isValid(new Date(2021, 0, 21));
  if (valid) {
    let data = `select * from todo where due_date="${formedDate}";`;
    let finalresult = await DB.all(data);
    console.log(finalresult);

    console.log(typeof formedDate);
    var array = [];
    let got7;
    var modifying = (Object) => {
      let object = {
        id: Object.id,
        todo: Object.todo,
        priority: Object.priority,
        status: Object.status,
        category: Object.category,
        dueDate: Object.due_date,
      };
      array.push(object);
      return array;
    };
    for (let part of finalresult) {
      got7 = modifying(part);
    }
    console.log(got7);
    response.send(got7);
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

app.post("/todos/", async (request, response) => {
  let { id, todo, priority, status, category, dueDate } = request.body;
  let data = `insert into todo (id,todo,priority,status,category,due_date)
    values
    (${id},"${todo}","${priority}","${status}","${category}",${dueDate});`;
  let finalresult = await DB.run(data);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  let {
    status = "",
    priority = "",
    todo = "",
    dueDate = "",
    category = "",
  } = request.body;
  let { todoId } = request.params;
  let data = "";
  let finalresult = "";
  switch (true) {
    case hasStatus(request.body):
      if (status === "TO DO" || status == "IN PROGRESS" || status === "DONE") {
        data = `update todo
            set status ="${status}"
            where id= ${todoId};`;
        finalresult = await DB.run(data);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case hasPriority(request.body):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        data = `update todo
            set priority ="${priority}"
            where id =${todoId};`;
        finalresult = await DB.run(data);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case hasTodo(request.body):
      data = `update todo
            set todo ="${todo}"
            where id =${todoId};`;
      finalresult = await DB.run(data);
      response.send("Todo Updated");
      break;
    case category1(request.body):
      console.log("ravi");
      if (
        category === "WORK" ||
        category === "HOME" ||
        category === "LEARNING"
      ) {
        data = ` update todo set category ="${category}" where id=${todoId};`;
        finalresult = await DB.run(data);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    default:
      let { dueDate } = request.body;
      console.log(dueDate);
      if (isValid(dueDate)) {
        let data = `update todo set due_date=${dueDate} where id=${todoId};`;
        let finalresult = await DB.run(data);
        response.send(finalresult);
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
      break;
  }
});

app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let data = `delete from todo where todo.id=${todoId}`;
  let finalresult = await DB.run(data);
  response.send("Todo Deleted");
});
