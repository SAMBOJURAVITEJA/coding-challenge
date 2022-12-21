let express = require("express");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
let app = express();
app.use(express.json());
module.exports = app;
let DB = null;
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let DBpath = path.join(__dirname, "covid19IndiaPortal.db");
let initializingDb = async () => {
  try {
    DB = await open({
      filename: DBpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running properly");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializingDb();
app.post("/login", async (request, response) => {
  let { username, password } = request.body;
  let userIdentity = `select * from user where username="${username}";`;
  let userIdentityResult = await DB.get(userIdentity);

  if (userIdentityResult === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    let hashedPassword = await bcrypt.compare(
      password,
      userIdentityResult.password
    );
    console.log(hashedPassword);
    if (hashedPassword === false) {
      response.status(400);
      response.send("Invalid password");
    } else {
      let payload = { username: username };
      let jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      console.log(jwtToken);
      response.send({ jwtToken });
    }
  }
});
let middleWare = (request, response, next) => {
  let Authorization = request.headers["authorization"];
  console.log(Authorization);
  let jwtToken;
  if (Authorization !== undefined) {
    jwtToken = Authorization.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(400);
    response.send("Invalid JWT Token1");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, user) => {
      if (error) {
        response.status(400);
        response.send("Invalid JWT Token2");
      } else {
        next();
      }
    });
  }
};

app.get("/states/", middleWare, async (request, response) => {
  let data = `select * from state; `;
  let result = DB.all(data);
  var array = [];

  var objectConversion = (passedObject) => {
    let object = {
      stateId: passedObject.state_id,
      stateName: passedObject.state_name,
      population: passedObject.population,
    };
    array.push(object);
    return array;
  };
  for (let part of result) {
    let finalResult = objectConversion(part);
  }
  response.send(finalResult);
});

app.get("/states/:stateId/", middleWare, async (request, response) => {
  let { stateId } = request.params;
  let data = `select * from state where state_id =${stateId}; `;
  let result = DB.get(data);

  var objectConversion = (passedObject) => {
    let object = {
      stateId: passedObject.state_id,
      stateName: passedObject.state_name,
      population: passedObject.population,
    };
    return object;
  };
  let finalResult = objectConversion(result);
  response.send(finalResult);
});

app.post("/districts/", middleWare, async (request, response) => {
  let { districtName, stateId, cases, cured, active, death } = request.body;
  let data = ` insert into district (
      district_name,stateId,cases,cured,active,death)
      values
      ("${districtName}",${stateId},${cases},${cured},${active},
      ${death});
      `;
  let finalResult = await DB.run(data);
  response.send("District Successfully Added");
});
app.get("/districts/:districtId/", middleWare, async (request, response) => {
  let { districtId } = request.params;
  let data = ` select * from district where district_id =${districtId}
      `;
  let result = await DB.get(data);
  var objectConversion = (passedObject) => {
    let object = {
      districtId: passedObject.district_id,
      districtName: passedObject.district_name,
      stateId: passedObject.state_id,
      cases: passedObject.cases,
      cured: passedObject.cured,
      active: passedObject.active,
      deaths: passedObject.deaths,
    };
    return object;
  };
  let finalResult = objectConversion(result);
  response.send(finalResult);
});
app.delete("/districts/:districtId/", middleWare, async (request, response) => {
  let { districtId } = request.params;
  let data = ` delete from district where district_id =${districtId}`;
  let result = await DB.run(data);
  response.send("District Removed");
});

app.put("/districts/:districtId/", middleWare, async (request, response) => {
  let { districtName, stateId, cases, cured, active, deaths } = request.body;
  let data = `update district  set  district_name="${districtName}",
state_id=${stateId},
cases=${cases},
cured=${cured},
active=${active},
deaths=${deaths}
where district_id=${districtId};
`;
  let result = await DB.run(data);
  response.send("District Details Updated");
});
app.get("/states/:stateId/stats/", middleWare, async (request, response) => {
  let { stateId } = request.params;
  let data = `select * from state where state_id =${stateId}; `;
  let result = DB.get(data);

  var objectConversion = (passedObject) => {
    let object = {
      stateId: passedObject.state_id,
      stateName: passedObject.state_name,
      population: passedObject.population,
    };
    return object;
  };
  let finalResult = objectConversion(result);
  response.send(finalResult);
});
