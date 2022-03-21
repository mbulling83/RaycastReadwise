// Based on Pocket extension
// This is the most promising way so far and is almost working

import { getPreferenceValues, showToast, ToastStyle, Detail, List, Action, ActionPanel} from "@raycast/api";
import { access } from "fs";
import got from "got";
import { Highlight,  Tag, Book, RawHighlight} from "./highlight";
import useSWR from "swr";
import { useEffect } from "react";
import { HTTPError } from "got";
import { internalChildInvariant } from "@raycast/api/types/api/internal";

const preferences = getPreferenceValues();
const accessToken = preferences.token;

const api = got.extend({
  prefixUrl: "https://readwise.io/api",
});

interface FetchBookmarksRequest {
    name?: string;
    state?: string;
    count?: number;
  }

interface FetchBookmarksResponse {
    list: Record<string, RawHighlight>;
  }

export async function fetchHighlights({ name, state, count }: FetchBookmarksRequest = {}): Promise<Array<Highlight>> {

    // TODO: Need to figure out how to parse the saved token rather than the actual one
    const response = await api.get("v2/highlights/", 
        {headers: {Authorization: `Token ${accessToken}`}},  
        {responseType: 'json'});

    const result = JSON.parse(response.body);
    const results = result.results as FetchBookmarksResponse;

    const bookmarks: Array<Highlight> = Object.values(results).map((item) => ({
      id: item.id,
      text: item.text,
      note: item.note,
      location: item.location,
      location_type: item.location_type,
      highlighted_at: item.hightlighted_at,
      url: item.url,
      color: item.color,
      updated: item.updated,
      book_id: item.book_id,
      tags: item.tags
    }));

    return bookmarks;
  }

  export function useHighlights() {
    const { data, error, isValidating} = useSWR<Array<Highlight>, HTTPError>("v2/highlights", fetchHighlights);

    useEffect(() => {
      if (error) {
        if (error.response.statusCode === 401 || error.response.statusCode === 403) {
          showToast(ToastStyle.Failure, "Invalid Credentials", "Check you Readwise extension preferences");
        } else {
          throw error;
        }
      }
    }, [error]);

    return {
      bookmarks: data || [],
      loading: (!data && !error) || isValidating
    };
  }

export default function Search() {
    // const bookmarks = fetchBookmarks();
    const { bookmarks, loading} = useHighlights();

    return (
        <List throttle isLoading={loading} searchBarPlaceholder="Filter highlights...">
            {bookmarks.map((bookmark) => (
            <List.Item
            key={bookmark.id}
            title={bookmark.text}
            actions={
              <ActionPanel>
                <Action.Push  title="Show Details" 
                              target={<Detail markdown = {
                              `${bookmark.text} \\
                              **Tags:**${bookmark.tags}
                              **Link:** [${bookmark.url}](${bookmark.url}) \\
                              **Updated at:** ${bookmark.updated}`} />} />

                



                <Action.CopyToClipboard content={
                              `${bookmark.text}`}/>
                                        
              </ActionPanel>}
            />
        ))    }
        </List>
    )}
