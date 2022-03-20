import { List } from "@raycast/api";
import { useEffect, useState } from "react";
import Parser, { Item } from "rss-parser";
import { axios } from "axios" 

const parser = new Parser();

interface State {
  items?: Parser.Item[];
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchHighlights() {
      try {

        const preferences = getPreferenceValues();
        const res = await axios.get(
              `https://readwise.io/api/v2/highlights/`, 
              {headers: {'Authorization': 'Token ${preferences.token}'
              }}
        );
        const highlightsData: highlightsdata = JSON.parse(res.data.replace(")]}',", ""));
        setState({ items: res.results.items });

      } catch (error) {
        setState({
          error:
            error instanceof Error ? error : new Error("Something went wrong"),
        });
      }
    }

    fetchHighlights();
  }, []);

  return (
    <List isLoading={!state.items && !state.error}>
      {state.items?.map((item, index) => (
        <HighlightListItem key={item.text} item={item} index={index} />
      ))}
    </List>
  );
}

function HighlightListItem(props: { item: Item; index: number }) {
  
    return (
      <List.Item
        title={props.item.text ?? "No title"}
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
