import {
  deleteTask,
  getTasks,
  initDatabase,
  insertTask,
  toggleComplete,
} from "@/db/database";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TasksScreen() {
  const [task, setTask] = useState<string>(""),
    [tasks, setTasks] = useState<any[]>([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    (async () => {
      await initDatabase();
      await loadTasks();
    })();
  }, []);

  const handleAdd = async () => {
    if (!task.trim()) return;
    await insertTask(task);
    setTask("");
    await loadTasks();
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await toggleComplete(id, !completed);
    await loadTasks();
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    await loadTasks();
    //setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <View style={{ padding: 20, paddingTop: StatusBar.currentHeight }}>
      <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Write Task . . ."
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Add task" onPress={handleAdd} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: item.completed ? "springgreen" : "deepskyblue",
              borderRadius: 4,
              padding: 6,
              margin: 6,
            }}
            onPress={() => handleToggle(item.id, item.completed)}
            onLongPress={() => handleDelete(item.id)}
          >
            <Text style={{ fontSize: 18, marginVertical: 8 }}>
              {item.completed ? "yes" : "No"} - {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
