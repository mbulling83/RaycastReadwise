import { List, ActionPanel } from "@raycast/api";
import { useState } from "react";

interface HighlightQuery {
    page_size: number, 
    page: number,
    book_id: number, 
    updated__lt: string,
    updated__gt: string,
    highlighted_at__lt: string,
    highlighted_at__gt: string
}


export default function Command() {
    const [todos, setTodos] = useState<HighlightQuery[]>([]);
  
    function handleCreate(todo: Todo) {
      const newTodos = [...todos, todo];
      setTodos(newTodos);
    }
  
    return (
      <List
        actions={
          <ActionPanel>
            <CreateTodoAction onCreate={handleCreate} />
          </ActionPanel>
        }
      >
        {todos.map((todo, index) => (
          <List.Item key={index} title={todo.title} />
        ))}
      </List>
    );
  }

function CreateTodoForm(props: { onCreate: (todo: Todo) => void }) {
    const { pop } = useNavigation();

    function handleSubmit(values: { title: string }) {
        props.onCreate({ title: values.title, isCompleted: false });
        pop();
    }

    return (
        <Form
        actions={
            <ActionPanel>
            <Action.SubmitForm title="Create Todo" onSubmit={handleSubmit} />
            </ActionPanel>
        }
        >
        <Form.TextField id="title" title="Title" />
        </Form>
    );
    }