import { 
  getPreferenceValues, 
  ActionPanel, 
  Detail, 
  List, 
  Action, 
  Toast, 
  showToast,
  ToastStyle} from "@raycast/api";

import { highlights } from "./highlights" 
import fetch, { Headers } from "node-fetch";

export default async function () {
  try {
    const { accessToken } = getPreferenceValues();

    const response = await fetch("https://readwise.io/api/v2/highlights/", {
      headers: new Headers({
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      }),
      method: "get"
    });

    const { errors, link } = (await response.json()) as { link: string; errors?: [] };
    if (errors) {
      throw new Error("Invalid URL String");
    }

    await copyTextToClipboard(link);
  } catch (error: any) {
    await showToast(error.toString());
  }
}

