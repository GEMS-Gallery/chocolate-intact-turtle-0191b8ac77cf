import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";

actor {
  type Task = {
    id: Nat;
    text: Text;
    category: Nat;
  };

  var tasks: [Task] = [];
  var nextId: Nat = 0;

  public func addTask(text: Text, category: Nat) : async Nat {
    let task: Task = {
      id = nextId;
      text = text;
      category = category;
    };
    tasks := Array.append(tasks, [task]);
    nextId += 1;
    nextId - 1
  };

  public query func getTasks() : async [Task] {
    tasks
  };

  public func deleteTask(id: Nat) : async Bool {
    tasks := Array.filter(tasks, func(task: Task) : Bool { task.id != id });
    true
  };
}