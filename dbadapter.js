var pgp = require("pg-promise")(/*options*/);

function PostgresDBAdapter() {
  var db = pgp(
    process.env.DATABASE_URL ||
      "postgres://hoalvaiuiinzfz:fb0ef388ce38a3145f7eebe4722223000293e22c087f3ad9998e2b402c8f1ae3@ec2-18-233-207-22.compute-1.amazonaws.com:5432/df0b9kkga3b512"
  );

  function getObjectFromStorage(tableName, callback) {
    db.any("SELECT * FROM " + tableName).then(function (result) {
      var objects = {};
      (result || []).forEach(function (item) {
        objects[item.id] = item;
      });
      callback(objects);
    });
  }

  function addSurvey(name, callback) {
    db.one("INSERT INTO surveys (name, json) VALUES($1, $2) RETURNING *", [
      name,
      "{}",
    ]).then(callback);
  }
  function getResults(postId, callback) {
    db.any("SELECT * FROM results WHERE postid=$1", [postId]).then(function (
      data
    ) {
      //console.log(JSON.stringify(data));
      var results = (data || []).map(function (item) {
        return item["json"];
      });
      callback(results);
    });
  }

  function postResults(postId, json, callback) {
    db.one("INSERT INTO results (postid, json) VALUES($1, $2) RETURNING *", [
      postId,
      json,
    ]).then(callback);
  }

  function addImage(name, email, callback) {
    db.one("INSERT INTO files (name, email) VALUES($1, $2) RETURNING *", [
      name,
      email,
    ]).then(callback);
  }

  function addImage(name, email, callback) {
    db.one("INSERT INTO files (name, email) VALUES($1, $2) RETURNING *", [
      name,
      email,
    ]).then(callback);
  }

  function getImages(callback) {
    db.any("SELECT * FROM files ").then(function (data) {
      callback(data);
    });
  }

  function deleteSurvey(surveyId, callback) {
    db.one("DELETE FROM surveys WHERE id=$1 RETURNING *", [surveyId]).then(
      callback
    );
  }

  function updateSurvey(id, callback) {
    console.log(id);
    db.any("UPDATE surveys SET available = FALSE WHERE id <> $1", [id]).then(
      (data) => {
        db.one(
          "UPDATE surveys SET available = TRUE WHERE id = $1 RETURNING *",
          [id]
        ).then(callback);
        // callback();
      }
    );
  }

  function changeName(id, name, callback) {
    console.log("THIS IS THE NAME: " + name + " ID: " + id);
    db.one("UPDATE surveys SET name = $1 WHERE id = $2 RETURNING *", [
      name,
      id,
    ]).then(callback);
  }

  function storeSurvey(id, json, callback) {
    db.one("UPDATE surveys SET json = $1 WHERE id = $2 RETURNING *", [
      json,
      id,
    ]).then(callback);
  }

  function getSurveys(callback) {
    var surveys = {
      MySurvey1: {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "radiogroup",
                choices: ["item1", "item2", "item3"],
                name: "question from survey1",
              },
            ],
          },
        ],
      },
      MySurvey2: {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "checkbox",
                choices: ["item1", "item2", "item3"],
                name: "question from survey2",
              },
            ],
          },
        ],
      },
    };
    getObjectFromStorage("surveys", function (objects) {
      if (Object.keys(objects).length > 0) {
        callback(objects);
      } else {
        callback(surveys);
      }
    });
    // if(count($result) == 0) {
    //     $id1 = $this->addSurvey('MySurvey1');
    //     $this->storeSurvey($id1, $surveys['MySurvey1']);
    //     $id2 = $this->addSurvey('MySurvey2');
    //     $this->storeSurvey($id2, $surveys['MySurvey2']);
    //     $result = surveys;
    // }
  }

  return {
    addSurvey: addSurvey,
    getSurvey: function (surveyId, callback) {
      getSurveys(function (result) {
        callback(JSON.parse(result[surveyId].json));
      });
    },
    storeSurvey: storeSurvey,
    addImage: addImage,
    getImages: getImages,
    getSurveys: getSurveys,
    deleteSurvey: deleteSurvey,
    postResults: postResults,
    getResults: getResults,
    changeName: changeName,
    updateSurvey: updateSurvey,
  };
}

module.exports = PostgresDBAdapter;
