import { getPreferenceValues, ActionPanel, Detail, List, Action } from "@raycast/api";

const preferences = getPreferenceValues();

export default function Command() {
  return (
    <List>
      <List.Item
        icon="list-icon.png"
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
        <List.Item
        icon="list-icon.png"
        title="Greeting 2"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="## Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
