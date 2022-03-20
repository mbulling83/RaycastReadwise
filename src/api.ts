import axios from "axios";
import { getPreferenceValues, ActionPanel, Detail, List, Action } from "@raycast/api";

const preferences = getPreferenceValues();

type UseSearchReturn = { items: VolumeItem[] | undefined; loading: boolean };

function useSearch(query: string | undefined): UseSearchReturn {
  const [items, setItems] = useState<undefined | VolumeItem[]>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  async function searchBooks(query: string) {
    try {
      setLoading(true);
      const response = await axios.get<GoogleBooksResponse>(
        `https://readwise.io/api/v2/highlights/`,{
            headers: {
                'Authorization': 'Token 4rCYVm2ZcDANTQT7C3X00vER6ENN6biAdpKGYO7P9KSBuQRw2f'
            }
          }
      );
      setLoading(false);
      setItems(response?.data?.items);
    } catch (error: any) {
      setItems([]);
      console.error(error?.response?.data);
      error?.response?.data
        ? await showToast(
            ToastStyle.Failure,
            "Something went wrong",
            `${error?.response?.data.error?.code} - ${error?.response?.data.error.message}`
          )
        : await showToast(ToastStyle.Failure, "Something went wrong");
    }
  }
  useEffect(() => {
    if (query) {
      searchBooks(query).then((r) => r);
    }
  }, [query]);

  return { items, loading };
}

export { useSearch };