export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'text' : IDL.Text,
    'category' : IDL.Nat,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Nat], []),
    'deleteTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
