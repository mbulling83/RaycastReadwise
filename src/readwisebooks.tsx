// Get the list of books a user has

import { getPreferenceValues, showToast, ToastStyle, Detail, List, Action, ActionPanel} from "@raycast/api";
import { access } from "fs";
import got from "got";
import { Highlight,  Tag, Book, RawHighlight, RawBook} from "./highlight";
import useSWR from "swr";
import { useEffect } from "react";
import { HTTPError } from "got";
import { internalChildInvariant } from "@raycast/api/types/api/internal";
import { fetchHighlights, useHighlights } from "./readwise";

const preferences = getPreferenceValues();
const accessToken = preferences.token;

const api = got.extend({
  prefixUrl: "https://readwise.io/api",
});

interface FetchBooksRequest {
    name?: string;
    state?: string;
    count?: number;
  }

interface FetchBooksResponse {
    list: Record<string, RawBook>;
  }

export async function fetchBooks({ name, state, count }: FetchBooksRequest = {}): Promise<Array<Book>> {

    // TODO: Need to figure out how to parse the saved token rather than the actual one
    const response = await api.get("v2/books?category=books&page_size=500", 
        {headers: {Authorization: `Token ${accessToken}`}},
        {responseType: 'json'}
        );

    const result = JSON.parse(response.body);
    const results = result.results as FetchBooksResponse;

    const books: Array<Book> = Object.values(results).map((item) => ({
      id: item.id,
      title: item.title,
      author: item.author,
      category: item.category,
      source: item.source,
      num_highlights: item.num_highlights,
      last_highlight_at: item.last_highlighted_at,
      updated: item.updated,
      cover_image_url: item.cover_image_url,
      highlights_url: item.highlights_url,
      source_url: item.source_url,
      asin: item.asin,
      tags: item.tags
    }));

    return books.sort((a, b) => b.num_highlights - a.num_highlights)
  }

  export function useBooks() {
    const { data, error, isValidating} = useSWR<Array<Book>, HTTPError>("v2/books", fetchBooks);

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
      books: data || [],
      loading: (!data && !error) || isValidating
    };
  }

export default function Search() {
    // const bookmarks = fetchBookmarks();
    const { books, loading} = useBooks();

    const contentTypes = [
      { id: 1, name: "books" },
      { id: 2, name: "articles" },
      { id: 3, name: "tweets"},
      { id: 4, name: "supplementals"},
      { id: 5, name: "podcasts"}
    ];

    return (
        <List 
          throttle 
          isLoading={loading} 
          searchBarPlaceholder="Filter books..."
        >
            {books.map((book) => (
            <List.Item
            key={book.id}
            title={book.title}
            highlights={book.num_highlights}
            subtitle={book.author}
            accessoryTitle={`${book.num_highlights}`}
            actions={
              <ActionPanel>
                <Action.Push  title={"Show highlights from book"} 
                              target={ 
                                <ShowHighlights
                                key={book.id} 
                                item={book.id} /> } />

                <Action.Push  title="Show Book Details" 
                              target={<Detail markdown = {
                              `###${book.title} \\
                              **Author:**${book.author} \\
                              **Link:** [Click here for highlights](${book.highlights_url}) \\
                              **Updated at:** ${book.updated}`} />} />

                <Action.CopyToClipboard 
                              title="Copy Title, Author and Link"
                              content={`${book.title} by ${book.author}, ${book.highlights_url}`}/>
                                        
              </ActionPanel>}
            />
        ))    }
        </List>
    )}

export function ShowHighlights(book_id) {

  const { bookmarks, loading} = useBookHighlights(book_id.item);

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
                              **Tags:**${bookmark.tags} \\
                              **Link:** [${bookmark.url}](${bookmark.url}) \\
                              **Updated at:** ${bookmark.updated}`} />} />



                <Action.CopyToClipboard content={
                              `${bookmark.text}`}/>
                                        
              </ActionPanel>}
            />
        ))    }
        </List>
    )}


// This and the following function can probably be abstracted into a single function with fetchHiglights pretty soon
export async function fetchBookHighlights(book_id, { name, state, count }: FetchBookmarksRequest = {}): Promise<Array<Highlight>> {
  
  const url = `v2/highlights?book_id=${book_id}`


  // TODO: Need to figure out how to parse the saved token rather than the actual one
  const response = await api.get(url, 
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

export function useBookHighlights(book_id) {
  const { data, error, isValidating} = useSWR<Array<Highlight>, HTTPError>(book_id, fetchBookHighlights);

  console.log(data)

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


