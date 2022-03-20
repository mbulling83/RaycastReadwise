import { List } from "@raycast/api";
import { useEffect, useState } from "react";
import Parser from "rss-parser";

const parser = new Parser();

interface State {
  items?: Parser.Item[];
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchStories() {
      try {
        const feed = await parser.parseURL(
          "https://hnrss.org/frontpage?description=0&count=25"
        );
        setState({ items: feed.items });
      } catch (error) {
        setState({
          error:
            error instanceof Error ? error : new Error("Something went wrong"),
        });
      }
    }

    fetchStories();
  }, []);

  return (
    <List isLoading={!state.items && !state.error}>
      {state.items?.map((item, index) => (
        <StoryListItem key={item.guid} item={item} index={index} />
      ))}
    </List>
  );
}

function StoryListItem(props: { item: Parser.Item; index: number }) {
    const icon = getIcon(props.index + 1);
    const points = getPoints(props.item);
    const comments = getComments(props.item);
  
    return (
      <List.Item
        icon={icon}
        title={props.item.title ?? "No title"}
        subtitle={props.item.creator}
        accessoryTitle={`👍  ${points}    💬  ${comments}`}
      />
    );
  }
  
const iconToEmojiMap = new Map<number, string>([
[1, "1️⃣"],
[2, "2️⃣"],
[3, "3️⃣"],
[4, "4️⃣"],
[5, "5️⃣"],
[6, "6️⃣"],
[7, "7️⃣"],
[8, "8️⃣"],
[9, "9️⃣"],
[10, "🔟"],
]);

function getIcon(index: number) {
    return iconToEmojiMap.get(index) ?? "⏺";
}

function getPoints(item: Parser.Item) {
const matches = item.contentSnippet?.match(/(?<=Points:\s*)(\d+)/g);
return matches?.[0];
}

function getComments(item: Parser.Item) {
const matches = item.contentSnippet?.match(/(?<=Comments:\s*)(\d+)/g);
return matches?.[0];
}