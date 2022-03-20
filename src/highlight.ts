export interface Highlight {
    "id": BigInt,
    "text": string,
    "note": string,
    "location": string,
    "location_type": string,
    "highlighted_at": string,
    "url": string,
    "color": string,
    "updated": string,
    "book_id": BigInt,
    "tags": Tag[]
}

export interface Tag {
    "id": BigInt,
    "name": string
}

export interface Book {
    "id": BigInt,
    "title": string,
    "author": string,
    "category": string,
    "source": string,
    "num_highlights": number,
    "last_highlight_at": string,
    "updated": string,
    "cover_image_url": string,
    "highlights_url": string,
    "source_url": string,
    "asin": string,
    "tags": tag[]
}