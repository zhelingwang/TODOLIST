import config from "./../config";
const __idxDB = {
  init() {
    this.initReference();
    this.createObjectStore(config.StoreName);
  },
  initReference() {
    // window.indexedDB =
    //   window.indexedDB ||
    //   window.mozIndexedDB ||
    //   window.webkitIndexedDB ||
    //   window.msIndexedDB;

    window.IDBTransaction =
      window.IDBTransaction ||
      window.webkitIDBTransaction ||
      window.msIDBTransaction;

    window.IDBKeyRange =
      window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
      window.console.log(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      );
    }
  },
  getIDBDatabaseObj(dbName, version, thenCallback) {
    new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, version);
      request.onsuccess = function(event) {
        resolve(event.target.result); // a instance of IDBDatabase obj
      };
      // onupgradeneeded 仅在较新的浏览器中实现了 , 该事件执行完成后触发 onsuccess 事件
      // 也是唯一可以修改数据库结构的地方。在这，可以创建和删除对象存储空间以及构建和删除索引。
      request.onupgradeneeded = function(event) {
        resolve(event.target.result);
      };
      request.onerror = function(event) {
        reject(event);
      };
    })
      .then(thenCallback)
      .catch(err => {
        console.log(err, "get ObjectStore error");
      });
  },
  createObjectStore(keyPath) {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      // autoIncrement: true
      const store = db.createObjectStore(config.StoreName, {
        keyPath: "id"
      });
      store.createIndex("id_idx", "id", { unique: true });
      store.transaction.onerror = function(err) {
        console.log(`create ${config.StoreName} store occur error!`);
      };
      store.transaction.oncomplete = function() {
        console.log(`${config.StoreName} store created!`);
      };
    });
  },
  addData(todoData = []) {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      const transaction = db.transaction([config.StoreName], "readwrite");
      transaction.onerror = function(event) {
        console.log(`open ${config.StoreName} transaction error`, event);
      };
      let objectStore = transaction.objectStore(config.StoreName);
      todoData.forEach(function(todo) {
        let request = objectStore.add(todo);
        request.onsuccess = function(event) {
          // console.log(`add data success`, event);
        };
      });
    });
  },
  deleteData(deleteID) {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      const idbRequest = db
        .transaction([config.StoreName], "readwrite")
        .objectStore(config.StoreName)
        .delete(deleteID);
      idbRequest.onsuccess = function(event) {
        console.log("delete success...");
      };
      idbRequest.onerror = function(err) {
        console.log("delete err : ", err);
      };
    });
  },
  queryData(idStr, successCallback = function() {}) {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      const request = db
        .transaction([config.StoreName])
        .objectStore(config.StoreName)
        .get(idStr);
      request.onsuccess = function(e) {
        // console.log("query result : ", e.target.result);
        successCallback(e.target.result);
      };
    });
  },
  queryDataAll(successCallback = function() {}) {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      const request = db
        .transaction([config.StoreName])
        .objectStore(config.StoreName)
        .getAll();
      request.onsuccess = function(e) {
        // console.log("query all result : ", e.target.result);
        successCallback(e.target.result);
      };
    });
  },
  updateData(idStr, newData = {}) {
    this.queryData(idStr, result => {
      delete newData["id"]; // 因为使用id作为keyPath
      for (const key in newData) {
        if (newData.hasOwnProperty(key))
          if (!result.hasOwnProperty(key)) delete newData[key];
      }
      Object.assign(result, newData);
      this.getIDBDatabaseObj(config.DBName, config.Version, db => {
        const idbObjectStore = db
          .transaction([config.StoreName], "readwrite")
          .objectStore(config.StoreName);
        let newStore = idbObjectStore.put(result);
        newStore.onerror = function(err) {
          console.log("update error", err);
        };
        newStore.onsuccess = function(e) {
          console.log("update success", e);
        };
      });
    });
  },
  useCursor() {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      var objectStore = db
        .transaction(config.StoreName)
        .objectStore(config.StoreName);
      // openCursor(options,direction) , 指定游标的范围和方向
      // https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          console.log(
            "Name for SSN " + cursor.key + " is " + cursor.value.text
          );
          cursor.continue();
        }
      };
    });
  },
  useIndex() {
    this.getIDBDatabaseObj(config.DBName, config.Version, db => {
      var objectStore = db
        .transaction(config.StoreName)
        .objectStore(config.StoreName);
      var index = objectStore.index("id_idx");
      var nameIdx = index.get(2);
      nameIdx.onsuccess = function(event) {
        console.log(event.target.result, "index result 289");
      };
      nameIdx.onerror = function(e) {
        console.log("err line 292 : ", e);
      };
    });
  }
};
__idxDB.init();
export default __idxDB;

/**

 const dbName = "GuanDB";
 let db = null;
 function openDB() {
  const request = window.indexedDB.open(dbName, 1);
  request.onerror = function(event) {
    console.warn("Database error: " + event.target.errorCode);
  };
  request.onsuccess = function(event) {
    db = event.target.result; // a instance of IDBDatabase obj
  };
  return request;
}
 // 1.open IDB
 const request = openDB();
 const customerData = [
 { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
 { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
 ];
 // onupgradeneeded 仅在较新的浏览器中实现了 , 该事件执行完成后触发 onsuccess 事件
 // onupgradeneeded 是我们唯一可以修改数据库结构的地方。在这里面，我们可以创建和删除对象存储空间以及构建和删除索引。
 request.onupgradeneeded = function(e) {
  db = e.target.result;
  //2. create store [创建仓库对象 : 类似mysql中的table]
  let objectStore_customer = db.createObjectStore("customers", {
    keyPath: "ssn"
  }); // {autoIncrement:true}
  // 建立索引,用于通过姓名来搜索客户,姓名有可能重复
  objectStore_customer.createIndex("nameIdx", "name", { unique: false });
  // 建立邮箱索引确保邮箱不会重复
  objectStore_customer.createIndex("emailIdx", "email", { unique: true });

  // 使用事务的 oncomplete 事件确保在插入数据前对象仓库已经创建完毕
  objectStore_customer.transaction.oncomplete = function(event) {
    // 将数据保存到新创建的对象仓库
    //3.启动事务
    addData();
    //deleteData();
    queryData("555-55-5555");
    updateData();
    useCursor();
    useIndex();
  };

  function addData() {
    const transaction = db.transaction(["customers"], "readwrite");
    // 在所有数据添加完毕后的处理
    transaction.oncomplete = function(event) {
      console.log("All done!");
    };
    transaction.onerror = function(event) {
      // 不要忘记错误处理！
    };
    let objectStore = transaction.objectStore("customers");
    customerData.forEach(function(customer) {
      let request = objectStore.add(customer);
      request.onsuccess = function(event) {
        // event.target.result === customer.ssn;
      };
    });
  }
  function deleteData() {
    const idbRequest = db
      .transaction(["customers"], "readwrite")
      .objectStore("customers")
      .delete("444-44-4444");
    idbRequest.onsuccess = function(event) {
      console.log("delete success...");
    };
  }
  function queryData(ssnStr, successCallback = function() {}) {
    const request = db
      .transaction(["customers"])
      .objectStore("customers")
      .get(ssnStr);
    request.onsuccess = function(e) {
      console.log("query result : ", e.target.result);
      successCallback(e);
    };
  }
  function updateData() {
    queryData("555-55-5555", function(e) {
      const idbObjectStore = db
        .transaction(["customers"], "readwrite")
        .objectStore("customers");
      const result = e.target.result;
      result.name = "guanweichang";
      let newStore = idbObjectStore.put(result);
      newStore.onerror = function() {
        console.log("update error");
      };
      newStore.onsuccess = function() {
        console.log("update success");
      };
    });
  }
  function useCursor() {
    // 获取所有对象组成的数组 , 取部分键时游标更高效 : objectStore.getAll().onsuccess = function(event) {
    //   console.log("Got all customers: " + event.target.result);
    // };
    var objectStore = db.transaction("customers").objectStore("customers");
    // openCursor(options,direction) , 指定游标的范围和方向
    // https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        // 取某些值或某部分对象
        console.log("Name for SSN " + cursor.key + " is " + cursor.value.name);
        cursor.continue();
      } else {
        console.log("No more entries!");
      }
    };
  }
  function useIndex() {
    var objectStore = db.transaction("customers").objectStore("customers");
    var index = objectStore.index("nameIdx");
    var nameIdx = index.get("Bill");
    nameIdx.onsuccess = function(event) {
      console.log(event.target.result, "index result");
    };
    nameIdx.onerror = function(e) {
      console.log("++", e);
    };
  }
};

 */
