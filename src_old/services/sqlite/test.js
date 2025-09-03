import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase({ name: "mydatabase.db", location: "default" });

//Tao bang cuoc tro chuyen
const createTest = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS 
            TEST (
                pk INTEGER PRIMARY KEY AUTOINCREMENT, 
                emp_id TEXT, 
                card TEXT,
                time TEXT,
                status TEXT
            )`,
      [],
      (tx, result) => {
        console.log("Table created successfully");
      },
      (error) => {
        console.error("Error creating table:", error);
      }
    );
  });
};

const insertTest = (
  user_id,
  sender_id,
  image,
  title,
  content,
  seen_yn,
  time
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO TEST (
                    user_id, sender_id, 
                    image, title, content,
                    seen_yn, time
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, sender_id, image, title, content, seen_yn, time],
        (tx, result) => {
          console.log("test inserted successfully");
          console.log("result: ", result);
          resolve(result);
        },
        (error) => {
          console.error("Error inserting test:", error);
          reject(error);
        }
      );
    });
  });
};

//Lay tat ca cuoc tro chuyen tu co so du lieu
const getAllTest = (user_id) => {
  // tx.executeSql(
  //     "SELECT * FROM TEST v where v.user_id = ? AND v.del_if = 0 ORDER BY v.time DESC",
  //     [user_id],
  //     (tx, result) => {
  //       const Tests = result.rows.raw();
  //       resolve(Tests);
  //     },
  //     (error) => {
  //       console.error("Error getting all test:", error);
  //       reject(error);
  //     }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM TEST v ORDER BY v.time DESC",
        [],
        (tx, result) => {
          const Tests = result.rows.raw();
          resolve(Tests);
        },
        (error) => {
          console.error("Error getting all test:", error);
          reject(error);
        }
      );
    });
  });
};

//Xoa cuoc tro chuyen
const deleteTest = (pk) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE TEST SET del_if = ? WHERE pk = ?",
      [pk, pk],
      (tx, result) => {
        console.log("Test deleted successfully");
      },
      (error) => {
        console.error("Error deleting Test:", error);
      }
    );
  });
};

//Cap nhat cuoc tro chuyen
const updateTest = (pk, content, seen_yn, time, status_notification) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE TEST 
                SET content = ?,
                    seen_yn = ?, time = ?,
                    status_notification = ?
                WHERE pk = ?`,
        [content, seen_yn, time, status_notification, pk],
        (tx, result) => {
          console.log("Test updated successfully");
          resolve(result);
        },
        (error) => {
          console.error("Error updating Test:", error);
          reject(error);
        }
      );
    });
  });
};

export default { createTest, getAllTest, deleteTest, updateTest };
