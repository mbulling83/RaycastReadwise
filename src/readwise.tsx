// Based on Pocket extension
// This is the most promising way so far and is almost working

import { getPreferenceValues, showToast, ToastStyle, Detail, List, Action, ActionPanel} from "@raycast/api";
import { access } from "fs";
import got from "got";
import { Highlight,  Tag, Book, RawHighlight} from "./highlight";
import useSWR from "swr";
import { useEffect } from "react";
import { HTTPError } from "got";

const preferences = getPreferenceValues();
const accessToken = preferences.token;
console.log(accessToken)

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


export async function fetchBookmarks({ name, state, count }: FetchBookmarksRequest = {}): Promise<Array<Highlight>> {

    // TODO: Need to figure out how to parse the saved token rather than the actual one
    const response = await api.get("v2/highlights/", {
        headers: {Authorization: "Token 4rCYVm2ZcDANTQT7C3X00vER6ENN6biAdpKGYO7P9KSBuQRw2f"}
    },  {responseType: 'json'});

    const result = JSON.parse(response.body);
    const results = result.results as FetchBookmarksResponse;

    const bookmarks: Array<Highlight> = Object.values(results).map((item) => ({
      id: item.id,
      text: item.text
    }));

    return bookmarks;
  }

  export function useBookmarks() {
    const { data, error, isValidating} = useSWR<Array<Highlight>, HTTPError>("v2/highlights", fetchBookmarks);

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
    const { bookmarks, loading} = useBookmarks();
    console.log(bookmarks)

    return (
        <List throttle isLoading={loading} searchBarPlaceholder="Filter highlights...">
            {bookmarks.map((bookmark) => (
            <List.Item
            key={bookmark.id}
            title={bookmark.text}
            actions={
              <ActionPanel>
                <Action.Push  title="Show Details" 
                              target={<Detail markdown = {`${bookmark.text}`} />} />
              </ActionPanel>}
            />
        ))    }
        </List>
    )}
