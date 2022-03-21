import { List, getPreferenceValues} from "@raycast/api";
import { useEffect, useState } from "react";
import Parser, { Item } from "rss-parser";
import axios from "axios";
import {Highlight, Tag} from "highlight"

interface State {
  items?: Highlight[];
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
        const res2 = JSON.parse(res.data.replace(")]}',", ""));
        setState({ items: res2.results.items });
        console.log("hello world")

      } catch (error) {
        setState({
          error:
            error instanceof Error ? error : new Error("Something went wrong"),
        });
      }
    }


    fetchHighlights();
    
    // console.log(res2)
  }, []);

  return (
    <List isLoading={!state.items && !state.error}>
      {state.items?.map((item, index) => (
        <HighlightListItem key={item.id} item={item} index={index} />
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
  