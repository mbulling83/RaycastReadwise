interface Highlight {
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
    "tags": tags[]
}

interface tags {
    "id": BigInt,
    "name": string
}