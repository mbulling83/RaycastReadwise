import { 
  getPreferenceValues, 
  ActionPanel, 
  Detail, 
  List, 
  Action, 
  Toast, 
  showToast,
  ToastStyle} from "@raycast/api";

import { useEffect } from "react";

import { Highlight, Book, Tag } from "./highlight" 
import fetch, { Headers } from "node-fetch";

export default function RecentHighlightList() {
  const [state, setState] = useState<Trend[]>();
  const { accessToken } = getPreferenceValues();
  
  useEffect(() => {
    async function fetch() {
      const trends = await fetchTrends();
      setState(trends);
    }
    fetch();
  }, []);

  return (
    <List isLoading={state === undefined}>
      {state?.map((Highlight) => (
        <List.Section title={Highlight.text} key={Highlight.id}>
          {Highlight.items.map((item) => (
            <HighlightListItem key={item?.id} data={item} />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

function HighlightListItem(props: { data: Highlight }) {
  const highlightItem = props.data;

  return (
    <List.Item
      id={highlightItem.id + ""}
      text={highlightItem.text}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open Highlight in Browser"
            url={highlightItem.url}
          />
        </ActionPanel>
      }
    />
  );
}

async function fetchHighlights(): Promise<Trend[]> {
  try {
    const preferences = getPreferenceValues();

    const res = await axios.get(
      `https://trends.google.com/trends/api/dailytrends?hl=${preferences.lang}&tz=-540&geo=${preferences.country}`
    );
    const trendData: Daily = JSON.parse(res.data.replace(")]}',", ""));

    const result: Trend[] = [];
    let lastIndex = 0;

    trendData.default.trendingSearchesDays.forEach((day) => {
      const newItem: Trend = {
        date: day.formattedDate,
        items: [],
      };
      result.push(newItem);

      day.trendingSearches.forEach((item, index) => {
        const article = decode(item.articles[0].title);
        newItem.items.push({
          id: lastIndex++,
          idx: index < 9 ? String(++index) : "etc",
          name: item.title.query,
          formattedTraffic: item.formattedTraffic,
          article: article,
          articleUrl: item.articles[0].url,
          imageUrl: item.image.imageUrl ?? "",
          trendUrl: "https://trends.google.com" + item.title.exploreLink,
          keyword: article.split(" "),
        });
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    showToast(ToastStyle.Failure, "Could not load trends");
    return Promise.resolve([]);
  }
}
